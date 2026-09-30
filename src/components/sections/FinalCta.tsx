import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative bg-ink text-sand" data-theme="dark">
      <div className="container-lux flex min-h-[80svh] flex-col justify-center py-28 sm:py-36">
        <WordReveal
          as="h2"
          id="final-title"
          lines={["READY TO", "MAKE IT?"]}
          stagger={0.1}
          className="font-display text-display-xl font-light"
        />
        <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Reveal delay={0.3}>
            <p className="font-display text-display-sm text-stone">{site.tagline}</p>
          </Reveal>
          <Reveal delay={0.4}>
            <Button href="/apply" variant="light" size="lg" arrow magnetic trackEvent="apply_click" trackProps={{ location: "final_cta" }}>
              Apply Now
            </Button>
          </Reveal>
        </div>
      </div>
      <div className="container-lux">
        <div className="h-px bg-line-dark" />
      </div>
    </section>
  );
}
