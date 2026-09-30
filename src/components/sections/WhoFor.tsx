import { audiences } from "@/content/audiences";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhoFor() {
  return (
    <section aria-labelledby="who-title" className="section-y border-t border-line">
      <div className="container-lux">
        <SectionHeading id="who-title" eyebrow="Who it's for" size="lg" title={["Is LMI for you?"]} />

        <ul className="mt-16 grid gap-px border border-line bg-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal as="li" key={a.title} delay={(i % 3) * 0.08} className="group relative isolate overflow-hidden bg-sand">
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-x-100"
              />
              <div className="flex min-h-[14rem] flex-col justify-between p-7 transition-colors duration-700 group-hover:text-sand sm:p-9">
                <span className="font-display text-sm tabular-nums text-muted transition-colors duration-700 group-hover:text-stone">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-[-0.01em]">{a.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted transition-colors duration-700 group-hover:text-stone">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.16} className="bg-ink text-sand">
            <div className="flex h-full min-h-[14rem] flex-col justify-between gap-8 p-7 sm:p-9">
              <p className="eyebrow text-stone">Not sure where you fit?</p>
              <div>
                <p className="font-display text-2xl">Apply and talk to our team.</p>
                <Button
                  href="/apply"
                  variant="light"
                  arrow
                  className="mt-6 w-full sm:w-auto"
                  trackEvent="apply_click"
                  trackProps={{ location: "who_for" }}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
