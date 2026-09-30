# LMI — Let's Make It

Website and partner-acquisition platform for the **LMI Technology Partner Program**, powered by Adarsh Infotech.

- **Public site** — `/`, `/solutions`, `/partner`, `/how-it-works`, `/apply`, `/success`, `/privacy`, `/terms`
- **Partner application** — 5-step form, server-validated, stored in Supabase with an `LMI-XXXXXX` application ID
- **Admin CRM** — `/admin/login`, `/admin` (metrics, pipeline, funnel, search/filters), `/admin/applications/[id]` (status, assignment, internal notes, activity timeline)

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS 4 · Motion · Supabase (Postgres, Auth, RLS) · Zod · Vitest.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

With no Supabase variables set, `npm run dev` runs in **local preview mode**: applications, notes and analytics are stored in the
git-ignored `.data/local-store.json`, and you can sign in to `/admin` as `admin@lmi.local` / `sales@lmi.local` with
`LOCAL_ADMIN_PASSWORD` (default `lmi-local-admin`). Preview mode can never activate in a production build — without Supabase,
production shows a friendly "temporarily unavailable" message on the form and admin.

## Connecting Supabase

1. Create a Supabase project.
2. Apply the migration in `supabase/migrations/` (SQL editor, or `supabase db push` with the Supabase CLI).
3. Copy `.env.example` to `.env.local` (or your host's env settings) and fill in the URL, publishable key, secret key and `IP_HASH_SALT`.
4. Create each team member in **Authentication → Users**, then grant access with `supabase/seed_staff.example.sql`.
   Roles: `admin` (can also delete applications) and `sales`.

## Security model

- Public submissions go through `POST /api/applications` only: same-origin check, in-memory + database rate limits
  (per hashed IP), duplicate detection (same email/mobile within 24h), honeypot field, minimum fill time, optional
  Cloudflare Turnstile, and full Zod validation. Inserts use the service-role key, which only exists server-side.
- `anon` and `authenticated` roles cannot insert applications or read anything directly.
- Only active rows in `staff_profiles` can read applications (RLS). Staff can update **only** `status`, `assigned_to` and
  `internal_notes` (column-level grants); every change is written to `application_activity` by a trigger, and notes can
  only be added under the author's own identity.
- Admin pages re-verify the session on every request; the `proxy.ts` gate refreshes Supabase sessions and redirects signed-out visitors.
- Strict security headers and a CSP without `unsafe-eval` (see `next.config.ts`).

## Content rules (enforced in code review)

No product prices, no renewal amount, no WhatsApp, no testimonials/reviews/logos/statistics, no guaranteed earnings.
The public partner fee is configured in `src/lib/site.ts`; an optional crossed-out list price is off unless
`NEXT_PUBLIC_PARTNER_LIST_PRICE` is set. Revenue figures come from `src/lib/revenue.ts` and are always labelled illustrative.

## Analytics

First-party events (`page_view`, `hero_apply_click`, `apply_click`, `solutions_view`, `revenue_section_view`,
`apply_page_view`, `application_started`, `application_completed`, `application_abandoned`) are pushed to
`window.dataLayer` and stored via `/api/track`. The admin dashboard shows the 30-day funnel
(visitors → apply clicks → started → completed → qualified → partners). Do Not Track is respected.

## Scripts

| Command             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Development server                                      |
| `npm run build`     | Production build                                        |
| `npm run lint`      | ESLint                                                  |
| `npm run typecheck` | TypeScript                                              |
| `npm test`          | Unit tests (schema, revenue model, rate limiter)        |
| `npm run test:db`   | Migration + RLS tests against a local Postgres (`PGHOST`, `PGPORT`, `PGUSER`) |

## Project structure

```
src/app/(site)/        public pages          src/components/sections/  page sections
src/app/admin/         admin CRM + actions   src/components/apply/     application form
src/app/api/           applications, track   src/components/admin/     CRM components
src/content/           products, benefits…   src/lib/                  data, auth, security, analytics
supabase/migrations/   schema + RLS          supabase/tests/           database tests
```

## Before launch

- Have the Privacy and Terms pages reviewed by your legal adviser (the source document also recommends a lawyer/CA
  review of the partner agreement and GST treatment).
- Set `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` if you want them shown in the footer.
- Consider enabling Turnstile once traffic from Instagram campaigns starts.
