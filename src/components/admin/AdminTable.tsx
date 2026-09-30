import Link from "next/link";
import { APPLICANT_TYPES, TARGET_CUSTOMERS, labelFor } from "@/lib/applications/options";
import type { ApplicationRecord } from "@/lib/applications/types";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

function targets(a: ApplicationRecord) {
  const labels = a.targetCustomers.map((t) => labelFor(TARGET_CUSTOMERS, t));
  return labels.length > 2 ? `${labels.slice(0, 2).join(", ")} +${labels.length - 2}` : labels.join(", ");
}

export function AdminTable({ rows }: { rows: ApplicationRecord[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto border border-line bg-white/50 lg:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Partner applications</caption>
          <thead>
            <tr className="border-b border-line text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              <th scope="col" className="px-5 py-4 font-medium">
                Applicant
              </th>
              <th scope="col" className="px-5 py-4 font-medium">
                Location
              </th>
              <th scope="col" className="px-5 py-4 font-medium">
                Type
              </th>
              <th scope="col" className="px-5 py-4 font-medium">
                Target market
              </th>
              <th scope="col" className="px-5 py-4 font-medium">
                Status
              </th>
              <th scope="col" className="px-5 py-4 font-medium">
                Assigned
              </th>
              <th scope="col" className="px-5 py-4 text-right font-medium">
                Received
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="group relative border-b border-line last:border-0 hover:bg-sand/80">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/applications/${a.id}`}
                    className="font-medium after:absolute after:inset-0 focus-visible:outline-none group-has-[:focus-visible]:underline"
                  >
                    {a.fullName}
                  </Link>
                  <div className="mt-0.5 font-mono text-xs text-muted">{a.applicationNumber}</div>
                </td>
                <td className="px-5 py-4">
                  {a.city}
                  <div className="text-xs text-muted">{a.state}</div>
                </td>
                <td className="px-5 py-4">{labelFor(APPLICANT_TYPES, a.applicantType)}</td>
                <td className="max-w-56 px-5 py-4 text-muted">{targets(a)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-5 py-4 text-muted">{a.assignedName ?? "—"}</td>
                <td className="px-5 py-4 text-right tabular-nums text-muted">{formatDate(a.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <ul className="grid gap-3 lg:hidden">
        {rows.map((a) => (
          <li key={a.id}>
            <Link href={`/admin/applications/${a.id}`} className="block border border-line bg-white/50 p-4 active:bg-sand">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{a.fullName}</p>
                  <p className="font-mono text-xs text-muted">{a.applicationNumber}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-3 text-sm text-muted">
                {labelFor(APPLICANT_TYPES, a.applicantType)} · {a.city}, {a.state}
              </p>
              <p className="mt-1 flex justify-between text-xs text-muted">
                <span>{a.assignedName ?? "Unassigned"}</span>
                <span>{formatDate(a.createdAt)}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
