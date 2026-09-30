import { Reveal } from "@/components/motion/Reveal";
import { SectionView } from "@/components/motion/SectionView";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevenueSlider } from "./RevenueSlider";

export function Earnings() {
  return (
    <section aria-labelledby="earnings-title" className="section-y bg-ink text-sand" data-theme="dark">
      <SectionView event="revenue_section_view" className="container-lux">
        <SectionHeading
          id="earnings-title"
          tone="dark"
          eyebrow="Earning opportunity"
          title={["Don't just sell software.", "Build a recurring-revenue business."]}
          intro="Every business you bring onto LMI can become part of your growing customer base, creating recurring SaaS revenue and additional service opportunities."
        />
        <Reveal className="mt-16 sm:mt-20">
          <RevenueSlider />
        </Reveal>
      </SectionView>
    </section>
  );
}
