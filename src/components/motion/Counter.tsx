"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatINR } from "@/lib/format";

const formats = {
  int: (n: number) => String(Math.round(n)),
  percent: (n: number) => `${Math.round(n)}%`,
  inr: formatINR,
} as const;

type CounterProps = {
  value: number;
  format?: keyof typeof formats;
  duration?: number;
  className?: string;
};

/**
 * Counts from the previously shown value to `value`. The final value is
 * server-rendered so the number is correct without JavaScript.
 */
export function Counter({ value, format: formatKey = "int", duration = 1.4, className }: CounterProps) {
  const format = formats[formatKey];
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const shown = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const from = shown.current ?? 0;
    shown.current = value;
    if (reduce || from === value) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(from, value, {
      duration: from === 0 ? duration : 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
