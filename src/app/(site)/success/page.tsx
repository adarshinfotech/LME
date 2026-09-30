import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Button } from "@/components/ui/Button";
import { APPLICATION_NUMBER_RE } from "@/lib/applications/schema";

export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false, follow: false },
};

const next = [
  { title: "Review", body: "Our partnership team reviews your application." },
  { title: "Connect", body: "We contact you by phone or email using the details you provided." },
  { title: "Discuss", body: "We talk through your market, plan and the partnership." },
];

export default async function SuccessPage({ searchParams }: PageProps<"/success">) {
  const { id } = await searchParams;
  const applicationNumber = typeof id === "string" && APPLICATION_NUMBER_RE.test(id) ? id : null;

  return (
    <section className="flex min-h-[100svh] flex-col justify-center pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <div className="container-lux">
        <WordReveal as="h1" immediate lines={["YOU'RE IN."]} className="font-display text-display-xl font-light" />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal delay={0.3} className="lg:col-span-6">
            <p className="text-xl leading-relaxed sm:text-2xl">Your LMI Technology Partner application has been received.</p>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              Our partnership team will review your application and contact you using the details provided.
            </p>
            {applicationNumber ? (
              <div className="mt-10 inline-block border border-ink px-6 py-5">
                <p className="eyebrow text-muted">Application ID</p>
                <p className="mt-2 font-display text-3xl tracking-[0.04em] tabular-nums">{applicationNumber}</p>
              </div>
            ) : null}
            <div className="mt-10">
              <Button href="/" arrow size="lg">
                Back to LMI
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.45} className="lg:col-span-5 lg:col-start-8">
            <h2 className="eyebrow text-muted">What happens next</h2>
            <ol className="mt-6 border-t border-line">
              {next.map((n, i) => (
                <li key={n.title} className="grid grid-cols-[3rem_1fr] border-b border-line py-5">
                  <span className="font-display text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-display text-xl">{n.title}</p>
                    <p className="mt-1 text-muted">{n.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
