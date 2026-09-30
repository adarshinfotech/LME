import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localDataMode, supabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";
import { findLocalStaff, getLocalStaff, localAdminStore } from "@/lib/data/local-store";
import { supabaseAdminStore } from "@/lib/data/supabase-store";
import type { AdminStore } from "@/lib/data/types";
import type { StaffMember } from "@/lib/applications/types";

export const LOCAL_SESSION_COOKIE = "lmi_local_session";

type Session = { signedIn: boolean; staff: StaffMember | null; store: AdminStore | null };

// ---------------------------------------------------------------------------
// Local preview sessions (development only). Signed with a per-process secret.
// ---------------------------------------------------------------------------
const g = globalThis as unknown as { __lmiLocalSecret?: Buffer };
const localSecret = () => (g.__lmiLocalSecret ??= randomBytes(32));
const sign = (v: string) => `${v}.${createHmac("sha256", localSecret()).update(v).digest("base64url")}`;
function verify(token: string | undefined) {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  const value = token.slice(0, i);
  const a = Buffer.from(token);
  const b = Buffer.from(sign(value));
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

// ---------------------------------------------------------------------------

export async function getSession(): Promise<Session> {
  if (supabaseConfigured) {
    const db = await createSessionClient();
    const { data } = await db.auth.getUser();
    if (!data.user) return { signedIn: false, staff: null, store: null };
    // RLS returns the profile only for active staff.
    const { data: profile } = await db
      .from("staff_profiles")
      .select("id, full_name, email, role")
      .eq("id", data.user.id)
      .eq("active", true)
      .maybeSingle();
    if (!profile) return { signedIn: true, staff: null, store: null };
    const staff: StaffMember = { id: profile.id, fullName: profile.full_name, email: profile.email, role: profile.role };
    return { signedIn: true, staff, store: supabaseAdminStore(db, staff.id) };
  }

  if (localDataMode) {
    const id = verify((await cookies()).get(LOCAL_SESSION_COOKIE)?.value);
    const staff = id ? await getLocalStaff(id) : null;
    return { signedIn: Boolean(staff), staff, store: staff ? localAdminStore(staff.id) : null };
  }

  return { signedIn: false, staff: null, store: null };
}

/**
 * For admin pages: redirects anonymous visitors to the login page and
 * returns null when a signed-in account is not LMI staff.
 */
export async function requireStaff() {
  const session = await getSession();
  if (!session.signedIn) redirect("/admin/login");
  if (!session.staff || !session.store) return null;
  return { staff: session.staff, store: session.store };
}

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const invalid: SignInResult = { ok: false, error: "The email or password is incorrect." };

  if (supabaseConfigured) {
    const db = await createSessionClient();
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error || !data.user) return invalid;
    const { data: profile } = await db.from("staff_profiles").select("id").eq("id", data.user.id).eq("active", true).maybeSingle();
    if (!profile) {
      await db.auth.signOut();
      return { ok: false, error: "This account does not have access to the LMI admin." };
    }
    return { ok: true };
  }

  if (localDataMode) {
    const staff = await findLocalStaff(email);
    const ok =
      staff &&
      Buffer.byteLength(staff.password) === Buffer.byteLength(password) &&
      timingSafeEqual(Buffer.from(staff.password), Buffer.from(password));
    if (!ok) return invalid;
    (await cookies()).set(LOCAL_SESSION_COOKIE, sign(staff.id), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    return { ok: true };
  }

  return { ok: false, error: "Admin sign-in is not configured yet." };
}

export async function signOut() {
  if (supabaseConfigured) {
    const db = await createSessionClient();
    await db.auth.signOut();
  }
  (await cookies()).delete(LOCAL_SESSION_COOKIE);
}
