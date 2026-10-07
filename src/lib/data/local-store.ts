import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { STATUSES, type ApplicationStatus } from "@/lib/applications/status";
import type { ActivityRecord, ApplicationRecord, StaffMember } from "@/lib/applications/types";
import { PAGE_SIZE, StoreError, type AdminStore, type PublicStore } from "./types";

/**
 * Local preview store (development only — see `localDataMode` in env.ts).
 * Mirrors the Supabase schema's behaviour, including the activity log, in a
 * git-ignored JSON file so the whole product can be exercised without a
 * database. Never used in production builds.
 */

type StoredApplication = Omit<ApplicationRecord, "assignedName"> & { ipHash: string; userAgent: string };
type StoredActivity = Omit<ActivityRecord, "actorName"> & { applicationId: string; actorId: string | null };
type StoredEvent = { name: string; sessionId: string; path: string; props: Record<string, unknown>; createdAt: string };
export type LocalStaff = StaffMember & { password: string };

type Data = { applications: StoredApplication[]; activity: StoredActivity[]; events: StoredEvent[]; staff: LocalStaff[] };

const FILE = path.join(process.cwd(), ".data", "local-store.json");

function seedStaff(): LocalStaff[] {
  const password = process.env.LOCAL_ADMIN_PASSWORD || "lmi-local-admin";
  return [
    { id: "local-admin", fullName: "Local Admin", email: "admin@lmi.local", role: "admin", password },
    { id: "local-sales", fullName: "Local Sales", email: "sales@lmi.local", role: "sales", password },
  ];
}

let queue: Promise<unknown> = Promise.resolve();

async function read(): Promise<Data> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Data;
  } catch {
    return { applications: [], activity: [], events: [], staff: seedStaff() };
  }
}

/** Serialise writes so concurrent requests cannot clobber the file. */
function mutate<T>(fn: (d: Data) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const d = await read();
    const result = await fn(d);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(d, null, 2));
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function applicationNumber(existing: Set<string>) {
  let n: string;
  do {
    n = "LMI-" + Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
  } while (existing.has(n));
  return n;
}

function withAssignee(a: StoredApplication, staff: LocalStaff[]): ApplicationRecord {
  const { ipHash: _ip, userAgent: _ua, ...rest } = a;
  return { ...rest, assignedName: staff.find((s) => s.id === a.assignedTo)?.fullName ?? null };
}

function log(d: Data, entry: Omit<StoredActivity, "id" | "createdAt">) {
  d.activity.push({ id: randomUUID(), createdAt: new Date().toISOString(), ...entry });
}

