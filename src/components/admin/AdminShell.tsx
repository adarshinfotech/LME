import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";
import { LmiMark } from "@/components/brand/Logo";
import type { StaffMember } from "@/lib/applications/types";

export function AdminShell({ staff, children }: { staff: StaffMember; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line-dark bg-ink text-sand">
        <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3" aria-label="Applications dashboard">
              <LmiMark className="h-5 w-auto" title="" />
              <span className="eyebrow hidden text-[0.62rem] text-stone sm:inline">Partner CRM</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-stone sm:inline">
              {staff.fullName} <span className="text-stone/70">· {staff.role === "admin" ? "Admin" : "Sales"}</span>
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="h-9 border border-sand/30 px-3 text-xs uppercase tracking-[0.14em] transition-colors hover:border-sand hover:bg-sand hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[96rem] px-4 pb-24 pt-8 sm:px-8 sm:pt-12">
        {children}
      </main>
    </div>
  );
}

export function AccessDenied() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="max-w-md text-center">
        <LmiMark className="mx-auto h-8 w-auto" />
        <h1 className="mt-10 font-display text-display-sm">Access restricted</h1>
        <p className="mt-4 leading-relaxed text-muted">
          You&rsquo;re signed in, but this account isn&rsquo;t on the LMI team list. Ask an administrator to grant access.
        </p>
        <form action={signOutAction} className="mt-8">
          <button type="submit" className="h-12 bg-ink px-6 text-xs uppercase tracking-[0.16em] text-sand">
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
