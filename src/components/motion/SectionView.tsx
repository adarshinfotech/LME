"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires an analytics event the first time the wrapped section is seen. */
export function SectionView({
  event,
  children,
  className,
  id,
}: {
  event: AnalyticsEvent;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  useEffect(() => {
    if (seen) track(event);
  }, [seen, event]);
  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}
