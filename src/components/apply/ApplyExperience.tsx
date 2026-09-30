"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ApplicationForm, STEPS } from "./ApplicationForm";

export function ApplyExperience() {
  const [step, setStep] = useState(0);
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <ol className="hidden border-t border-line lg:block" aria-label="Application steps">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex items-baseline gap-5 border-b border-line py-4 transition-colors duration-500",
                  i === step ? "text-ink" : "text-muted",
                )}
              >
                <span className="font-display text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl">{s.title}</span>
                {i < step ? (
                  <span className="ml-auto text-xs uppercase tracking-[0.16em]" aria-label="completed">
                    Done
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-8 hidden space-y-3 text-sm leading-relaxed text-muted lg:block">
            <p>Takes about 2–3 minutes. Your answers are kept on this device until you submit.</p>
            <p>Our partnership team reviews every application and follows up by phone or email.</p>
          </div>
        </div>
      </aside>
      <div className="lg:col-span-7 lg:col-start-6">
        <ApplicationForm onStepChange={setStep} />
      </div>
    </div>
  );
}