export async function findLocalStaff(email: string) {
  const d = await read();
  return d.staff.find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getLocalStaff(id: string): Promise<StaffMember | null> {
  const d = await read();
  const s = d.staff.find((x) => x.id === id);
  return s ? { id: s.id, fullName: s.fullName, email: s.email, role: s.role } : null;
}

export const localPublicStore: PublicStore = {
  createApplication(input, meta) {
    return mutate((d) => {
      const now = new Date().toISOString();
      const app: StoredApplication = {
        id: randomUUID(),
        applicationNumber: applicationNumber(new Set(d.applications.map((a) => a.applicationNumber))),
        ...input,
        status: "NEW",
        assignedTo: null,
        internalNotes: null,
        createdAt: now,
        updatedAt: now,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent.slice(0, 512),
      };
      delete (app as Partial<typeof input>).consent;
      d.applications.push(app);
      log(d, { applicationId: app.id, actorId: null, kind: "created", fromValue: null, toValue: "NEW", body: null });
      return { applicationNumber: app.applicationNumber };
    });
  },

  async abuseSignals(input, ipHash) {
    const d = await read();
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return {
      recentFromIp: d.applications.filter((a) => a.ipHash === ipHash && Date.parse(a.createdAt) >= hourAgo).length,
      duplicate: d.applications.some((a) => (a.email === input.email || a.mobile === input.mobile) && Date.parse(a.createdAt) >= dayAgo),
    };
  },

  async recordEvent(event) {
    await mutate((d) => {
      d.events.push({ ...event, createdAt: new Date().toISOString() });
      if (d.events.length > 20000) d.events.splice(0, d.events.length - 20000);
    });
  },
};

export function localAdminStore(staffId: string): AdminStore {
  const update = (id: string, fn: (a: StoredApplication, d: Data) => void) =>
    mutate((d) => {
      const a = d.applications.find((x) => x.id === id);
      if (!a) return;
      fn(a, d);
      a.updatedAt = new Date().toISOString();
    });

  return {
    async listApplications(f) {
      const d = await read();
      const q = f.q?.trim().toLowerCase();
      const rows = d.applications
        .filter((a) => !f.status || a.status === f.status)
        .filter((a) => !f.state || a.state === f.state)
        .filter((a) => !f.applicantType || a.applicantType === f.applicantType)
        .filter((a) => !f.assignedTo || (f.assignedTo === "unassigned" ? !a.assignedTo : a.assignedTo === f.assignedTo))
        .filter(
          (a) =>
            !q || [a.fullName, a.email, a.mobile, a.applicationNumber, a.city, a.targetLocation].some((v) => v.toLowerCase().includes(q)),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const page = Math.max(1, f.page ?? 1);
      return {
        rows: rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((a) => withAssignee(a, d.staff)),
        total: rows.length,
      };
    },

    async statusCounts() {
      const d = await read();
      const out = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<ApplicationStatus, number>;
      d.applications.forEach((a) => out[a.status]++);
      return out;
    },

    async distinctStates() {
      const d = await read();
      return [...new Set(d.applications.map((a) => a.state))].sort();
    },

    async getApplication(id) {
      const d = await read();
      const a = d.applications.find((x) => x.id === id);
      return a ? withAssignee(a, d.staff) : null;
    },

    async listActivity(id) {
      const d = await read();
      return d.activity
        .filter((x) => x.applicationId === id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(({ applicationId: _a, actorId, ...rest }) => ({
          ...rest,
          actorName: d.staff.find((s) => s.id === actorId)?.fullName ?? null,
        }));
    },

    async listStaff() {
      const d = await read();
      return d.staff.map(({ password: _p, ...s }) => s);
    },

    async updateStatus(id, status) {
      await update(id, (a, d) => {
        if (a.status === status) return;
        log(d, { applicationId: id, actorId: staffId, kind: "status_changed", fromValue: a.status, toValue: status, body: null });
        a.status = status;
      });
    },

    async assign(id, assignee) {
      await update(id, (a, d) => {
        if (a.assignedTo === assignee) return;
        const name = d.staff.find((s) => s.id === assignee)?.fullName ?? "Unassigned";
        log(d, { applicationId: id, actorId: staffId, kind: "assigned", fromValue: null, toValue: name, body: null });
        a.assignedTo = assignee;
      });
    },

    async saveInternalNotes(id, notes) {
      await update(id, (a, d) => {
        if ((a.internalNotes ?? "") === notes) return;
        log(d, { applicationId: id, actorId: staffId, kind: "notes_updated", fromValue: null, toValue: null, body: null });
        a.internalNotes = notes || null;
      });
    },

    async addNote(id, body) {
      await mutate((d) => log(d, { applicationId: id, actorId: staffId, kind: "note", fromValue: null, toValue: null, body }));
    },

    async deleteApplication(id) {
      await mutate((d) => {
        if (!d.applications.some((a) => a.id === id)) throw new StoreError("Application not found");
        d.applications = d.applications.filter((a) => a.id !== id);
        d.activity = d.activity.filter((a) => a.applicationId !== id);
      });
    },

    async funnel(days) {
      const d = await read();
      const t = Date.now() - days * 86_400_000;
      const events = d.events.filter((e) => Date.parse(e.createdAt) >= t);
      const sessions = (names: string[]) => new Set(events.filter((e) => names.includes(e.name)).map((e) => e.sessionId)).size;
      const apps = d.applications.filter((a) => Date.parse(a.createdAt) >= t);
      return {
        visitors: sessions(["page_view"]),
        applyClicks: sessions(["hero_apply_click", "apply_click", "apply_page_view"]),
        applicationsStarted: sessions(["application_started"]),
        applicationsCompleted: apps.length,
        qualified: apps.filter((a) => ["QUALIFIED", "DEMO", "PROPOSAL", "PARTNER_JOINED", "ONBOARDING"].includes(a.status)).length,
        partners: apps.filter((a) => ["PARTNER_JOINED", "ONBOARDING"].includes(a.status)).length,
      };
    },
  };
}
