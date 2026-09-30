import type { Metadata } from "next";
import { Benefits } from "@/components/sections/Benefits";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Timeline } from "@/components/sections/Timeline";
import { WhyLmi } from "@/components/sections/WhyLmi";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Apply, connect, discuss, onboard, launch, sell, grow and scale — how the LMI Technology Partner Program works, step by step.",
  alternates: { canonical: "/how-it-works" },
};

const operating = [
  { stage: "Partner onboarding", body: "Training, demos, sales kit and product access." },
  { stage: "Lead generation", body: "You target businesses in your market." },
  { stage: "Demo & proposal", body: "You present the relevant solution." },
  { stage: "Customer onboarding", body: "You lead commercial onboarding; Adarsh Infotech supports technically." },
  { stage: "Subscription billing", body: "The customer pays through the agreed billing system." },
  { stage: "Revenue share", body: "Eligible SaaS revenue is divided 60 / 40." },
  { stage: "Upsell", body: "Add products, AI, integrations and services." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={["A clear path", "to your own", "software business."]}
        intro="Apply, talk to our partnership team, and launch with the products, training and technology you need."
      />
      <Timeline />
      <section aria-labelledby="model-title" className="section-y bg-ink text-sand" data-theme="dark">
        <div className="container-lux">
          <SectionHeading id="model-title" tone="dark" eyebrow="Operating model" title={["Who does what,", "once you launch."]} />
          <ol className="mt-16 border-t border-line-dark">
            {operating.map((o, i) => (
              <Reveal
                as="li"
                key={o.stage}
                delay={i * 0.04}
                className="grid gap-2 border-b border-line-dark py-6 sm:grid-cols-[4rem_1fr_1.4fr] sm:gap-6"
              >
                <span className="font-display text-sm tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-2xl">{o.stage}</h3>
                <p className="leading-relaxed text-stone sm:pt-1">{o.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <WhyLmi />
      <Benefits />
      <FinalCta />
    </>
  );
}
