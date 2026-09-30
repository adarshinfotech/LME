import "server-only";

/**
 * Server-side environment. The service-role key is only ever read here and
 * never exposed through NEXT_PUBLIC_* variables.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceKey,
  ipHashSalt: process.env.IP_HASH_SALT ?? "",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY ?? "",
  isProduction: process.env.NODE_ENV === "production",
};

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceKey);

/**
 * Local preview mode: when Supabase is not configured during `next dev`,
 * data is kept in a git-ignored JSON file so every flow can be exercised
 * locally. It can never activate in a production build.
 */
export const localDataMode = !supabaseConfigured && !env.isProduction;
