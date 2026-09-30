import { WordReveal } from "@/components/motion/WordReveal";

type PageHeroProps = { eyebrow: string; title: string[]; intro?: string; children?: React.ReactNode };

/** Opening block for inner pages — same typographic voice as the home hero, less height. */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="border-b border-line pb-16 pt-[calc(var(--nav-h)+4rem)] sm:pb-24 sm:pt-[calc(var(--nav-h)+7rem)]">
      <div className="container-lux">
        <div className="animate-rise">
          <p className="eyebrow mb-8 flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="h-px w-8 bg-muted" />
            {eyebrow}
          </p>
        </div>
        <WordReveal as="h1" immediate delay={0.1} lines={title} className="font-display text-display-lg font-light" />
        {intro ? (
          <p className="animate-rise mt-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl" style={{ animationDelay: "0.3s" }}>
            {intro}
          </p>
        ) : null}
        {children ? (
          <div className="animate-rise mt-10" style={{ animationDelay: "0.45s" }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
