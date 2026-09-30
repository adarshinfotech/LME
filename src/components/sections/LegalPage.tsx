import { PageHero } from "./PageHero";

type LegalSection = { heading: string; body: React.ReactNode };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${updated}`} title={[title]} intro={intro} />
      <div className="container-lux section-y">
        <div className="mx-auto max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.heading} className="grid gap-4 border-t border-line py-10 sm:grid-cols-[3rem_1fr]">
              <span className="font-display text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-2xl">{s.heading}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-muted [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{s.body}</div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
