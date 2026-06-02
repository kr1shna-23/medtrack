# AGENTS.md

This file gives future coding agents the context needed to work safely in this repository.

## Project Summary

MedTrack is a frontend-first medication tracker built with React, Vite, Tailwind CSS, and Supabase. The current app supports auth, medication CRUD, profile editing, avatar upload, and reminder channel preferences. Notification delivery through email/WhatsApp is planned, but should be implemented with Supabase Edge Functions + Supabase Cron rather than the old Node polling backend.

## Working Directory

```text
C:\Users\ASUS\Desktop\KR1SHNA\medtrack-main
```

## Active Architecture

- Frontend: React 18, Vite, Tailwind CSS, React Router.
- Backend-as-a-service: Supabase Auth, Postgres, Storage, RLS.
- Database migrations: `supabase/migrations/`.
- Future notification worker: Supabase Edge Function + Supabase Cron.

There is intentionally no active Express/Node backend folder now. Old backend helper files were removed because they were not used by the frontend CRUD app and would conflict with the planned Edge Function direction.

## How To Run

Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Build:

```bash
cd frontend
npm run build
```

Lint:

```bash
cd frontend
npm run lint
```

Current expected result:

- Build passes.
- Lint exits successfully, though warnings may remain in placeholder/older UI areas.

## Environment Files

Do not commit real `.env` files.

Safe template:

- `frontend/.env.example`

Frontend env:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Do not put Supabase service-role/secret keys, SendGrid keys, or Twilio keys in frontend code or frontend env files.

Future Supabase Edge Function secrets should be set in Supabase, for example:

```env
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

## Important Files

- `frontend/src/lib/supabase.js`
  - Browser Supabase client.
  - Reads `VITE_SUPABASE_URL`.
  - Supports `VITE_SUPABASE_PUBLISHABLE_KEY` with fallback to the older `VITE_SUPABASE_ANON_KEY`.
  - Includes stale auth token clearing helper.
- `frontend/src/contexts/SessionContext.jsx`
  - Auth session state.
  - Avoids infinite protected-route loading when Supabase is unreachable or stale tokens exist.
- `frontend/src/components/ProtectedRoute.jsx`
  - Protected route guard.
- `frontend/src/pages/LoginPage.jsx`
  - Email/password login and Google OAuth login.
- `frontend/src/pages/SignupPage.jsx`
  - Email/password signup, email confirmation message, and Google OAuth signup.
- `frontend/src/pages/Medications.jsx`
  - Medication CRUD.
  - Normalizes blank optional values before Supabase writes.
- `frontend/src/pages/Reminders.jsx`
  - Email/WhatsApp reminder channel preferences.
  - Stores both selected channels as separate `reminders` rows.
- `frontend/src/pages/Profile.jsx`
  - Profile data and avatar upload to Supabase Storage.
- `frontend/src/layouts/DashboardLayout.jsx`
  - Protected app shell and sidebar profile/avatar display.
- `supabase/migrations/20260513000000_medtrack_schema.sql`
  - Tables, indexes, triggers, and RLS policies.
- `supabase/migrations/20260513000001_avatar_storage.sql`
  - Private `avatars` bucket and Storage policies.

## Database Notes

Core tables:

- `profiles`
- `medications`
- `reminders`
- `adherence`

All user data tables have RLS enabled. Browser CRUD depends on these policies, so do not disable RLS to make a query work.

`medications.time` is `text[]` because the frontend supports multiple dose times.

`reminders.type` is currently one of:

- `email`
- `whatsapp`

If a user selects both channels, the frontend creates two reminder rows.

## Current Feature State

Working:

- Landing page.
- Email/password signup with Supabase email confirmation.
- Google OAuth login/signup.
- Login/logout.
- Protected routes.
- Medication CRUD.
- Profile update.
- Avatar upload to Supabase Storage.
- Reminder channel preference CRUD.

Partially done:

- Notification delivery.
- Analytics/adherence.

Not confirmed or likely missing:

- Forgot password route.
- Terms/privacy pages.

## Notification Plan

Recommended direction:

1. Add a reminder delivery migration with fields such as `last_sent_at`, `last_error`, `send_attempts`, and `locked_until`.
2. Add a database RPC to claim due reminders safely.
3. Create `supabase/functions/send-reminders/index.ts`.
4. Configure SendGrid and Twilio secrets in Supabase.
5. Use Supabase Cron to invoke the Edge Function every minute.
6. Reschedule successful recurring reminders and record failures.

Do not implement notification sending in the frontend.

## Coding Guidelines

- Keep changes scoped.
- Respect existing React/Tailwind style.
- Use `lucide-react` icons.
- Keep dashboard/tool pages clean and restrained.
- Normalize data before Supabase writes.
- Preserve RLS assumptions.
- Do not expose secrets to frontend.
- Use `apply_patch` for edits when possible.
- Run build/lint after frontend changes.

## Known Warnings

`npm run lint` may report warnings for:

- Unused placeholder variables/imports.
- React hook dependency warnings.
- Fast refresh warning in `SessionContext`.

These warnings are known and not currently blocking.

## Security Notes

- Email confirmation is enabled in Supabase.
- Google OAuth is configured.
- Local redirect URLs use localhost/127.0.0.1.
- Production must update Supabase URL Configuration and Google OAuth authorized origins/redirects.
- Twilio/SendGrid credentials must only live in Supabase Edge Function secrets.

## Do Not Do

- Do not commit `.env` files.
- Do not paste API keys into docs.
- Do not add a new Express server unless the user explicitly reverses the Edge Function decision.
- Do not disable RLS to make frontend CRUD work.
- Do not move service-role keys into frontend.
- Do not revert user changes without explicit request.
