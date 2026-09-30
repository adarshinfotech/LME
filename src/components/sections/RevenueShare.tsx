"use client";

import { m } from "motion/react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

const rows = [
  { type: "Recurring SaaS subscriptions", split: "60 / 40" },
  { type: "AI automation subscriptions", split: "60 / 40" },
  { type: "Implementation, training & data migration", split: "Partner-led, quoted separately" },
];

export function RevenueShare() {
  return (
    <section aria-labelledby="share-title" className="section-y">
      <div className="container-lux">
        <SectionHeading
          id="share-title"
          eyebrow="Revenue share"
          size="lg"
          title={["Your customers.", "Your business.", "Our technology."]}
        />

        <div className="mt-20 sm:mt-28">
          {/* 60/40 split — drawn once on entry, then still. */}
          <m.div
            className="flex h-44 w-full overflow-hidden sm:h-56 lg:h-64"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.5 }}
            role="img"
            aria-label="Revenue share: 60 percent partner, 40 percent LMI"
          >
            <m.div
              className="relative flex h-full flex-col justify-between bg-ink p-5 text-sand sm:p-8"
              variants={{ hidden: { width: "0%" }, shown: { width: "60%", transition: { duration: 1.6, ease } } }}
            >
              <span className="eyebrow text-stone">Partner</span>
              <span className="font-display text-[clamp(3.5rem,2rem+6vw,8rem)] font-light leading-none tracking-[-0.04em]">
                <Counter value={60} format="percent" duration={1.6} />
              </span>
            </m.div>
            <m.div
              className="relative flex h-full flex-1 flex-col justify-between border border-l-0 border-ink/80 p-5 sm:p-8"
              variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 1, delay: 0.6 } } }}
            >
              <span className="eyebrow text-muted">LMI</span>
              <span className="font-display text-[clamp(3.5rem,2rem+6vw,8rem)] font-light leading-none tracking-[-0.04em]">
                <Counter value={40} format="percent" duration={1.6} />
              </span>
            </m.div>
          </m.div>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="text-xl leading-relaxed text-pretty sm:text-2xl">
                Eligible recurring SaaS revenue follows the partner revenue-share model.
              </p>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                You build and serve the customer relationship. LMI provides the products, hosting, updates and core technical maintenance
                behind every subscription.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
              <dl className="border-t border-ink/80">
                {rows.map((r) => (
                  <div
                    key={r.type}
                    className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between"
                  >
                    <dt className="text-muted">{r.type}</dt>
                    <dd className="font-display text-lg">{r.split}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted">Exact eligibility and terms are defined in the partner agreement.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
