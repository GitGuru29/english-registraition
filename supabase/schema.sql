-- Run this in the Supabase SQL Editor. It creates a private table while allowing
-- only public registration inserts. Create the admin user in Authentication > Users.
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(student_name) between 2 and 100),
  whatsapp_number text not null check (whatsapp_number ~ '^\+94[0-9]{9}$'),
  created_at timestamptz not null default now()
);

create unique index if not exists registrations_whatsapp_unique on public.registrations (whatsapp_number);
alter table public.registrations enable row level security;

-- This allow-list makes an authenticated account an administrator. It has no public
-- access policies, so it is not readable or writable through the browser app.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;

-- Raw SQL-created tables also need explicit grants. The public client gets only
-- INSERT on registrations; it never receives read, update, or delete access.
grant usage on schema public to anon, authenticated;
grant insert on table public.registrations to anon, authenticated;
grant select on table public.admin_users to authenticated;

-- Public visitors can submit only. They cannot read, edit, or delete any records.
create policy "Public can submit registrations" on public.registrations
  for insert to anon, authenticated with check (true);

create policy "Administrators can inspect their own grant" on public.admin_users
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Administrators can read registrations" on public.registrations
  for select to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );
create policy "Administrators can delete registrations" on public.registrations
  for delete to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );
