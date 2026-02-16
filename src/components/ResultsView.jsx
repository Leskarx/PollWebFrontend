import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export default function ResultsView({ poll }) {
  const [animatedResults, setAnimatedResults] = useState(
    poll.results.map(() => ({ percentage: 0, votes: 0 }))
  );

  useEffect(() => {
    // Animate results on mount and when results update
    const timer = setTimeout(() => {
      setAnimatedResults(poll.results);
    }, 100);

    return () => clearTimeout(timer);
  }, [poll.results]);

  const totalVotes = poll.results.reduce((sum, r) => sum + r.votes, 0);
  const hasVotes = totalVotes > 0;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl animate-[fadeIn_0.5s_ease-out]">
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold text-white">
              {poll.question}
            </h1>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Results updating live...
              </p>
              <p className="text-sm font-medium text-slate-400">
                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
              </p>
            </div>
          </div>

          {!hasVotes ? (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-600/10 p-12 text-center">
              <TrendingUp className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
              <p className="text-xl font-semibold text-indigo-300">
                Be the first to vote!
              </p>
              <p className="mt-2 text-slate-400">
                No votes yet. Share this poll to get responses.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {poll.options.map((option, index) => {
                const result = animatedResults[index];
                const percentage = result.percentage;
                const votes = result.votes;

                return (
                  <div
                    key={index}
                    className="animate-[slideUp_0.5s_ease-out] rounded-xl border border-slate-700 bg-slate-800/50 p-5"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-white">
                        {option}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-400">
                          {votes} {votes === 1 ? 'vote' : 'votes'}
                        </span>
                        <span className="text-2xl font-bold text-indigo-400">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
