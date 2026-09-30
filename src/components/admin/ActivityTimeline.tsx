import { STATUS_LABELS, isStatus } from "@/lib/applications/status";
import type { ActivityRecord } from "@/lib/applications/types";
import { formatDateTime } from "@/lib/format";

function describe(a: ActivityRecord) {
  const label = (v: string | null) => (v && isStatus(v) ? STATUS_LABELS[v] : (v ?? ""));
  switch (a.kind) {
    case "created":
      return "Application submitted";
    case "status_changed":
      return (
        <>
          Status changed from <strong className="font-medium">{label(a.fromValue)}</strong> to{" "}
          <strong className="font-medium">{label(a.toValue)}</strong>
        </>
      );
    case "assigned":
      return a.toValue === "Unassigned" ? (
        "Assignment cleared"
      ) : (
        <>
          Assigned to <strong className="font-medium">{a.toValue}</strong>
        </>
      );
    case "notes_updated":
      return "Internal notes updated";
    case "note":
      return "Note";
  }
}

export function ActivityTimeline({ items }: { items: ActivityRecord[] }) {
  if (!items.length) return <p className="p-5 text-sm text-muted sm:p-6">No activity yet.</p>;
  return (
    <ol className="relative p-5 sm:p-6">
      <span aria-hidden="true" className="absolute bottom-8 left-[1.6rem] top-8 w-px bg-line sm:left-[1.85rem]" />
      {items.map((a) => (
        <li key={a.id} className="relative grid grid-cols-[1.25rem_1fr] gap-3 pb-6 last:pb-0">
          <span
            aria-hidden="true"
            className={`relative z-10 mt-1.5 size-2.5 justify-self-center rounded-full border ${a.kind === "note" ? "border-ink bg-ink" : "border-ink/50 bg-sand"}`}
          />
          <div className="text-sm">
            <p className="leading-relaxed">{describe(a)}</p>
            {a.body ? <p className="mt-2 whitespace-pre-wrap border-l-2 border-ink/15 pl-3 leading-relaxed text-ink/90">{a.body}</p> : null}
            <p className="mt-1 text-xs text-muted">
              {a.actorName ?? (a.kind === "created" ? "Website" : "System")} ·{" "}
              <time dateTime={a.createdAt}>{formatDateTime(a.createdAt)}</time>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
