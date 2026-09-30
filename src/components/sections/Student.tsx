import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Student() {
  return (
    <section aria-labelledby="student-title" className="section-y relative overflow-hidden bg-linen">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] right-[-0.04em] select-none font-display text-[clamp(14rem,10rem+22vw,34rem)] font-light leading-none tracking-[-0.08em] text-sand"
      >
        01
      </span>
      <div className="container-lux relative">
        <SectionHeading
          id="student-title"
          eyebrow="Student entrepreneurs"
          size="lg"
          title={["Your first business", "can start here."]}
          intro="Start with knowledge, ambition and a market you understand."
        />
        <Reveal delay={0.2} className="mt-12 inline-flex max-w-full items-center gap-3 border border-ink px-5 py-4">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-ink" />
          <p className="eyebrow leading-relaxed">Special opportunities available for student entrepreneurs.</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10">
          <Button href="/apply" size="lg" arrow magnetic trackEvent="apply_click" trackProps={{ location: "student" }}>
            Apply Now
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
