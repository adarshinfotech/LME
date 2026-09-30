import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { serviceClient } from "@/lib/supabase/service";
import { STATUSES, type ApplicationStatus } from "@/lib/applications/status";
import type { ActivityRecord, ApplicationRecord, StaffMember } from "@/lib/applications/types";
import { PAGE_SIZE, StoreError, type AdminStore, type PublicStore } from "./types";

type Row = Record<string, unknown>;

const APPLICATION_COLUMNS =
  "id, application_number, full_name, mobile, email, city, state, applicant_type, business_status, sales_experience, target_customers, target_location, acquisition_methods, start_timeline, business_goal, status, assigned_to, internal_notes, created_at, updated_at, assignee:staff_profiles!partner_applications_assigned_to_fkey(full_name)";

function toApplication(r: Row): ApplicationRecord {
  const assignee = r.assignee as { full_name?: string } | null;
  return {
    id: r.id as string,
    applicationNumber: r.application_number as string,
    fullName: r.full_name as string,
    mobile: r.mobile as string,
    email: r.email as string,
    city: r.city as string,
    state: r.state as string,
    applicantType: r.applicant_type as string,
    businessStatus: r.business_status as string,
    salesExperience: r.sales_experience as string,
    targetCustomers: (r.target_customers as string[]) ?? [],
    targetLocation: r.target_location as string,
    acquisitionMethods: (r.acquisition_methods as string[]) ?? [],
    startTimeline: r.start_timeline as string,
    businessGoal: r.business_goal as string,
    status: r.status as ApplicationStatus,
    assignedTo: (r.assigned_to as string) ?? null,
    assignedName: assignee?.full_name ?? null,
    internalNotes: (r.internal_notes as string) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function fail(context: string, error: { message: string } | null): never {
  // Log the technical detail server-side; callers show a friendly message.
  console.error(`[supabase] ${context}:`, error?.message);
  throw new StoreError(context);
}

/** Strip characters with meaning in PostgREST filter syntax. */
function safeSearch(q: string) {
  return q
    .replace(/[,()*%\\:"']/g, " ")
    .trim()
    .slice(0, 80);
}

export const supabasePublicStore: PublicStore = {
  async createApplication(input, meta) {
    const { data, error } = await serviceClient()
      .from("partner_applications")
      .insert({
        full_name: input.fullName,
        mobile: input.mobile,
        email: input.email,
        city: input.city,
        state: input.state,
        applicant_type: input.applicantType,
        business_status: input.businessStatus,
        sales_experience: input.salesExperience,
        target_customers: input.targetCustomers,
        target_location: input.targetLocation,
        acquisition_methods: input.acquisitionMethods,
        start_timeline: input.startTimeline,
        business_goal: input.businessGoal,
        consent: input.consent,
        ip_hash: meta.ipHash,
        user_agent: meta.userAgent.slice(0, 512),
      })
      .select("application_number")
      .single();
    if (error || !data) fail("create application", error);
    return { applicationNumber: data.application_number as string };
  },

  async abuseSignals(input, ipHash) {
    const db = serviceClient();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [ip, dup] = await Promise.all([
      db.from("partner_applications").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", hourAgo),
      db
        .from("partner_applications")
        .select("id", { count: "exact", head: true })
        .or(`email.eq."${input.email}",mobile.eq."${input.mobile}"`)
        .gte("created_at", dayAgo),
    ]);
    if (ip.error) fail("abuse check (ip)", ip.error);
    if (dup.error) fail("abuse check (duplicate)", dup.error);
    return { recentFromIp: ip.count ?? 0, duplicate: (dup.count ?? 0) > 0 };
  },

  async recordEvent(event) {
    const { error } = await serviceClient().from("analytics_events").insert({
      name: event.name,
      session_id: event.sessionId,
      path: event.path,
      props: event.props,
    });
    if (error) fail("record event", error);
  },
};

export function supabaseAdminStore(db: SupabaseClient, staffId: string): AdminStore {
  return {
    async listApplications(f) {
      const page = Math.max(1, f.page ?? 1);
      let query = db
        .from("partner_applications")
        .select(APPLICATION_COLUMNS, { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      if (f.status) query = query.eq("status", f.status);
      if (f.state) query = query.eq("state", f.state);
      if (f.applicantType) query = query.eq("applicant_type", f.applicantType);
      if (f.assignedTo === "unassigned") query = query.is("assigned_to", null);
      else if (f.assignedTo) query = query.eq("assigned_to", f.assignedTo);
      const q = f.q ? safeSearch(f.q) : "";
      if (q) {
        const like = `%${q}%`;
        query = query.or(
          ["full_name", "email", "mobile", "application_number", "city", "target_location"].map((c) => `${c}.ilike.${like}`).join(","),
        );
      }
      const { data, error, count } = await query;
      if (error) fail("list applications", error);
      return { rows: (data as Row[]).map(toApplication), total: count ?? 0 };
    },

    async statusCounts() {
      const results = await Promise.all(
        STATUSES.map((s) => db.from("partner_applications").select("id", { count: "exact", head: true }).eq("status", s)),
      );
      const out = {} as Record<ApplicationStatus, number>;
      results.forEach((r, i) => {
        if (r.error) fail("status counts", r.error);
        out[STATUSES[i]] = r.count ?? 0;
      });
      return out;
    },

    async distinctStates() {
      const { data, error } = await db.from("partner_applications").select("state").limit(5000);
      if (error) fail("distinct states", error);
      return [...new Set((data as { state: string }[]).map((r) => r.state))].sort();
    },

    async getApplication(id) {
      const { data, error } = await db.from("partner_applications").select(APPLICATION_COLUMNS).eq("id", id).maybeSingle();
      if (error) fail("get application", error);
      return data ? toApplication(data as Row) : null;
    },

    async listActivity(id) {
      const { data, error } = await db
        .from("application_activity")
        .select("id, kind, from_value, to_value, body, created_at, actor:staff_profiles(full_name)")
        .eq("application_id", id)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) fail("list activity", error);
      return (data as Row[]).map((r): ActivityRecord => ({
        id: String(r.id),
        kind: r.kind as ActivityRecord["kind"],
        actorName: (r.actor as { full_name?: string } | null)?.full_name ?? null,
        fromValue: (r.from_value as string) ?? null,
        toValue: (r.to_value as string) ?? null,
        body: (r.body as string) ?? null,
        createdAt: r.created_at as string,
      }));
    },

    async listStaff() {
      const { data, error } = await db.from("staff_profiles").select("id, full_name, email, role").eq("active", true).order("full_name");
      if (error) fail("list staff", error);
      return (data as Row[]).map((r): StaffMember => ({
        id: r.id as string,
        fullName: r.full_name as string,
        email: r.email as string,
        role: r.role as StaffMember["role"],
      }));
    },

    async updateStatus(id, status) {
      const { error } = await db.from("partner_applications").update({ status }).eq("id", id);
      if (error) fail("update status", error);
    },

    async assign(id, assignee) {
      const { error } = await db.from("partner_applications").update({ assigned_to: assignee }).eq("id", id);
      if (error) fail("assign", error);
    },

    async saveInternalNotes(id, notes) {
      const { error } = await db
        .from("partner_applications")
        .update({ internal_notes: notes || null })
        .eq("id", id);
      if (error) fail("save notes", error);
    },

    async addNote(id, body) {
      const { error } = await db.from("application_activity").insert({ application_id: id, actor_id: staffId, kind: "note", body });
      if (error) fail("add note", error);
    },

    async funnel(days) {
      const since = new Date(Date.now() - days * 86_400_000);
      const { data, error } = await db.rpc("partner_funnel", { since: since.toISOString() });
      if (error) fail("funnel", error);
      const r = (data as Row[])[0] ?? {};
      const n = (k: string) => Number(r[k] ?? 0);
      return {
        visitors: n("visitors"),
        applyClicks: n("apply_clicks"),
        applicationsStarted: n("applications_started"),
        applicationsCompleted: n("applications_completed"),
        qualified: n("qualified"),
        partners: n("partners"),
      };
    },
  };
}
