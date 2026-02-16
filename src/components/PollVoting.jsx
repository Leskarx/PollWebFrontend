// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Vote, AlertCircle } from 'lucide-react';
// import { fetchPoll, submitVote, subscribeToLiveResults } from '../services/api';
// import Toast from './Toast';
// import PollSkeleton from './PollSkeleton';
// import ResultsView from './ResultsView';

// export default function PollVoting() {
//   const { pollId } = useParams();
//   const [poll, setPoll] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadPoll();
//   }, [pollId]);

//   useEffect(() => {
//     if (showResults && poll) {
//       const unsubscribe = subscribeToLiveResults(pollId, (updatedResults) => {
//         setPoll(prev => ({ ...prev, results: updatedResults }));
//       });
//       return unsubscribe;
//     }
//   }, [showResults, pollId, poll]);

//   const loadPoll = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchPoll(pollId);
//       setPoll(data);

//       // Check if user already voted
//       const voted = localStorage.getItem(`poll_${pollId}_voted`);
//       if (voted) {
//         setHasVoted(true);
//         setShowResults(true);
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to load poll');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (optionIndex) => {
//     if (hasVoted) return;

//     if (poll.pollType === 'single') {
//       setSelected([optionIndex]);
//     } else {
//       setSelected(prev =>
//         prev.includes(optionIndex)
//           ? prev.filter(i => i !== optionIndex)
//           : [...prev, optionIndex]
//       );
//     }
//   };

//   const handleSubmit = async () => {
//     if (selected.length === 0) {
//       setToast({ type: 'error', message: 'Please select at least one option' });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await submitVote(pollId, selected);
//       localStorage.setItem(`poll_${pollId}_voted`, 'true');
//       setHasVoted(true);
//       setShowResults(true);
//       setToast({ type: 'success', message: 'Vote submitted successfully!' });
//     } catch (err) {
//       if (err.message.includes('limit')) {
//         setToast({ type: 'error', message: 'Voting limit reached for this poll.' });
//       } else {
//         setToast({ type: 'error', message: 'Failed to submit vote. Please try again.' });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <PollSkeleton />;
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
//         <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
//           <div className="mb-4 flex justify-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-2 ring-red-500/20">
//               <AlertCircle className="h-8 w-8 text-red-400" />
//             </div>
//           </div>
//           <h2 className="mb-2 text-2xl font-bold text-white">Poll not found</h2>
//           <p className="text-slate-400">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (showResults) {
//     return <ResultsView poll={poll} />;
//   }

//   return (
//     <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
//       <div className="w-full max-w-3xl">
//         <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
//           <div className="mb-8">
//             <h1 className="mb-3 text-3xl font-bold text-white">
//               {poll.question}
//             </h1>
//             <p className="flex items-center gap-2 text-sm text-slate-400">
//               <span className="relative flex h-2 w-2">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
//                 <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
//               </span>
//               Live results update automatically
//             </p>
//           </div>

//           {hasVoted && (
//             <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
//               <p className="text-sm font-medium text-amber-300">
//                 You have already voted in this poll.
//               </p>
//             </div>
//           )}

//           <div className="mb-8 space-y-3">
//             {poll.options.map((option, index) => {
//               const isSelected = selected.includes(index);
//               const isRadio = poll.pollType === 'single';

//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleSelect(index)}
//                   disabled={hasVoted}
//                   className={`group w-full rounded-xl border p-5 text-left transition-all ${
//                     isSelected
//                       ? 'border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-500/10'
//                       : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-750'
//                   } ${hasVoted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div
//                       className={`flex h-5 w-5 items-center justify-center border-2 transition-all ${
//                         isRadio ? 'rounded-full' : 'rounded'
//                       } ${
//                         isSelected
//                           ? 'border-indigo-500 bg-indigo-500'
//                           : 'border-slate-600 group-hover:border-slate-500'
//                       }`}
//                     >
//                       {isSelected && (
//                         <div
//                           className={`bg-white ${
//                             isRadio ? 'h-2 w-2 rounded-full' : 'h-2.5 w-2.5 rounded-sm'
//                           }`}
//                         />
//                       )}
//                     </div>
//                     <span className="text-lg font-medium text-white">
//                       {option}
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={submitting || hasVoted || selected.length === 0}
//             className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {submitting ? (
//               <span className="inline-flex items-center gap-2">
//                 <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Submitting vote...
//               </span>
//             ) : (
//               <span className="inline-flex items-center justify-center gap-2">
//                 <Vote className="h-5 w-5" />
//                 Vote
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//       {toast && <Toast {...toast} onClose={() => setToast(null)} />}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { fetchPoll } from '../services/api.fetchPoll';
import PollSkeleton from './PollSkeleton';

export default function PollVoting() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPoll();
  }, [pollId]);

  const loadPoll = async () => {
    setLoading(true);
    try {
      const data = await fetchPoll(pollId);
      setPoll(data);
    } catch (err) {
      setError(err.message || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PollSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-2 ring-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Poll not found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
          
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold text-white">
              {poll.question}
            </h1>
            <p className="text-sm text-slate-400">
              Select an option (Voting feature coming soon)
            </p>
          </div>

          <div className="space-y-3">
            {poll.options.map((option) => (
              <div
                key={option._id}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-5"
              >
                <span className="text-lg font-medium text-white">
                  {option.text}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}


