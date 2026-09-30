import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How LMI collects, uses and protects information submitted through the technology partner application.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="September 2026"
      intro={`This notice explains how ${site.name} (${site.fullName}), powered by ${site.poweredBy}, handles information you share with us through this website.`}
      sections={[
        {
          heading: "Information we collect",
          body: (
            <>
              <p>When you apply to become an LMI Technology Partner, we collect the details you enter in the application form:</p>
              <ul>
                <li>Name, mobile number, email address, city and state</li>
                <li>Your background, business status and sales experience</li>
                <li>Your target market, customer-acquisition plans, start timeline and goals</li>
              </ul>
              <p>
                We also record basic technical information needed to protect the form from abuse, such as a one-way hashed network
                identifier and your browser type.
              </p>
            </>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <ul>
              <li>To review your application and assess fit for the partner programme</li>
              <li>To contact you by phone or email about your application</li>
              <li>To prevent spam and fraudulent submissions</li>
            </ul>
          ),
        },
        {
          heading: "Website analytics",
          body: (
            <p>
              We measure aggregate usage — such as page views and whether an application was started or completed — using a random session
              identifier kept in your browser for the current session. No advertising cookies are used, and we respect your browser&rsquo;s
              Do Not Track setting.
            </p>
          ),
        },
        {
          heading: "Storage and access",
          body: (
            <p>
              Applications are stored in a secured database. Access is restricted to authorised members of the LMI partnership team. We do
              not sell your information.
            </p>
          ),
        },
        {
          heading: "Retention",
          body: (
            <p>
              We keep application information for as long as needed to evaluate and manage the partnership relationship, or as required by
              law.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can ask us to access, correct or delete the information you submitted. Please contact the LMI partnership team
              {site.contact.email ? (
                <>
                  {" "}
                  at{" "}
                  <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          ),
        },
      ]}
    />
  );
}
