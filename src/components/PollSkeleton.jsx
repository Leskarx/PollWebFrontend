export default function PollSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="animate-pulse rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8">
            <div className="mb-3 h-9 w-3/4 rounded-lg bg-slate-700"></div>
            <div className="h-4 w-48 rounded bg-slate-700"></div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-slate-700 bg-slate-800"
              ></div>
            ))}
          </div>

          <div className="mt-8 h-14 w-full rounded-lg bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
}
