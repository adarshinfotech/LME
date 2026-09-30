"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  { word: "Sell", note: "Present ready-to-sell business solutions to the market you know." },
  { word: "Grow", note: "Turn every customer into recurring subscription revenue." },
  { word: "Scale", note: "Add products, AI automation and services as customers grow." },
];

function Pillar({ word, note, index }: { word: string; note: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 55%"] });
  // Colour shifts muted → ink (both readable) rather than fading text out.
  const color = useTransform(scrollYProgress, [0, 1], [reduce ? "#111111" : "#6e675e", "#111111"]);
  const x = useTransform(scrollYProgress, [0, 1], [reduce ? "0%" : `${6 + index * 3}%`, "0%"]);
  const rule = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <li ref={ref} className="relative py-6 sm:py-8">
      <m.span aria-hidden="true" style={{ scaleX: rule, originX: 0 }} className="absolute inset-x-0 top-0 h-px bg-ink/20" />
      <div className="grid items-end gap-4 md:grid-cols-12">
        <span className="eyebrow text-muted md:col-span-1">0{index + 1}</span>
        <m.span
          style={{ color, x }}
          className="block font-display text-[clamp(4rem,2rem+11vw,12rem)] font-light uppercase leading-[0.85] tracking-[-0.05em] md:col-span-8"
        >
          {word}
        </m.span>
        <p className="max-w-xs text-base leading-relaxed text-muted md:col-span-3 md:pb-4">{note}</p>
      </div>
    </li>
  );
}

export function Opportunity() {
  return (
    <section aria-labelledby="opportunity-title" className="section-y overflow-x-clip">
      <div className="container-lux">
        <SectionHeading
          id="opportunity-title"
          eyebrow="The opportunity"
          title={["You don't need to build the technology", "to build the business."]}
          intro="Focus on customers, sales and growth while LMI provides the technology foundation behind your software business."
        />
        <ol className="mt-20 sm:mt-28">
          {pillars.map((p, i) => (
            <Pillar key={p.word} {...p} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
