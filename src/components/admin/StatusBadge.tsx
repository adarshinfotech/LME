import { STATUS_LABELS, type ApplicationStatus } from "@/lib/applications/status";
import { cn } from "@/lib/cn";

const tone: Record<ApplicationStatus, string> = {
  NEW: "bg-ink text-sand border-ink",
  CONTACTED: "border-ink/40 text-ink",
  CALL_SCHEDULED: "border-ink/40 text-ink",
  QUALIFIED: "border-ink text-ink",
  DEMO: "border-ink text-ink",
  PROPOSAL: "border-ink text-ink",
  PARTNER_JOINED: "bg-success text-white border-success",
  ONBOARDING: "border-success text-success",
  REJECTED: "border-danger/40 text-danger",
};

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center whitespace-nowrap border px-2 text-[0.65rem] font-medium uppercase tracking-[0.14em]",
        tone[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
