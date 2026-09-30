-- =====================================================================
-- LMI partner platform: applications, staff, activity log, analytics.
--
-- Security model
--   * anon/authenticated users can NEVER insert applications directly.
--     Public submissions go through the Next.js API route, which validates,
--     rate-limits and inserts with the service role (server-side only).
--   * Only active staff (public.staff_profiles) can read applications.
--   * Staff may update only status, assigned_to and internal_notes
--     (column-level grants), and every change is written to the activity
--     log by trigger.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------
create type public.application_status as enum (
  'NEW',
  'CONTACTED',
  'CALL_SCHEDULED',
  'QUALIFIED',
  'DEMO',
  'PROPOSAL',
  'PARTNER_JOINED',
  'ONBOARDING',
  'REJECTED'
);

create type public.staff_role as enum ('admin', 'sales');

-- ---------------------------------------------------------------------
-- Staff
-- ---------------------------------------------------------------------
create table public.staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null,
  role public.staff_role not null default 'sales',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.staff_profiles is
  'LMI team members allowed into /admin. Add rows after creating the user in Supabase Auth.';

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff_profiles
    where id = (select auth.uid()) and active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff_profiles
    where id = (select auth.uid()) and active and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------
create or replace function public.generate_application_number()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  -- No 0/O/1/I to keep IDs easy to read over the phone.
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  candidate text;
begin
  loop
    candidate := 'LMI-';
    for i in 1..6 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.partner_applications where application_number = candidate
    );
  end loop;
  return candidate;
end;
$$;

create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default public.generate_application_number()
    check (application_number ~ '^LMI-[A-Z0-9]{6}$'),

  full_name text not null check (char_length(full_name) between 2 and 120),
  mobile text not null check (mobile ~ '^\+?[0-9]{10,15}$'),
  email text not null check (char_length(email) between 3 and 254 and position('@' in email) > 1),
  city text not null check (char_length(city) between 2 and 80),
  state text not null check (char_length(state) between 2 and 80),

  applicant_type text not null check (applicant_type in (
    'student', 'business_owner', 'consultant', 'sales_professional', 'it_professional', 'founder', 'other'
  )),
  business_status text not null check (business_status in ('yes', 'no', 'planning')),
  sales_experience text not null check (sales_experience in ('lt_1', '1_3', '3_plus', 'none')),

  target_customers text[] not null check (
    cardinality(target_customers) between 1 and 9
    and target_customers <@ array[
      'small_businesses', 'retailers', 'manufacturers', 'workshops', 'gyms',
      'hostels', 'construction', 'institutions', 'other'
    ]::text[]
  ),
  target_location text not null check (char_length(target_location) between 2 and 160),

  acquisition_methods text[] not null check (
    cardinality(acquisition_methods) between 1 and 7
    and acquisition_methods <@ array[
      'direct_sales', 'existing_network', 'digital_marketing', 'referrals',
      'social_media', 'sales_team', 'other'
    ]::text[]
  ),
  start_timeline text not null check (start_timeline in ('immediately', 'within_30_days', '1_3_months', 'exploring')),

  business_goal text not null check (char_length(business_goal) between 20 and 3000),
  consent boolean not null check (consent),

  status public.application_status not null default 'NEW',
  assigned_to uuid references public.staff_profiles (id) on delete set null,
  internal_notes text check (char_length(internal_notes) <= 10000),

  -- Abuse prevention only; never the raw IP.
  ip_hash text,
  user_agent text check (char_length(user_agent) <= 512),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partner_applications_created_at_idx on public.partner_applications (created_at desc);
create index partner_applications_status_idx on public.partner_applications (status);
create index partner_applications_state_idx on public.partner_applications (state);
create index partner_applications_type_idx on public.partner_applications (applicant_type);
create index partner_applications_assigned_idx on public.partner_applications (assigned_to);
create index partner_applications_ip_idx on public.partner_applications (ip_hash, created_at desc);
create index partner_applications_email_idx on public.partner_applications (lower(email), created_at desc);
create index partner_applications_mobile_idx on public.partner_applications (mobile, created_at desc);

