"use client";

import { m } from "motion/react";
import { useId, useState } from "react";
import { formatINR, formatLakh } from "@/lib/format";
import { REVENUE_DISCLAIMER, REVENUE_MODEL, revenueScenario } from "@/lib/revenue";
import { cn } from "@/lib/cn";

const { minClients, maxClients, milestones } = REVENUE_MODEL;

/** Interactive, clearly-labelled illustrative revenue scenario (10 → 100 clients). */
export function RevenueSlider() {
  const [clients, setClients] = useState(25);
  const id = useId();
  const s = revenueScenario(clients);
  const fill = ((clients - minClients) / (maxClients - minClients)) * 100;

  return (
    <div className="border border-line-dark bg-carbon">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-4 sm:px-8">
        <span className="eyebrow inline-flex items-center gap-2 text-sand">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sand" />
          Illustrative example
        </span>
        <span className="text-xs text-stone">Not a forecast or guarantee</span>
      </div>

      <div className="grid lg:grid-cols-12">
        {/* Input */}
        <div className="border-b border-line-dark p-5 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
          <label htmlFor={id} className="eyebrow text-stone">
            Active clients
          </label>
          <output
            htmlFor={id}
            className="mt-4 block font-display text-[clamp(5rem,3rem+8vw,9rem)] font-light leading-none tracking-[-0.05em] tabular-nums text-sand"
            aria-live="polite"
          >
            {clients}
          </output>

          <input
            id={id}
            type="range"
            min={minClients}
            max={maxClients}
            step={1}
            value={clients}
            onChange={(e) => setClients(Number(e.target.value))}
            className="lux-range mt-8"
            style={{ ["--fill" as string]: `${fill}%` }}
            aria-valuetext={`${clients} clients`}
          />
          <div className="mt-2 flex justify-between text-xs tabular-nums text-stone" aria-hidden="true">
            <span>{minClients}</span>
            <span>{maxClients}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Example scenarios">
            {milestones.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setClients(n)}
                aria-pressed={clients === n}
                className={cn(
                  "h-11 min-w-16 border px-4 text-sm tabular-nums transition-colors duration-300",
                  clients === n ? "border-sand bg-sand text-ink" : "border-line-dark text-sand hover:border-sand/60",
                )}
              >
                {n} clients
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="p-5 sm:p-8 lg:col-span-7">
          <dl className="grid gap-px bg-line-dark sm:grid-cols-2">
            <div className="bg-carbon py-5 sm:pr-6">
              <dt className="eyebrow text-stone">Gross monthly recurring revenue</dt>
              <dd className="mt-3 font-display text-3xl tabular-nums text-sand sm:text-4xl">{formatINR(s.grossMrr)}</dd>
            </div>
            <div className="bg-carbon py-5 sm:pl-6">
              <dt className="eyebrow text-stone">Annual partner SaaS revenue</dt>
              <dd className="mt-3 font-display text-3xl tabular-nums text-sand sm:text-4xl">{formatLakh(s.partnerAnnual)}</dd>
            </div>
            <div className="bg-carbon pt-6 sm:col-span-2">
              <dt className="eyebrow text-stone">Partner share · 60% · per month</dt>
              <dd className="mt-3 font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-light leading-none tracking-[-0.04em] tabular-nums text-sand">
                {formatINR(s.partnerMonthly)}
              </dd>
            </div>
          </dl>

          <div className="mt-8" aria-hidden="true">
            <div className="flex h-2 w-full overflow-hidden bg-line-dark">
              <m.div
                className="h-full bg-sand"
                animate={{ width: `${(s.grossMrr / revenueScenario(maxClients).grossMrr) * 60}%` }}
                transition={{ duration: 0.5 }}
              />
              <m.div
                className="h-full bg-stone/60"
                animate={{ width: `${(s.grossMrr / revenueScenario(maxClients).grossMrr) * 40}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-stone">
              <span>Partner {formatINR(s.partnerMonthly)}</span>
              <span>LMI {formatINR(s.lmiMonthly)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t border-line-dark px-5 py-5 text-xs leading-relaxed text-stone sm:px-8">
        <p>{REVENUE_DISCLAIMER}</p>
        <p>
          Scenario uses an illustrative average of {formatINR(REVENUE_MODEL.illustrativeAvgPerClient)} SaaS revenue per client per month.
          Figures are revenue before partner expenses and taxes — revenue is not profit.
        </p>
      </div>
    </div>
  );
}
