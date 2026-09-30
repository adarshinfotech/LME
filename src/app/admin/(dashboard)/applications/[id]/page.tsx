import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { AccessDenied } from "@/components/admin/AdminShell";
import { AssignControl, InternalNotes, NoteComposer, StatusControl } from "@/components/admin/ApplicationControls";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireStaff } from "@/lib/auth";
import {
  ACQUISITION_METHODS,
  APPLICANT_TYPES,
  BUSINESS_STATUS,
  SALES_EXPERIENCE,
  START_TIMELINES,
  TARGET_CUSTOMERS,
  labelFor,
} from "@/lib/applications/options";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Application" };

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-[0.95rem]">{children}</dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow border-b border-ink/80 pb-3 text-[0.65rem] text-muted">{title}</h2>
      <dl>{children}</dl>
    </section>
  );
}

export default async function ApplicationPage({ params }: PageProps<"/admin/applications/[id]">) {
  const ctx = await requireStaff();
  if (!ctx) return <AccessDenied />;
  const { id } = await params;
  if (!/^[\w-]{1,64}$/.test(id)) notFound();

  const [app, activity, staff] = await Promise.all([ctx.store.getApplication(id), ctx.store.listActivity(id), ctx.store.listStaff()]);
  if (!app) notFound();

  const list = (values: string[], options: Parameters<typeof labelFor>[0]) => values.map((v) => labelFor(options, v)).join(", ");

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
        ← All applications
      </Link>

      <header className="mt-6 flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm text-muted">{app.applicationNumber}</p>
          <h1 className="mt-2 font-display text-display-sm">{app.fullName}</h1>
          <p className="mt-2 text-muted">
            {app.city}, {app.state} · Received {formatDateTime(app.createdAt)}
          </p>
        </div>
        <StatusBadge status={app.status} className="self-start sm:self-auto" />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7 xl:col-span-8">
          <Group title="Contact">
            <Detail label="Phone">
              <a href={`tel:${app.mobile}`} className="underline underline-offset-4">
                {app.mobile}
              </a>
            </Detail>
            <Detail label="Email">
              <a href={`mailto:${app.email}`} className="break-all underline underline-offset-4">
                {app.email}
              </a>
            </Detail>
            <Detail label="Location">
              {app.city}, {app.state}
            </Detail>
          </Group>

          <Group title="Background">
            <Detail label="Applicant type">{labelFor(APPLICANT_TYPES, app.applicantType)}</Detail>
            <Detail label="Current business">{labelFor(BUSINESS_STATUS, app.businessStatus)}</Detail>
            <Detail label="Sales experience">{labelFor(SALES_EXPERIENCE, app.salesExperience)}</Detail>
          </Group>

          <Group title="Market & plan">
            <Detail label="Target customers">{list(app.targetCustomers, TARGET_CUSTOMERS)}</Detail>
            <Detail label="Target location">{app.targetLocation}</Detail>
            <Detail label="Acquisition strategy">{list(app.acquisitionMethods, ACQUISITION_METHODS)}</Detail>
            <Detail label="Start timeline">{labelFor(START_TIMELINES, app.startTimeline)}</Detail>
          </Group>

          <section>
            <h2 className="eyebrow border-b border-ink/80 pb-3 text-[0.65rem] text-muted">Business goal</h2>
            <p className="mt-5 whitespace-pre-wrap text-lg leading-relaxed">{app.businessGoal}</p>
          </section>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4" aria-label="Pipeline management">
          <div className="border border-line bg-white/40 lg:sticky lg:top-24">
            <StatusControl id={app.id} status={app.status} />
            <AssignControl id={app.id} assignedTo={app.assignedTo} staff={staff} />
            <InternalNotes id={app.id} notes={app.internalNotes} />
            <div className="border-b border-line">
              <NoteComposer id={app.id} />
            </div>
            <section aria-labelledby="timeline-title">
              <h2 id="timeline-title" className="eyebrow px-5 pt-5 text-[0.65rem] text-muted sm:px-6 sm:pt-6">
                Activity timeline
              </h2>
              <ActivityTimeline items={activity} />
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
