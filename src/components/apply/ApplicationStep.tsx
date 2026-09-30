"use client";

import { useEffect, useRef } from "react";

type StepProps = {
  index: number;
  total: number;
  title: string;
  description: string;
  /** Move focus to the step heading when it mounts (after Back/Continue). */
  focusOnMount?: boolean;
  children: React.ReactNode;
};

export function ApplicationStep({ index, total, title, description, focusOnMount, children }: StepProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  return (
    <div>
      <p className="eyebrow text-muted">
        Step {String(index + 1).padStart(2, "0")} <span>/ {String(total).padStart(2, "0")}</span>
      </p>
      <h2 ref={ref} tabIndex={-1} className="mt-4 font-display text-display-sm outline-none">
        {title}
      </h2>
      <p className="mt-3 max-w-lg leading-relaxed text-muted">{description}</p>
      <div className="mt-10 space-y-9 sm:mt-12">{children}</div>
    </div>
  );
}
