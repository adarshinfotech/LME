import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the LMI website and submitting a technology partner application.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="September 2026"
      intro={`These terms govern your use of the ${site.name} website. By using the site you agree to them.`}
      sections={[
        {
          heading: "About this website",
          body: (
            <p>
              This website presents the LMI Technology Partner Program, powered by {site.poweredBy}. Content is provided for general
              information and does not constitute an offer, contract or financial advice.
            </p>
          ),
        },
        {
          heading: "Illustrative figures",
          body: (
            <p>
              Revenue scenarios shown on this website are illustrative examples only. They are not forecasts, promises or guarantees of
              income, profit or customer numbers. Actual results depend on customer acquisition, product mix, pricing, retention, operating
              costs and other factors.
            </p>
          ),
        },
        {
          heading: "Applications",
          body: (
            <p>
              Submitting an application does not create a partnership or any obligation for either party. Every application is reviewed by
              the LMI partnership team, and participation is subject to a separate written partner agreement.
            </p>
          ),
        },
        {
          heading: "Pricing and commercial terms",
          body: (
            <p>
              The partner fee shown on this website is exclusive of GST. All other commercial terms — including revenue-share eligibility,
              territory and branding rules — are defined in the partner agreement.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The LMI name, logo and website content, and all software products presented, remain the property of their respective owners.
              Core product and source-code ownership remains with {site.poweredBy}.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <p>Do not misuse the website, submit false information, or attempt to access areas or data you are not authorised to access.</p>
          ),
        },
      ]}
    />
  );
}
