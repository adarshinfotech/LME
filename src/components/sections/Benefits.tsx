import { benefits } from "@/content/benefits";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BenefitCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <article className="group relative isolate flex min-h-[15rem] flex-col justify-between overflow-hidden p-7 transition-colors duration-700 ease-[var(--ease-lux)] hover:text-sand sm:min-h-[18rem] sm:p-10">
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-y-100"
      />
      <div className="flex items-start justify-between">
        <span className="font-display text-sm tabular-nums text-muted transition-colors duration-700 group-hover:text-stone">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-10 translate-y-2 bg-current opacity-30 transition-all duration-700 group-hover:w-16 group-hover:opacity-100"
        />
      </div>
      <div>
        <h3 className="font-display text-2xl uppercase tracking-[-0.01em] sm:text-[1.7rem]">{title}</h3>
        <p className="mt-3 max-w-xs leading-relaxed text-muted transition-colors duration-700 group-hover:text-stone">{body}</p>
      </div>
    </article>
  );
}

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="section-y bg-linen">
      <div className="container-lux">
        <SectionHeading id="benefits-title" eyebrow="Partner benefits" title={["Everything you", "need to start."]} />
        <ul className="mt-16 grid border-l border-t border-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={(i % 3) * 0.08} className="border-b border-r border-line">
              <BenefitCard index={i} {...b} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
