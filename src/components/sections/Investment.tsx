import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button } from "@/components/ui/Button";
import { partnerOffer } from "@/lib/site";

const includes = [
  "Access to the ready-to-sell product portfolio",
  "Sales and demo material with product training",
  "Partner dashboard for leads, customers and subscriptions",
  "Implementation and onboarding guidance",
  "Product updates, hosting and core technical maintenance",
  "60% share of eligible recurring SaaS revenue",
];

export function Investment() {
  return (
    <section aria-labelledby="investment-title" className="section-y bg-ink text-sand" data-theme="dark">
      <div className="container-lux">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <p className="eyebrow flex items-center gap-3 text-sand">
                <span aria-hidden="true" className="h-px w-8 bg-sand" />
                {partnerOffer.label}
              </p>
            </Reveal>
            <h2 id="investment-title" className="sr-only">
              Partner investment: {partnerOffer.amount} {partnerOffer.taxNote}, {partnerOffer.description}
            </h2>
            <div aria-hidden="true" className="mt-10">
              {partnerOffer.listPrice ? (
                <p className="mb-3 font-display text-2xl text-stone line-through decoration-1">{partnerOffer.listPrice}</p>
              ) : null}
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <WordReveal
                  as="p"
                  lines={[partnerOffer.amount]}
                  className="font-display text-[clamp(3.75rem,1.5rem+9vw,10rem)] font-light leading-none tracking-[-0.05em]"
                />
                <Reveal delay={0.4} as="span" className="font-display text-2xl text-stone sm:text-3xl">
                  {partnerOffer.taxNote}
                </Reveal>
              </div>
              <Reveal delay={0.5}>
                <p className="mt-6 text-xl sm:text-2xl">{partnerOffer.description}</p>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="mt-14 border border-line-dark p-6 sm:p-8">
              <p className="eyebrow text-stone">Student entrepreneur?</p>
              <p className="mt-3 font-display text-xl sm:text-2xl">{partnerOffer.studentNote}</p>
            </Reveal>

            <Reveal delay={0.4} className="mt-10">
              <Button
                href="/apply"
                variant="light"
                size="lg"
                arrow
                magnetic
                trackEvent="apply_click"
                trackProps={{ location: "investment" }}
              >
                Apply Now
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <h3 className="eyebrow text-stone">The partnership includes</h3>
            <ul className="mt-6 border-t border-line-dark">
              {includes.map((item) => (
                <li key={item} className="flex gap-4 border-b border-line-dark py-4 leading-relaxed">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-sand" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-stone">
              Commercial terms, territory and branding rules are confirmed in the partner agreement during your discussion with the LMI
              partnership team.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
