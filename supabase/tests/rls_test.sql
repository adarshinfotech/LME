-- RLS / privilege checks. Run after stub_supabase.sql + migrations.
\set ON_ERROR_STOP 1
\set QUIET 1

insert into auth.users values
  ('00000000-0000-0000-0000-00000000000a', 'admin@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'sales@example.test'),
  ('00000000-0000-0000-0000-00000000000c', 'outsider@example.test');
insert into public.staff_profiles (id, full_name, email, role) values
  ('00000000-0000-0000-0000-00000000000a', 'Admin User', 'admin@example.test', 'admin'),
  ('00000000-0000-0000-0000-00000000000b', 'Sales User', 'sales@example.test', 'sales');

-- 1. Service role (API route) inserts an application.
set role service_role;
insert into public.partner_applications
  (full_name, mobile, email, city, state, applicant_type, business_status, sales_experience,
   target_customers, target_location, acquisition_methods, start_timeline, business_goal, consent)
values ('Test Applicant', '+919876543210', 'a@example.test', 'Coimbatore', 'Tamil Nadu', 'student', 'planning', 'none',
   array['gyms','retailers'], 'Coimbatore district', array['direct_sales'], 'within_30_days',
   'I want to build a software business in my city.', true);
select 'app number ok' as check_, application_number ~ '^LMI-[A-Z0-9]{6}$' as pass from public.partner_applications;
select 'created activity' as check_, count(*) = 1 as pass from public.application_activity where kind = 'created';
reset role;

-- 2. anon cannot read or insert.
set role anon;
do $$ begin
  perform 1 from public.partner_applications;
  raise exception 'FAIL: anon could select';
exception when insufficient_privilege then raise notice 'pass: anon select denied';
end $$;
do $$ begin
  insert into public.partner_applications (full_name) values ('x');
  raise exception 'FAIL: anon could insert';
exception when insufficient_privilege then raise notice 'pass: anon insert denied';
end $$;
reset role;

-- 3. Authenticated non-staff sees nothing, cannot update.
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000c', false);
select 'outsider sees 0' as check_, count(*) = 0 as pass from public.partner_applications;
select 'outsider funnel empty' as check_, count(*) = 0 as pass from public.partner_funnel(now() - interval '1 day');
update public.partner_applications set status = 'CONTACTED';
select 'outsider update no-op' as check_, (select count(*) from public.partner_applications) = 0 as pass;
do $$ begin
  insert into public.partner_applications (full_name) values ('x');
  raise exception 'FAIL: authenticated could insert';
exception when insufficient_privilege then raise notice 'pass: authenticated insert denied';
end $$;

-- 4. Sales staff: read, update pipeline fields, add own notes.
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select 'staff sees 1' as check_, count(*) = 1 as pass from public.partner_applications;
update public.partner_applications set status = 'CONTACTED', assigned_to = '00000000-0000-0000-0000-00000000000b', internal_notes = 'Called once';
select 'status logged w/ actor' as check_, count(*) = 1 as pass from public.application_activity
  where kind = 'status_changed' and from_value = 'NEW' and to_value = 'CONTACTED' and actor_id = '00000000-0000-0000-0000-00000000000b';
select 'assign logged' as check_, count(*) = 1 as pass from public.application_activity where kind = 'assigned' and to_value = 'Sales User';
select 'notes logged' as check_, count(*) = 1 as pass from public.application_activity where kind = 'notes_updated';
do $$ begin
  update public.partner_applications set full_name = 'Tampered';
  raise exception 'FAIL: staff could edit applicant data';
exception when insufficient_privilege then raise notice 'pass: applicant fields read-only';
end $$;
insert into public.application_activity (application_id, actor_id, kind, body)
  select id, '00000000-0000-0000-0000-00000000000b', 'note', 'Interested in gyms' from public.partner_applications;
select 'note added' as check_, count(*) = 1 as pass from public.application_activity where kind = 'note';
do $$ begin
  insert into public.application_activity (application_id, actor_id, kind, to_value)
    select id, '00000000-0000-0000-0000-00000000000b', 'status_changed', 'PARTNER_JOINED' from public.partner_applications;
  raise exception 'FAIL: staff forged activity';
exception when insufficient_privilege then raise notice 'pass: forged activity rejected';
end $$;
do $$ begin
  insert into public.application_activity (application_id, actor_id, kind, body)
    select id, '00000000-0000-0000-0000-00000000000a', 'note', 'impersonation' from public.partner_applications;
  raise exception 'FAIL: staff impersonated another author';
exception when insufficient_privilege then raise notice 'pass: impersonated note rejected';
end $$;
delete from public.partner_applications;
select 'sales cannot delete' as check_, count(*) = 1 as pass from public.partner_applications;
select 'funnel counts' as check_, applications_completed = 1 as pass from public.partner_funnel(now() - interval '1 day');
do $$ begin
  perform 1 from public.analytics_events;
  raise exception 'FAIL: staff read raw analytics';
exception when insufficient_privilege then raise notice 'pass: raw analytics private';
end $$;
reset role;

-- 5. Constraint checks.
set role service_role;
do $$ begin
  insert into public.partner_applications
    (full_name, mobile, email, city, state, applicant_type, business_status, sales_experience,
     target_customers, target_location, acquisition_methods, start_timeline, business_goal, consent)
  values ('X Y', '12', 'bad', 'C', 'S', 'alien', 'yes', 'none', array['moon'], 'L', array['x'], 'now', 'short', false);
  raise exception 'FAIL: invalid row accepted';
exception when check_violation then raise notice 'pass: invalid row rejected';
end $$;
reset role;
