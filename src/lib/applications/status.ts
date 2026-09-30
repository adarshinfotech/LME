export const STATUSES = [
  "NEW",
  "CONTACTED",
  "CALL_SCHEDULED",
  "QUALIFIED",
  "DEMO",
  "PROPOSAL",
  "PARTNER_JOINED",
  "ONBOARDING",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof STATUSES)[number];

/** Pipeline order (REJECTED sits outside the forward pipeline). */
export const PIPELINE: ApplicationStatus[] = STATUSES.filter((s) => s !== "REJECTED");

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CALL_SCHEDULED: "Call scheduled",
  QUALIFIED: "Qualified",
  DEMO: "Demo",
  PROPOSAL: "Proposal",
  PARTNER_JOINED: "Partner joined",
  ONBOARDING: "Onboarding",
  REJECTED: "Rejected",
};

export function isStatus(v: unknown): v is ApplicationStatus {
  return typeof v === "string" && (STATUSES as readonly string[]).includes(v);
}
