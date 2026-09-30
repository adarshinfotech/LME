export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-10" role="status" aria-label="Loading">
      <div className="h-10 w-56 bg-line/70" />
      <div className="grid grid-cols-2 gap-px md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-line/50" />
        ))}
      </div>
      <div className="h-80 bg-line/40" />
    </div>
  );
}
