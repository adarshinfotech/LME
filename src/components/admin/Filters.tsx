"use client";

import Link from "next/link";
import { useRef } from "react";
import { APPLICANT_TYPES } from "@/lib/applications/options";
import { STATUSES, STATUS_LABELS } from "@/lib/applications/status";
import type { ApplicationFilters, StaffMember } from "@/lib/applications/types";

const selectClass =
  "h-11 w-full appearance-none border border-ink/20 bg-white/60 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22><path d=%22M1 1.5 6 6.5l5-5%22 fill=%22none%22 stroke=%22%23111%22 stroke-width=%221.3%22/></svg>')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat pl-3 pr-8 text-sm focus:border-ink focus:outline-none";

type Props = { filters: ApplicationFilters; states: string[]; staff: StaffMember[] };

/** GET form so filters live in the URL (shareable, back-button friendly). */
export function Filters({ filters, states, staff }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const submit = () => ref.current?.requestSubmit();
  const active = Boolean(filters.q || filters.status || filters.state || filters.applicantType || filters.assignedTo);

  return (
    <form ref={ref} method="get" action="/admin" role="search" aria-label="Filter applications" className="grid gap-3 md:grid-cols-12">
      <div className="relative md:col-span-4">
        <label htmlFor="q" className="sr-only">
          Search applications
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Search name, email, phone, ID or city"
          className="h-11 w-full border border-ink/20 bg-white/60 px-3 text-sm placeholder:text-muted/80 focus:border-ink focus:outline-none"
        />
      </div>
      <label className="md:col-span-2">
        <span className="sr-only">Status</span>
        <select name="status" defaultValue={filters.status ?? ""} onChange={submit} className={selectClass}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2">
        <span className="sr-only">Location (state)</span>
        <select name="state" defaultValue={filters.state ?? ""} onChange={submit} className={selectClass}>
          <option value="">All locations</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2">
        <span className="sr-only">Applicant type</span>
        <select name="type" defaultValue={filters.applicantType ?? ""} onChange={submit} className={selectClass}>
          <option value="">All applicant types</option>
          {APPLICANT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2">
        <span className="sr-only">Assigned to</span>
        <select name="assigned" defaultValue={filters.assignedTo ?? ""} onChange={submit} className={selectClass}>
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-4 md:col-span-12">
        <button type="submit" className="h-10 bg-ink px-5 text-xs uppercase tracking-[0.16em] text-sand">
          Search
        </button>
        {active ? (
          <Link href="/admin" className="text-sm underline underline-offset-4">
            Clear filters
          </Link>
        ) : null}
      </div>
    </form>
  );
}
