import type { ApplicationStatus } from "./status";

export type ApplicationRecord = {
  id: string;
  applicationNumber: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  applicantType: string;
  businessStatus: string;
  salesExperience: string;
  targetCustomers: string[];
  targetLocation: string;
  acquisitionMethods: string[];
  startTimeline: string;
  businessGoal: string;
  status: ApplicationStatus;
  assignedTo: string | null;
  assignedName: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityKind = "created" | "status_changed" | "assigned" | "note" | "notes_updated";

export type ActivityRecord = {
  id: string;
  kind: ActivityKind;
  actorName: string | null;
  fromValue: string | null;
  toValue: string | null;
  body: string | null;
  createdAt: string;
};

export type StaffMember = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "sales";
};

export type ApplicationFilters = {
  q?: string;
  status?: ApplicationStatus;
  state?: string;
  applicantType?: string;
  assignedTo?: string;
  page?: number;
};

export type Funnel = {
  visitors: number;
  applyClicks: number;
  applicationsStarted: number;
  applicationsCompleted: number;
  qualified: number;
  partners: number;
};
