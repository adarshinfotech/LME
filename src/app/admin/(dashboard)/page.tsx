import type { Metadata } from "next";
import Link from "next/link";
import { AccessDenied } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { Filters } from "@/components/admin/Filters";
import { requireStaff } from "@/lib/auth";
import { PAGE_SIZE } from "@/lib/data/types";
import { APPLICANT_TYPES } from "@/lib/applications/options";
import { PIPELINE, STATUS_LABELS, isStatus, type ApplicationStatus } from "@/lib/applications/status";
import type { ApplicationFilters } from "@/lib/applications/types";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Applications" };

const METRICS: { label: string; statuses: ApplicationStatus[] }[] = [
  { label: "New applications", statuses: ["NEW"] },
  { label: "Contacted", statuses: ["CONTACTED", "CALL_SCHEDULED"] },
  { label: "Qualified", statuses: ["QUALIFIED"] },
  { label: "Demos", statuses: ["DEMO"] },
  { label: "Proposals", statuses: ["PROPOSAL"] },
  { label: "Partners joined", statuses: ["PARTNER_JOINED", "ONBOARDING"] },
];

const one = (v: string | string[] | undefined) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 100) : undefined);

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  const ctx = await requireStaff();
  if (!ctx) return <AccessDenied />;
  const sp = await searchParams;

  const status = one(sp.status);
  const type = one(sp.type);
  const filters: ApplicationFilters = {
    q: one(sp.q),
    status: isStatus(status) ? status : undefined,
    state: one(sp.state),
    applicantType: APPLICANT_TYPES.some((t) => t.value === type) ? type : undefined,
    assignedTo: one(sp.assigned),
    page: Math.max(1, Number(one(sp.page)) || 1),
  };

  const [counts, list, states, staff, funnel] = await Promise.all([
    ctx.store.statusCounts(),
    ctx.store.listApplications(filters),
    ctx.store.distinctStates(),
    ctx.store.listStaff(),
    ctx.store.funnel(30),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const pages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const hasFilters = Boolean(filters.q || filters.status || filters.state || filters.applicantType || filters.assignedTo);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => typeof v === "string" && k !== "page" && params.set(k, v));
    params.set("page", String(p));
    return `/admin?${params}`;
  };

  const funnelSteps = [
    { label: "Visitors", value: funnel.visitors },
    { label: "Apply clicks", value: funnel.applyClicks },
    { label: "Applications started", value: funnel.applicationsStarted },
    { label: "Applications completed", value: funnel.applicationsCompleted },
    { label: "Qualified", value: funnel.qualified },
    { label: "Partners", value: funnel.partners },
  ];
  const funnelMax = Math.max(1, ...funnelSteps.map((s) => s.value));

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-muted">Partner pipeline</p>
          <h1 className="mt-3 font-display text-display-sm">Applications</h1>
        </div>
        <p className="text-sm text-muted">
          {total.toLocaleString("en-IN")} total · {counts.REJECTED.toLocaleString("en-IN")} rejected
        </p>
      </header>

      {/* Metrics */}
      <section aria-label="Key metrics">
        <dl className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 xl:grid-cols-6">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-sand p-5">
              <dt className="eyebrow text-[0.62rem] text-muted">{m.label}</dt>
              <dd className="mt-4 font-display text-4xl font-light tabular-nums">
                {m.statuses.reduce((n, s) => n + counts[s], 0).toLocaleString("en-IN")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-10 xl:grid-cols-12">
        {/* Pipeline */}
        <section aria-labelledby="pipeline-title" className="xl:col-span-7">
          <h2 id="pipeline-title" className="eyebrow text-muted">
            Pipeline
          </h2>
          <ol className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {PIPELINE.map((s, i) => (
              <li key={s} className="bg-sand">
                <Link
                  href={filters.status === s ? "/admin" : `/admin?status=${s}`}
                  aria-current={filters.status === s ? "true" : undefined}
                  className={cn(
                    "flex h-full flex-col justify-between gap-6 p-4 transition-colors hover:bg-linen",
                    filters.status === s && "bg-ink text-sand hover:bg-ink",
                  )}
                >
                  <span className="flex items-center justify-between text-xs">
                    <span className={cn("tabular-nums", filters.status === s ? "text-stone" : "text-muted")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < PIPELINE.length - 1 ? (
                      <span aria-hidden="true" className={filters.status === s ? "text-stone" : "text-muted"}>
                        →
                      </span>
                    ) : null}
                  </span>
                  <span>
                    <span className="block font-display text-3xl font-light tabular-nums">{counts[s]}</span>
                    <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.14em]">{STATUS_LABELS[s]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Funnel */}
        <section aria-labelledby="funnel-title" className="xl:col-span-5">
          <h2 id="funnel-title" className="eyebrow text-muted">
            Funnel · last 30 days
          </h2>
          <ol className="mt-4 space-y-3 border border-line p-5">
            {funnelSteps.map((s, i) => {
              const prev = i > 0 ? funnelSteps[i - 1].value : null;
              const rate = prev ? Math.round((s.value / prev) * 100) : null;
              return (
                <li key={s.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="tabular-nums">
                      {s.value.toLocaleString("en-IN")}
                      {rate !== null ? <span className="ml-2 text-xs text-muted">{rate}%</span> : null}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-line" aria-hidden="true">
                    <div className="h-full bg-ink" style={{ width: `${(s.value / funnelMax) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-xs text-muted">Visitor and click counts are unique browser sessions.</p>
        </section>
      </div>

      {/* List */}
      <section aria-labelledby="list-title" className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 id="list-title" className="eyebrow text-muted">
            {hasFilters ? "Filtered applications" : "All applications"}
          </h2>
          <p className="text-sm text-muted" aria-live="polite">
            {list.total.toLocaleString("en-IN")} {list.total === 1 ? "result" : "results"}
          </p>
        </div>
        <Filters filters={filters} states={states} staff={staff} />

        {list.rows.length ? (
          <AdminTable rows={list.rows} />
        ) : (
          <div className="border border-dashed border-ink/25 px-6 py-16 text-center">
            <p className="font-display text-2xl">{hasFilters ? "No matching applications" : "No applications yet"}</p>
            <p className="mx-auto mt-2 max-w-sm text-muted">
              {hasFilters
                ? "Try a different search or clear the filters."
                : "New partner applications from the website will appear here as soon as they are submitted."}
            </p>
            {hasFilters ? (
              <Link href="/admin" className="mt-6 inline-block text-sm underline underline-offset-4">
                Clear filters
              </Link>
            ) : null}
          </div>
        )}

        {pages > 1 ? (
          <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
            {filters.page! > 1 ? (
              <Link href={pageHref(filters.page! - 1)} className="underline underline-offset-4">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-muted">
              Page {filters.page} of {pages}
            </span>
            {filters.page! < pages ? (
              <Link href={pageHref(filters.page! + 1)} className="underline underline-offset-4">
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
