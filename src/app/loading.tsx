export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading page">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded-full bg-panel-soft" />
        <div className="h-8 w-2/3 max-w-md animate-pulse rounded-lg bg-panel-soft" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-panel-soft" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-48 animate-pulse rounded-2xl border border-line bg-panel-soft/60" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-line bg-panel-soft/60" />
    </div>
  );
}