-- ---------------------------------------------------------------------
-- Activity log
-- ---------------------------------------------------------------------
create table public.application_activity (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.partner_applications (id) on delete cascade,
  actor_id uuid references public.staff_profiles (id) on delete set null,
  kind text not null check (kind in ('created', 'status_changed', 'assigned', 'note', 'notes_updated')),
  from_value text,
  to_value text,
  body text check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

create index application_activity_app_idx on public.application_activity (application_id, created_at desc);

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger partner_applications_touch
  before update on public.partner_applications
  for each row execute function public.touch_updated_at();

create or replace function public.log_application_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  assignee_name text;
begin
  -- Only attribute to real staff; service-role writes have no actor.
  if actor is not null and not exists (select 1 from public.staff_profiles where id = actor) then
    actor := null;
  end if;

  if tg_op = 'INSERT' then
    insert into public.application_activity (application_id, kind, to_value)
    values (new.id, 'created', new.status::text);
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.application_activity (application_id, actor_id, kind, from_value, to_value)
    values (new.id, actor, 'status_changed', old.status::text, new.status::text);
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    select full_name into assignee_name from public.staff_profiles where id = new.assigned_to;
    insert into public.application_activity (application_id, actor_id, kind, to_value)
    values (new.id, actor, 'assigned', coalesce(assignee_name, 'Unassigned'));
  end if;

  if new.internal_notes is distinct from old.internal_notes then
    insert into public.application_activity (application_id, actor_id, kind)
    values (new.id, actor, 'notes_updated');
  end if;

  return new;
end;
$$;

create trigger partner_applications_activity
  after insert or update on public.partner_applications
  for each row execute function public.log_application_activity();

-- ---------------------------------------------------------------------
-- Analytics (first-party, anonymous)
-- ---------------------------------------------------------------------
create table public.analytics_events (
  id bigint generated always as identity primary key,
  name text not null check (name in (
    'page_view', 'hero_apply_click', 'apply_click', 'solutions_view', 'revenue_section_view',
    'apply_page_view', 'application_started', 'application_completed', 'application_abandoned'
  )),
  session_id text not null check (char_length(session_id) <= 64),
  path text check (char_length(path) <= 256),
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 2048),
  created_at timestamptz not null default now()
);

create index analytics_events_name_created_idx on public.analytics_events (name, created_at desc);

create or replace function public.partner_funnel(since timestamptz)
returns table (
  visitors bigint,
  apply_clicks bigint,
  applications_started bigint,
  applications_completed bigint,
  qualified bigint,
  partners bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(distinct session_id) from public.analytics_events
       where created_at >= since and name = 'page_view'),
    (select count(distinct session_id) from public.analytics_events
       where created_at >= since and name in ('hero_apply_click', 'apply_click', 'apply_page_view')),
    (select count(distinct session_id) from public.analytics_events
       where created_at >= since and name = 'application_started'),
    (select count(*) from public.partner_applications where created_at >= since),
    (select count(*) from public.partner_applications
       where created_at >= since
         and status in ('QUALIFIED', 'DEMO', 'PROPOSAL', 'PARTNER_JOINED', 'ONBOARDING')),
    (select count(*) from public.partner_applications
       where created_at >= since and status in ('PARTNER_JOINED', 'ONBOARDING'))
  where public.is_staff();
$$;

-- ---------------------------------------------------------------------
-- Row Level Security & privileges
-- ---------------------------------------------------------------------
alter table public.staff_profiles enable row level security;
alter table public.partner_applications enable row level security;
alter table public.application_activity enable row level security;
alter table public.analytics_events enable row level security;

-- Start from nothing for public roles, then grant precisely.
revoke all on public.staff_profiles, public.partner_applications,
  public.application_activity, public.analytics_events from anon, authenticated;

revoke execute on function public.partner_funnel(timestamptz) from public, anon;
revoke execute on function public.generate_application_number() from public, anon, authenticated;
grant execute on function public.generate_application_number() to service_role;
grant execute on function public.partner_funnel(timestamptz) to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- staff_profiles: staff can see the team (for assignment). Managed by admins via SQL/service role.
grant select on public.staff_profiles to authenticated;
create policy "Staff can view team"
  on public.staff_profiles for select to authenticated
  using ((select public.is_staff()));

-- partner_applications: staff read; staff update pipeline fields only.
grant select on public.partner_applications to authenticated;
grant update (status, assigned_to, internal_notes) on public.partner_applications to authenticated;
grant delete on public.partner_applications to authenticated;

create policy "Staff can view applications"
  on public.partner_applications for select to authenticated
  using ((select public.is_staff()));

create policy "Staff can update pipeline fields"
  on public.partner_applications for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "Admins can delete applications"
  on public.partner_applications for delete to authenticated
  using ((select public.is_admin()));

-- application_activity: staff read; staff may add their own notes only.
grant select, insert on public.application_activity to authenticated;

create policy "Staff can view activity"
  on public.application_activity for select to authenticated
  using ((select public.is_staff()));

create policy "Staff can add notes"
  on public.application_activity for insert to authenticated
  with check (
    (select public.is_staff())
    and kind = 'note'
    and actor_id = (select auth.uid())
  );

-- analytics_events: written by the server (service role) only; read via partner_funnel().
