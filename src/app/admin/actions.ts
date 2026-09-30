"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession, signIn, signOut } from "@/lib/auth";
import { STATUSES } from "@/lib/applications/status";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp, hashIp } from "@/lib/security/request";

export type ActionResult = { ok: boolean; message: string } | null;

const SESSION_EXPIRED: ActionResult = { ok: false, message: "Your session has expired. Please sign in again." };
const FAILED: ActionResult = { ok: false, message: "Something went wrong. Please try again." };

const id = z.string().min(1).max(64);

async function withStore<T extends z.ZodType>(
  schema: T,
  formData: FormData,
  run: (input: z.infer<T>, store: NonNullable<Awaited<ReturnType<typeof getSession>>["store"]>) => Promise<string>,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session.store) return SESSION_EXPIRED;
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please check your input and try again." };
  try {
    const message = await run(parsed.data, session.store);
    revalidatePath("/admin", "layout");
    return { ok: true, message };
  } catch (e) {
    console.error("[admin action]", e);
    return FAILED;
  }
}

export async function updateStatusAction(_: ActionResult, formData: FormData) {
  return withStore(z.object({ id, status: z.enum(STATUSES) }), formData, async ({ id, status }, store) => {
    await store.updateStatus(id, status);
    return "Status updated.";
  });
}

export async function assignAction(_: ActionResult, formData: FormData) {
  return withStore(z.object({ id, assignee: z.string().max(64) }), formData, async ({ id, assignee }, store) => {
    const staff = await store.listStaff();
    if (assignee && !staff.some((s) => s.id === assignee)) throw new Error("Unknown staff member");
    await store.assign(id, assignee || null);
    return assignee ? "Application assigned." : "Assignment cleared.";
  });
}

export async function saveNotesAction(_: ActionResult, formData: FormData) {
  return withStore(z.object({ id, notes: z.string().max(10000) }), formData, async ({ id, notes }, store) => {
    await store.saveInternalNotes(id, notes.trim());
    return "Internal notes saved.";
  });
}

export async function addNoteAction(_: ActionResult, formData: FormData) {
  return withStore(z.object({ id, body: z.string().trim().min(1).max(4000) }), formData, async ({ id, body }, store) => {
    await store.addNote(id, body);
    return "Note added to the timeline.";
  });
}

export async function signInAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const ip = hashIp(clientIp(await headers()));
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000).ok) {
    return { ok: false, message: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }
  const parsed = z.object({ email: z.email().max(254), password: z.string().min(1).max(200) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please enter your email and password." };

  const result = await signIn(parsed.data.email.trim().toLowerCase(), parsed.data.password);
  if (!result.ok) return { ok: false, message: result.error };
  redirect("/admin");
}

export async function signOutAction() {
  await signOut();
  redirect("/admin/login");
}
