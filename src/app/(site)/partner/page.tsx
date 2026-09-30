import type { Metadata } from "next";
import { Earnings } from "@/components/sections/Earnings";
import { FinalCta } from "@/components/sections/FinalCta";
import { Investment } from "@/components/sections/Investment";
import { PageHero } from "@/components/sections/PageHero";
import { RevenueShare } from "@/components/sections/RevenueShare";
import { Student } from "@/components/sections/Student";
import { WhoFor } from "@/components/sections/WhoFor";
import { WhyLmi } from "@/components/sections/WhyLmi";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The Opportunity",
  description:
    "Build a recurring-revenue software business with LMI: a 60/40 partner revenue-share model, ready-to-sell products and technology powered by Adarsh Infotech.",
  alternates: { canonical: "/partner" },
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="The opportunity"
        title={["Your brand.", "Our technology."]}
        intro="LMI is a technology partnership for people who want to build a software business — without building every product from scratch."
      >
        <Button href="/apply" arrow magnetic trackEvent="apply_click" trackProps={{ location: "partner_hero" }}>
          Apply Now
        </Button>
      </PageHero>
      <RevenueShare />
      <Earnings />
      <WhyLmi />
      <Investment />
      <WhoFor />
      <Student />
      <FinalCta />
    </>
  );
}
