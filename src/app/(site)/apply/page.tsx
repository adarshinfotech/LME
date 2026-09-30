import type { Metadata } from "next";
import { ApplyExperience } from "@/components/apply/ApplyExperience";
import { WordReveal } from "@/components/motion/WordReveal";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to become an LMI Technology Partner. Tell us about yourself, your market and what you want to build.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <section className="pb-24 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-32 sm:pt-[calc(var(--nav-h)+6rem)]">
      <div className="container-lux">
        <header className="max-w-4xl">
          <div className="animate-rise">
            <p className="eyebrow mb-8 flex items-center gap-3 text-muted">
              <span aria-hidden="true" className="h-px w-8 bg-muted" />
              Apply
            </p>
          </div>
          <WordReveal
            as="h1"
            immediate
            delay={0.1}
            lines={["LMI Technology Partner", "Application"]}
            className="font-display text-display-md"
          />
          <p className="animate-rise mt-8 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "0.3s" }}>
            Tell us about yourself, your market and what you want to build.
          </p>
        </header>
        <div className="mt-16 sm:mt-24">
          <ApplyExperience />
        </div>
      </div>
    </section>
  );
}
