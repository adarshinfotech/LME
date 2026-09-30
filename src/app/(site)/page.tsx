import { AdditionalRevenue } from "@/components/sections/AdditionalRevenue";
import { Benefits } from "@/components/sections/Benefits";
import { Earnings } from "@/components/sections/Earnings";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Investment } from "@/components/sections/Investment";
import { Opportunity } from "@/components/sections/Opportunity";
import { Products } from "@/components/sections/Products";
import { RevenueShare } from "@/components/sections/RevenueShare";
import { Student } from "@/components/sections/Student";
import { Timeline } from "@/components/sections/Timeline";
import { WhoFor } from "@/components/sections/WhoFor";
import { WhyLmi } from "@/components/sections/WhyLmi";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Opportunity />
      <Benefits />
      <Products />
      <RevenueShare />
      <Earnings />
      <AdditionalRevenue />
      <WhyLmi />
      <Investment />
      <Timeline />
      <WhoFor />
      <Student />
      <FinalCta />
    </>
  );
}
