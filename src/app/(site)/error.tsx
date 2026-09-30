"use client";

import Link from "next/link";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-lux flex min-h-[80svh] flex-col justify-center pb-24 pt-[calc(var(--nav-h)+4rem)]" role="alert">
      <p className="eyebrow text-muted">Something went wrong</p>
      <h1 className="mt-6 font-display text-display-md">We couldn&rsquo;t load this page.</h1>
      <p className="mt-6 max-w-md leading-relaxed text-muted">Please try again. If the problem continues, come back in a few minutes.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="h-14 bg-ink px-8 text-[0.76rem] font-medium uppercase tracking-[0.16em] text-sand">
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-14 items-center justify-center border border-ink px-8 text-[0.76rem] font-medium uppercase tracking-[0.16em]"
        >
          Back to LMI
        </Link>
      </div>
    </section>
  );
}
