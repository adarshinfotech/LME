import { responsibilities } from "@/content/journey";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function WhyLmi() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-linen">
      <div className="container-lux">
        <SectionHeading id="why-title" eyebrow="Why LMI" title={["Build the customer network.", "LMI builds the technology."]} />

        <div className="mt-16 grid gap-px bg-line sm:mt-20 md:grid-cols-3">
          {responsibilities.map((col, ci) => {
            const together = ci === 2;
            return (
              <Reveal key={col.title} delay={ci * 0.12} className={cn("p-7 sm:p-10", together ? "bg-ink text-sand" : "bg-linen")}>
                <div className="flex items-center justify-between">
                  <h3 className={cn("eyebrow", together ? "text-stone" : "text-muted")}>{col.title}</h3>
                  <span aria-hidden="true" className={cn("font-display text-sm", together ? "text-stone" : "text-muted")}>
                    {ci === 0 ? "You" : ci === 1 ? "LMI" : "You + LMI"}
                  </span>
                </div>
                <ul className="mt-12 space-y-1">
                  {col.items.map((item) => (
                    <li key={item} className="font-display text-3xl font-light tracking-[-0.02em] sm:text-4xl">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
