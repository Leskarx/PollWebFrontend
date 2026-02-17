import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Vote, AlertCircle } from 'lucide-react';
import { fetchPoll } from '../services/api.fetchPoll';
import { submitVote } from '../services/api.vote';
import { io } from 'socket.io-client';
import PollSkeleton from './PollSkeleton';
import Toast from "./Toast";

export default function PollVoting() {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  // LOAD POLL
  useEffect(() => {
    loadPoll();
  }, [pollId]);

  const loadPoll = async () => {
    setLoading(true);
    try {
      const data = await fetchPoll(pollId);
      setPoll(data);

      const voted = localStorage.getItem(`poll_${pollId}_voted`);
      if (voted) setHasVoted(true);
    } catch (err) {
      setError(err.message || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  // SOCKET CONNECTION 
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    // const socket = io("http://localhost:5000");

    socket.emit("join_poll", pollId);

    socket.on("vote_update", (updatedOptions) => {
      // console.log("LIVE UPDATE RECEIVED:", updatedOptions);
      setPoll(prev => ({
        ...prev,
        options: updatedOptions
      }));
    });

    return () => socket.disconnect();
  }, [pollId]);

  // SELECT OPTION
  const handleSelect = (optionId) => {
    if (hasVoted) return;
    setSelected(optionId);
  };

  // SUBMIT VOTE
  const handleSubmit = async () => {
    if (!selected) {
      setToast({ type: 'error', message: 'Select an option first' });
      return;
    }

    setSubmitting(true);

    try {
      await submitVote(pollId, selected);

      localStorage.setItem(`poll_${pollId}_voted`, 'true');
      setHasVoted(true);

      // Instant UI update
      setPoll(prev => ({
        ...prev,
        options: prev.options.map(o =>
          o._id === selected
            ? { ...o, voteCount: o.voteCount + 1 }
            : o
        )
      }));

      // Also reload fresh data from DB
      await loadPoll();

      setToast({ type: 'success', message: 'Vote submitted!' });

    } catch (err) {
      // Check if the error is "Already voted"
      const errorMessage = err.response?.data?.message || err.message || 'Vote failed';
      
      if (errorMessage.toLowerCase().includes('already voted')) {
        // User has already voted - disable UI and show results
        localStorage.setItem(`poll_${pollId}_voted`, 'true');
        setHasVoted(true);
        
        // Refresh poll data to get latest results
        await loadPoll();
        
        setToast({ 
          type: 'info', 
          message: 'You have already voted. Showing results.' 
        });
      } else {
        // Other error
        setToast({
          type: 'error',
          message: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user has already voted on component mount
  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        // Optional: You could add an API endpoint to check vote status
        // For now, we'll rely on localStorage and error handling
        const voted = localStorage.getItem(`poll_${pollId}_voted`);
        if (voted) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error('Error checking vote status:', err);
      }
    };

    checkVoteStatus();
  }, [pollId]);

  // CALCULATE TOTAL VOTES
  const totalVotes =
    poll?.options?.reduce((sum, o) => sum + (o.voteCount || 0), 0) || 0;

  if (loading) return <PollSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="text-2xl text-white font-bold">Poll not found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8">

          <h1 className="text-3xl font-bold text-white mb-6">
            {poll.question}
          </h1>

          {/* Show vote count summary when user has voted */}
          {hasVoted && (
            <div className="mb-4 text-sm text-slate-400">
              Total votes: {totalVotes}
            </div>
          )}

          <div className="space-y-3 mb-8">
            {poll.options.map((option) => {
              const isSelected = selected === option._id;
              const percent = totalVotes
                ? Math.round((option.voteCount / totalVotes) * 100)
                : 0;

              return (
                <button
                  key={option._id}
                  onClick={() => handleSelect(option._id)}
                  disabled={hasVoted}
                  className={`w-full rounded-xl border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/20'
                      : 'border-slate-700 bg-slate-800'
                  } ${hasVoted ? 'opacity-70 cursor-not-allowed' : 'hover:border-indigo-500/50'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-white">
                      {option.text}
                    </span>

                    {hasVoted && (
                      <span className="text-slate-400 text-sm font-medium">
                        {percent}% ({option.voteCount} {option.voteCount === 1 ? 'vote' : 'votes'})
                      </span>
                    )}
                  </div>

                  {hasVoted && (
                    <div className="mt-3">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!hasVoted ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 
                      0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 
                      12H0c0 3.042 1.135 
                      5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Vote className="h-5 w-5" />
                  Submit Vote
                </span>
              )}
            </button>
          ) : (
            <div className="text-center text-slate-400 text-sm border-t border-slate-700 pt-4 mt-2">
              <p>Results are shown above.</p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}