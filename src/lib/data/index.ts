import "server-only";
import { localDataMode, supabaseConfigured } from "@/lib/env";
import { localPublicStore } from "./local-store";
import { supabasePublicStore } from "./supabase-store";
import type { PublicStore } from "./types";

/** Store for trusted public writes, or null when no backend is configured. */
export function getPublicStore(): PublicStore | null {
  if (supabaseConfigured) return supabasePublicStore;
  if (localDataMode) return localPublicStore;
  return null;
}
