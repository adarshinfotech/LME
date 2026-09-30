import type { Metadata } from "next";
import { products } from "@/content/products";
import { Reveal } from "@/components/motion/Reveal";
import { SectionView } from "@/components/motion/SectionView";
import { AdditionalRevenue } from "@/components/sections/AdditionalRevenue";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/sections/ProductCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "CRM, HR, inventory, workshop, gym, hostel, ERP, construction ERP, manufacturing ERP and AI automation — ready-to-sell business software for LMI technology partners.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={["One partnership.", "Multiple business solutions."]}
        intro="A portfolio of ready-to-sell business software — built, hosted and maintained by Adarsh Infotech, sold and supported by you."
      >
        <Button href="/apply" arrow magnetic trackEvent="apply_click" trackProps={{ location: "solutions_hero" }}>
          Apply Now
        </Button>
      </PageHero>

      <section aria-labelledby="portfolio-title" className="section-y">
        <SectionView event="solutions_view" className="container-lux">
          <h2 id="portfolio-title" className="sr-only">
            Product portfolio
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08} className="min-h-[30rem]">
                <ProductCard product={p} index={i} total={products.length} tone="light" limit={6} />
              </Reveal>
            ))}
            <Reveal as="li" delay={0.08} className="min-h-[30rem] bg-ink p-7 text-sand sm:p-9">
              <div className="flex h-full flex-col justify-between gap-10">
                <p className="eyebrow text-stone">Cross-sell</p>
                <div>
                  <p className="font-display text-[2rem] leading-[1.1] tracking-[-0.02em]">One customer can use more than one solution.</p>
                  <p className="mt-4 leading-relaxed text-stone">
                    Grow each account by adding products, AI automation, integrations and services over time.
                  </p>
                </div>
                <Button href="/partner" variant="outline-light" arrow>
                  See the opportunity
                </Button>
              </div>
            </Reveal>
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-muted">
            Final customer scope can vary by company size, users, branches, modules, integrations and customization. Commercial details are
            shared with applicants during the partnership discussion.
          </p>
        </SectionView>
      </section>

      <AdditionalRevenue />
      <FinalCta />
    </>
  );
}
