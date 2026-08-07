# Grade 6 English Class Registration

A mobile-first React registration page for parents, backed by Supabase. The public page collects only the student's name and the parent/guardian WhatsApp number. The separate dashboard lives at `/admin`.

## Setup

1. Create a new project at [Supabase](https://supabase.com/dashboard). In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
2. In **Authentication → Providers**, keep Email enabled. In **Authentication → Users**, create the teacher's administrator user with an email and strong password. Copy that user's UUID, then run this in SQL Editor (replacing the value): `insert into public.admin_users (user_id) values ('THE-TEACHER-USER-UUID');`. Do not share the credentials.
3. Copy `.env.example` to `.env`, then enter the Project URL and the **anon public** key from **Project Settings → API**. Never place a service-role key in this app.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open the displayed local URL. Visit `/admin` only for the teacher dashboard.

## Edit public text

All customer-facing English strings are centralized in [`src/lib/copy.ts`](./src/lib/copy.ts), including the clearly marked class-information placeholder. Update that file for Sinhala or final class details.

## Deployment

For Vercel: import this repository, use the default Vite settings, and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables. Deploy. For Cloudflare Pages, use build command `npm run build` and output directory `dist`, with the same variables.

## Security notes

- Row Level Security is enabled and the public role receives only `INSERT` access.
- The database has a unique WhatsApp-number index to prevent accidental duplicate registrations. The application converts `0712345678` to `+94712345678` before saving.
- The supplied policy checks the private `admin_users` allow-list, so being authenticated alone does not expose registrations.
