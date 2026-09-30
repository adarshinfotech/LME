"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { journey } from "@/content/journey";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Step({ index, title, body, progress }: { index: number; title: string; body: string; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const at = index / journey.length;
  // Upcoming steps read as muted, reached steps as ink — always legible.
  const color = useTransform(progress, [at - 0.08, at + 0.04], [reduce ? "#111111" : "#6e675e", "#111111"]);
  const dot = useTransform(progress, [at - 0.02, at + 0.04], [0, 1]);

  return (
    <li className="relative pb-10 pl-10 lg:pb-0 lg:pl-0 lg:pr-6 lg:pt-12">
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 flex size-[0.9rem] -translate-x-1/2 items-center justify-center rounded-full border border-ink bg-sand lg:left-0 lg:top-0 lg:translate-x-0 lg:-translate-y-1/2"
      >
        <m.span style={{ scale: dot }} className="size-1.5 rounded-full bg-ink" />
      </span>
      <span className="font-display text-sm tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
      <m.h3 style={{ color }} className="mt-2 font-display text-2xl uppercase tracking-[-0.01em] xl:text-[1.6rem]">
        {title}
      </m.h3>
      <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-muted">{body}</p>
    </li>
  );
}

export function Timeline({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section aria-labelledby="journey-title" className="section-y">
      <div className="container-lux">
        <SectionHeading
          id="journey-title"
          as={headingLevel}
          eyebrow="How it works"
          title={["From application", "to a growing business."]}
          intro="A clear, guided path — from your first conversation with our partnership team to scaling your customer base."
        />

        <ol ref={ref} className="relative mt-16 grid sm:mt-24 lg:grid-cols-8">
          {/* Track: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden="true"
            className="absolute bottom-10 left-0 top-1 w-px bg-line lg:bottom-auto lg:right-0 lg:top-0 lg:h-px lg:w-auto"
          />
          <m.span
            aria-hidden="true"
            style={{ scaleY: line, originY: 0 }}
            className="absolute bottom-10 left-0 top-1 w-px bg-ink lg:hidden"
          />
          <m.span
            aria-hidden="true"
            style={{ scaleX: line, originX: 0 }}
            className="absolute left-0 right-0 top-0 hidden h-px bg-ink lg:block"
          />
          {journey.map((s, i) => (
            <Step key={s.title} index={i} {...s} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
