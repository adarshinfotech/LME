-- Grant a Supabase Auth user access to the LMI admin.
-- 1. Create the user: Supabase Dashboard → Authentication → Users → Add user
--    (email + password, "Auto confirm user" on).
-- 2. Run this in the SQL editor with their email, name and role ('admin' or 'sales').

insert into public.staff_profiles (id, full_name, email, role)
select id, 'Full Name', email, 'admin'
from auth.users
where email = 'person@example.com'
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role, active = true;

-- To revoke access later:
-- update public.staff_profiles set active = false where email = 'person@example.com';
