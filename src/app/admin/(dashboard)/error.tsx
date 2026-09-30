"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-24 text-center" role="alert">
      <h1 className="font-display text-display-sm">We couldn&rsquo;t load this page</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The data service didn&rsquo;t respond as expected. Please try again in a moment.</p>
      <button type="button" onClick={reset} className="mt-8 h-11 bg-ink px-6 text-xs uppercase tracking-[0.16em] text-sand">
        Try again
      </button>
    </div>
  );
}
