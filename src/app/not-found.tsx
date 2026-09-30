import type { Metadata } from "next";
import Link from "next/link";
import { LmiMark } from "@/components/brand/Logo";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="container-lux flex h-[var(--nav-h)] items-center">
        <Link href="/" aria-label="LMI home">
          <LmiMark className="h-6 w-auto" />
        </Link>
      </div>
      <div className="container-lux flex flex-1 flex-col justify-center pb-24">
        <p className="eyebrow text-muted">Error 404</p>
        <h1 className="mt-6 font-display text-display-xl font-light">NOT HERE.</h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center bg-ink px-8 text-[0.76rem] font-medium uppercase tracking-[0.16em] text-sand"
          >
            Back to LMI
          </Link>
          <Link
            href="/apply"
            className="inline-flex h-14 items-center justify-center border border-ink px-8 text-[0.76rem] font-medium uppercase tracking-[0.16em]"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </main>
  );
}
