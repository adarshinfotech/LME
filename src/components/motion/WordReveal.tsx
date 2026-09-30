"use client";

import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type WordRevealProps = {
  /** Each entry renders on its own line. */
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  id?: string;
};

/**
 * Masked word-by-word rise. Words sit in overflow-hidden wrappers so they
 * appear to emerge from a baseline — editorial, not bouncy.
 */
export function WordReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
  id,
}: WordRevealProps) {
  const Tag = as;
  const reduce = useReducedMotion();
  let index = 0;

  // Above-the-fold headlines: pure CSS so the text paints (and counts for LCP) without waiting for hydration.
  if (immediate) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName)}>
            {line.split(" ").map((word, wi, arr) => {
              const i = index++;
              return (
                <span key={wi} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-top">
                  <span className="animate-word inline-block" style={{ animationDelay: `${delay + i * stagger}s` }}>
                    {word}
                  </span>
                  {wi < arr.length - 1 ? "\u00A0" : null}
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    );
  }

  const trigger = { whileInView: "shown" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={className}>
      <m.span className="block" initial={reduce ? "shown" : "hidden"} {...trigger}>
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName)}>
            {line.split(" ").map((word, wi, arr) => {
              const i = index++;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
                  <m.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "105%", opacity: 0 },
                      shown: {
                        y: "0%",
                        opacity: 1,
                        transition: { duration: 1, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                  >
                    {word}
                  </m.span>
                  {wi < arr.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
