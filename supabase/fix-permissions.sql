-- Run this ONCE in Supabase SQL Editor to repair an already-created project.
-- It lets the public form insert registrations, but does not grant public reads.
grant usage on schema public to anon, authenticated;
grant insert on table public.registrations to anon, authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "Public can submit registrations" on public.registrations;
create policy "Public can submit registrations" on public.registrations
  as permissive for insert to anon, authenticated
  with check (true);

drop policy if exists "Administrators can inspect their own grant" on public.admin_users;
create policy "Administrators can inspect their own grant" on public.admin_users
  for select to authenticated using ((select auth.uid()) = user_id);
