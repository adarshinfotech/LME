import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LmiMark } from "@/components/brand/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";
import { localDataMode, supabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getSession();
  if (session.staff) redirect("/admin");

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-sand lg:flex">
        <LmiMark className="h-8 w-auto self-start" />
        <div>
          <p className="eyebrow text-stone">Partner CRM</p>
          <p className="mt-6 max-w-md font-display text-display-md font-light">Every application, one pipeline.</p>
        </div>
        <p className="text-xs text-stone">Authorised LMI team members only.</p>
      </div>
      <div className="flex flex-col justify-center px-5 py-16 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" aria-label="LMI home" className="lg:hidden">
            <LmiMark className="h-7 w-auto" />
          </Link>
          <h1 className="mt-10 font-display text-display-sm lg:mt-0">Sign in</h1>
          <p className="mt-3 text-muted">Access the LMI partner application pipeline.</p>
          <div className="mt-12">
            {supabaseConfigured || localDataMode ? (
              <LoginForm />
            ) : (
              <p role="alert" className="border border-line p-5 text-sm leading-relaxed text-muted">
                Admin sign-in isn&rsquo;t configured yet. Add the Supabase environment variables described in the README.
              </p>
            )}
            {session.signedIn && !session.staff ? (
              <p className="mt-6 text-sm text-danger">This account does not have access to the LMI admin.</p>
            ) : null}
            {localDataMode ? (
              <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-muted">
                Local preview mode — Supabase is not configured, so data is stored in <code>.data/local-store.json</code>. Sign in with{" "}
                <code>admin@lmi.local</code> and the <code>LOCAL_ADMIN_PASSWORD</code> (default <code>lmi-local-admin</code>).
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
