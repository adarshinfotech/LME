import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let client: SupabaseClient | null = null;

/**
 * Service-role client for trusted server work only (public application
 * inserts after validation, analytics writes). Bypasses RLS — never import
 * this from client code or use it for admin reads.
 */
export function serviceClient() {
  client ??= createClient(env.supabaseUrl!, env.supabaseServiceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
