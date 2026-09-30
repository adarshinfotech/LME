"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LmiMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { WordReveal } from "@/components/motion/WordReveal";
import { site } from "@/lib/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "28%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Architectural hairlines — the quiet grid the page is built on. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="container-lux grid h-full grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`animate-draw-y border-l border-ink/[0.06] ${i >= 4 ? "hidden lg:block" : ""} ${i === 0 ? "border-l-0" : ""}`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            />
          ))}
        </div>
      </div>

      {/* Oversized mark, revealed first and drifting with scroll. */}
      <m.div
        aria-hidden="true"
        style={{ y: markY }}
        className="pointer-events-none absolute -right-[8vw] bottom-[6vh] -z-10 w-[92vw] text-linen sm:w-[70vw] lg:bottom-[-4vh] lg:w-[58vw]"
      >
        <m.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <LmiMark className="h-auto w-full" title="" />
        </m.div>
      </m.div>

      <m.div style={{ y: contentY, opacity: fade }} className="container-lux flex flex-1 flex-col justify-center pb-16 pt-10 sm:pb-20">
        <p className="eyebrow animate-rise mb-8 flex items-center gap-3 text-muted sm:mb-10" style={{ animationDelay: "0.15s" }}>
          <span aria-hidden="true" className="h-px w-8 bg-muted" />
          LMI Technology Partner Program
        </p>

        <WordReveal
          as="h1"
          id="hero-title"
          immediate
          delay={0.45}
          stagger={0.09}
          lines={["START YOUR OWN", "SOFTWARE BUSINESS."]}
          className="font-display text-display-xl font-light"
        />

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:items-end">
          <div className="animate-rise lg:col-span-6" style={{ animationDelay: "0.55s" }}>
            <p className="font-display text-display-sm">{site.tagline}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Launch your own software business with ready-to-sell business solutions, technology infrastructure and ongoing technical
              support powered by Adarsh Infotech.
            </p>
          </div>

          <div className="animate-rise flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end" style={{ animationDelay: "0.75s" }}>
            <Button href="/apply" size="lg" arrow magnetic trackEvent="hero_apply_click" className="w-full sm:w-auto">
              Apply Now
            </Button>
            <Button href="/solutions" size="lg" variant="outline" className="w-full sm:w-auto">
              Explore Solutions
            </Button>
          </div>
        </div>
      </m.div>

      <div
        aria-hidden="true"
        className="container-lux animate-rise flex items-center justify-between pb-6 text-[0.65rem] uppercase tracking-[0.22em] text-muted"
        style={{ animationDelay: "1.1s" }}
      >
        <span className="flex items-center gap-3">
          <span className="relative block h-8 w-px overflow-hidden bg-ink/15">
            <m.span
              className="absolute inset-x-0 top-0 h-1/2 bg-ink"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll
        </span>
        <span>Powered by {site.poweredBy}</span>
      </div>
    </section>
  );
}
