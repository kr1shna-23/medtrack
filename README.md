# MedTrack

MedTrack is a React + Supabase medication tracker. Users can sign up, confirm their email, sign in with Google, manage medications, configure reminder channels, and update profile details including avatar upload.

## Current Architecture

- Frontend: React, Vite, Tailwind CSS, React Router, Lucide React.
- Backend services: Supabase Auth, Postgres, Row Level Security, and Storage.
- Database source of truth: `supabase/migrations/`.
- Notification delivery target: Supabase Edge Functions + Supabase Cron.

There is no active Express/Node backend in this repository. The old polling/server prototype was removed because reminders are planned to run through Supabase Edge Functions.

## Features

- Public landing page.
- Email/password signup with Supabase email confirmation.
- Google OAuth login/signup.
- Protected app routes.
- Medication CRUD with multiple dose times.
- Reminder channel preferences for SMS, WhatsApp, both, or neither.
- Profile update and private avatar storage.

## Setup

Frontend environment:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Run the app:

```bash
cd frontend
npm install
npm run dev
```

Verify:

```bash
cd frontend
npm run build
npm run lint
```

## Supabase

Apply the SQL files in `supabase/migrations/` to a new Supabase project:

- `20260513000000_medtrack_schema.sql`
- `20260513000001_avatar_storage.sql`

These create the app tables, RLS policies, profile creation trigger, and private avatar bucket policies.

## Notifications

SMS and WhatsApp delivery is implemented through Supabase Edge Functions and Supabase Cron:

- Supabase Edge Function named `send-reminders`.
- Supabase Cron invoking that function every minute.
- Twilio SMS for SMS reminders.
- Twilio WhatsApp Sandbox or approved sender for WhatsApp reminders.
- Secrets stored in Supabase Edge Function secrets, never in frontend code.

Required Edge Function secrets:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_SMS_FROM_NUMBER=
TWILIO_WHATSAPP_NUMBER=
```

Twilio trial/sandbox delivery may be limited to verified recipients. For demos, keep the cron enabled only while testing or recording. To pause automated sending:

```sql
select cron.unschedule('send-medtrack-reminders-every-minute');
```
