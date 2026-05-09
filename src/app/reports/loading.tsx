export default function ReportsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="h-8 w-20 bg-zinc-200 rounded-lg" />
          <div className="h-4 w-16 bg-zinc-100 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-zinc-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-100 rounded-2xl p-4 sm:p-5">
            <div className="h-3 w-12 bg-zinc-200 rounded mb-2" />
            <div className="h-6 w-20 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-zinc-100 rounded-2xl p-4 sm:p-6">
          <div className="h-4 w-16 bg-zinc-200 rounded mb-4" />
          <div className="h-64 bg-zinc-200/50 rounded-xl" />
        </div>
        <div className="bg-zinc-100 rounded-2xl p-4 sm:p-6">
          <div className="h-4 w-16 bg-zinc-200 rounded mb-4" />
          <div className="h-64 bg-zinc-200/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
