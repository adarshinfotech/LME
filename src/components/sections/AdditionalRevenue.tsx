import { services } from "@/content/services";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AdditionalRevenue() {
  return (
    <section aria-labelledby="services-title" className="section-y">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <SectionHeading id="services-title" eyebrow="Beyond subscriptions" title={["More ways to", "grow revenue."]} />
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-sm leading-relaxed text-muted">
                  Every customer relationship can extend beyond software — into services you deliver with LMI&rsquo;s technical backing
                  where needed.
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="border-t border-ink/80 lg:col-span-7 lg:col-start-6">
            {services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.04 * i} className="group border-b border-line">
                <div className="grid grid-cols-[3rem_1fr] gap-x-4 py-7 transition-[padding] duration-700 ease-[var(--ease-lux)] sm:grid-cols-[4rem_1fr_1.3fr] sm:py-9 sm:hover:pl-4">
                  <span className="pt-1 font-display text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">{s.title}</h3>
                  <p className="col-start-2 mt-3 leading-relaxed text-muted sm:col-start-3 sm:mt-0 sm:pt-1.5">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
