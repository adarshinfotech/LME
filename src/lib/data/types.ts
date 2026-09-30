import type { ApplicationInput } from "@/lib/applications/schema";
import type { ApplicationStatus } from "@/lib/applications/status";
import type { ActivityRecord, ApplicationFilters, ApplicationRecord, Funnel, StaffMember } from "@/lib/applications/types";
import type { AnalyticsEvent } from "@/lib/analytics";

export const PAGE_SIZE = 25;

export type SubmissionMeta = { ipHash: string; userAgent: string };

export type AbuseSignals = { recentFromIp: number; duplicate: boolean };

/** Trusted server-side writes from the public website. */
export interface PublicStore {
  createApplication(input: ApplicationInput, meta: SubmissionMeta): Promise<{ applicationNumber: string }>;
  abuseSignals(input: Pick<ApplicationInput, "email" | "mobile">, ipHash: string): Promise<AbuseSignals>;
  recordEvent(event: { name: AnalyticsEvent; sessionId: string; path: string; props: Record<string, unknown> }): Promise<void>;
}

/** Operations available to a signed-in LMI staff member. */
export interface AdminStore {
  listApplications(filters: ApplicationFilters): Promise<{ rows: ApplicationRecord[]; total: number }>;
  statusCounts(): Promise<Record<ApplicationStatus, number>>;
  distinctStates(): Promise<string[]>;
  getApplication(id: string): Promise<ApplicationRecord | null>;
  listActivity(id: string): Promise<ActivityRecord[]>;
  listStaff(): Promise<StaffMember[]>;
  updateStatus(id: string, status: ApplicationStatus): Promise<void>;
  assign(id: string, staffId: string | null): Promise<void>;
  saveInternalNotes(id: string, notes: string): Promise<void>;
  addNote(id: string, body: string): Promise<void>;
  /** Funnel for the trailing `days` days. */
  funnel(days: number): Promise<Funnel>;
}

export class StoreError extends Error {}
