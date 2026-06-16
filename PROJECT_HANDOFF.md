# MedTrack Project Handoff

Last updated: 2026-06-17

## Project Goal

MedTrack is a medication management and reminder application. The immediate goal is to let users securely sign up, manage medication records, configure reminder channels, and maintain profile details using Supabase. The next major goal is server-side delivery of reminder notifications through SMS and WhatsApp.

The app is currently focused on patient-facing CRUD, reminder preference management, and demo-ready SMS/WhatsApp notification delivery.

## Current Architecture

### Frontend

- React 18 app built with Vite.
- Styling is Tailwind CSS.
- Routing uses `react-router-dom`.
- Icons use `lucide-react`.
- Supabase JS is used directly from the browser for auth, table CRUD, and profile avatar storage.
- The app has unauthenticated public pages and authenticated dashboard pages.

### Supabase

Supabase provides:

- Auth.
- Google OAuth provider.
- Postgres database.
- Row Level Security policies.
- Private Storage bucket for avatars.

Database source-of-truth files now live in:

- `supabase/migrations/20260513000000_medtrack_schema.sql`
- `supabase/migrations/20260513000001_avatar_storage.sql`
- `supabase/migrations/20260612000000_sms_whatsapp_notifications.sql`

### Removed Backend Prototype

The old `backend` Node prototype was removed. It contained unused helper code for auth/database CRUD, SendGrid, Twilio, and a polling scheduler. That code was not needed for the current app because:

- Frontend CRUD already talks directly to Supabase.
- RLS is the security boundary for browser CRUD.
- Notification delivery is planned for Supabase Edge Functions + Supabase Cron.
- Keeping an unused Node poller would confuse future work and duplicate the planned Edge Function responsibility.

## Data Model

Core tables:

- `profiles`
  - `id uuid` linked to `auth.users(id)` with cascade delete.
  - `full_name`, `phone_number`, `avatar_url`.
  - Created automatically by an auth trigger.
- `medications`
  - User-owned medication records.
  - `time text[]` supports one or more daily dose times.
  - Optional refill date/reminder/note fields.
  - Medication delete cascades to reminder/adherence rows.
- `reminders`
  - User-owned reminder preference rows.
  - Separate rows represent separate channels.
  - If a medication uses both SMS and WhatsApp, it has an `sms` row and a `whatsapp` row.
  - Delivery fields include `last_sent_at`, `last_error`, `send_attempts`, and `locked_until`.
- `adherence`
  - Prepared for future medication-taking history.
  - Current frontend analytics mostly uses placeholder/mock data.

RLS is enabled on all public app tables. Policies restrict users to their own rows.

## Auth Flow

Current auth methods:

- Email/password with email confirmation enabled in Supabase.
- Google OAuth configured in Google Cloud and Supabase.

Important local redirect behavior:

- Local confirmation/OAuth redirects use `http://127.0.0.1:5173` or `http://localhost:5173`.
- Confirmation links opened on a phone will not load the localhost app after verification. This is normal for local development. Production must set Site URL and redirect URLs to the deployed frontend domain.

## Important Files And Directories

### Root

- `README.md`
  - Current project setup summary.
- `AGENTS.md`
  - Instructions for future coding agents.
- `PROJECT_HANDOFF.md`
  - This handoff.
- `project-history.md`
  - Chronological recovery/build history.
- `.gitignore`
  - Ignores `.env`, `node_modules`, `dist`, logs, and editor files.

### Supabase

- `supabase/migrations/20260513000000_medtrack_schema.sql`
  - Creates tables, indexes, update triggers, profile creation trigger, and RLS policies.
- `supabase/migrations/20260513000001_avatar_storage.sql`
  - Creates/updates private `avatars` bucket and Storage policies.
- `supabase/migrations/20260612000000_sms_whatsapp_notifications.sql`
  - Switches reminder channel type from email to SMS.
  - Adds delivery tracking and locking fields.
  - Adds `claim_due_reminders()` for the Edge Function.
- `supabase/functions/send-reminders/index.ts`
  - Claims due reminders.
  - Sends SMS/WhatsApp through Twilio.
  - Reschedules processed reminders to their next daily occurrence.
  - Records last success/error metadata.

### Frontend

- `frontend/package.json`
  - Vite scripts: `dev`, `build`, `lint`, `preview`.
- `frontend/.env`
  - Local ignored file containing Supabase frontend URL/publishable key.
- `frontend/.env.example`
  - Safe frontend env template.
- `frontend/src/lib/supabase.js`
  - Browser Supabase client.
  - Supports `VITE_SUPABASE_PUBLISHABLE_KEY` with fallback to legacy `VITE_SUPABASE_ANON_KEY`.
  - Provides `clearSupabaseAuthStorage()` to clear stale Supabase tokens.
- `frontend/src/contexts/SessionContext.jsx`
  - Tracks Supabase auth session.
  - Includes timeout handling to avoid infinite loading when Supabase is unreachable or stale tokens exist.
- `frontend/src/components/ProtectedRoute.jsx`
  - Blocks protected routes when no session exists.
- `frontend/src/App.jsx`
  - Route definitions.
- `frontend/src/layouts/DashboardLayout.jsx`
  - Sidebar and protected app shell.
  - Reads profile data from `profiles`.
  - Downloads avatar from the private `avatars` bucket.
- `frontend/src/pages/LandingPage.jsx`
  - Public landing page.
- `frontend/src/pages/LoginPage.jsx`
  - Email/password login and Google OAuth login.
- `frontend/src/pages/SignupPage.jsx`
  - Email/password signup, email confirmation state, and Google OAuth signup.
- `frontend/src/pages/Dashboard.jsx`
  - Protected dashboard.
  - Reads medications and upcoming reminders.
- `frontend/src/pages/Medications.jsx`
  - Medication CRUD page.
  - Sanitizes optional fields before Supabase writes.
  - Converts blank `refill_date` to `null`.
  - Stores medication times as `text[]`.
- `frontend/src/pages/Reminders.jsx`
  - Reminder channel preference UI.
  - SMS and WhatsApp are independent channel buttons.
  - Supports SMS-only, WhatsApp-only, both, or neither.
  - Shows a phone-number prompt if SMS/WhatsApp is enabled and `profiles.phone_number` is blank.
- `frontend/src/pages/Profile.jsx`
  - Profile editing.
  - Uploads avatars to Supabase Storage under `avatars/{userId}/...`.
  - Validates phone numbers in E.164 format for SMS/WhatsApp delivery.

## Libraries And Frameworks

Frontend:

- React.
- Vite.
- Tailwind CSS.
- React Router.
- Lucide React.
- Framer Motion.
- Supabase JS client.

Supabase:

- Auth.
- Google OAuth provider.
- Postgres.
- Row Level Security.
- Storage.
- Planned Edge Functions + Cron.

## Features Completed

### Supabase Rebuild

- New Supabase project was created.
- Schema was rebuilt for `profiles`, `medications`, `reminders`, and `adherence`.
- RLS policies were added for all app tables.
- Profile creation trigger was added.
- Private `avatars` Storage setup was added.
- Migration files were moved to root `supabase/migrations/` as the current source of truth.

### Auth

- Email/password signup and login are working.
- Confirm email is enabled in Supabase.
- Signup page handles confirmation-required state by showing a check-email message.
- Google OAuth provider is configured in Google Cloud and Supabase.
- Login page has `Continue with Google`.
- Signup page has `Continue with Google`.
- Google OAuth redirects to `/app`.
- Protected route infinite-loading issue was fixed by adding a session check timeout and stale auth token clearing.

### Medication CRUD

- Medication list/read works.
- Add medication works.
- Edit medication works.
- Delete medication works.
- Multiple time values are stored as `text[]`.
- Blank `refill_date` bug was fixed by converting empty string to `null`.
- `refill_reminder` is converted to a number.
- Modal waits for a successful save before closing.

### Profile

- Profile data reads from the `profiles` table.
- User can update full name and phone number.
- Avatar upload uses Supabase Storage.
- Sidebar avatar reads from `profiles.avatar_url` and downloads from the `avatars` bucket.

### Reminders UI / Preferences

- Reminder page crash from missing `Plus` import was fixed.
- Large orange reminder header was replaced with a compact white summary panel.
- Reminder rows were redesigned into a sleeker layout.
- SMS and WhatsApp are independent selections.
- User can choose SMS only, WhatsApp only, both, or neither.
- Both channels are represented as separate `reminders` rows.
- If SMS/WhatsApp is selected and no phone number exists, UI prompts the user to add it in Profile Settings.
- Reminder rows show per-channel delivery status from `last_sent_at` and `last_error`.
- The Reminders page includes a small Twilio trial/sandbox limitation note.

### Notification Delivery

- Added Supabase migration for SMS/WhatsApp notification delivery.
- Added `claim_due_reminders()` RPC for safe due-reminder claiming.
- Added Supabase Edge Function `send-reminders`.
- The function uses Twilio credentials from Supabase Edge Function secrets.
- The function does not use SendGrid.
- Supabase Cron was configured to invoke the function every minute.
- Manual and cron-triggered SMS/WhatsApp test delivery succeeded.

### Cleanup

- Removed old Node backend prototype and stale root SQL/test files.
- Removed `supabase.txt`, which contained old local Supabase notes/secrets.
- Removed tracked Supabase `.temp` files from the old nested backend Supabase folder.

## Features Partially Completed

### Analytics / Adherence

- `adherence` table exists.
- Analytics page uses placeholder/mock data.
- No full adherence logging workflow exists yet.

### Forgot Password

- Login page links to `/forgot-password`, but no route/page was confirmed.

### Terms / Privacy

- Signup links to `/terms` and `/privacy`, but no route/page was confirmed.

## Bugs Encountered And Fixed

### Old Supabase Project Expired / DNS Errors

Symptom:

- Protected `/app` route stuck on loading.
- Console showed failed refresh-token calls to old Supabase URL.

Fix:

- New Supabase project created and env files updated.
- `SessionContext` now times out `getSession()` and clears stale Supabase auth storage on failure.

### Missing Database On New Supabase

Symptom:

- Old Supabase cloud database expired.
- CRUD could not function.

Fix:

- Rebuilt schema with migrations.
- Added RLS policies and auth trigger.
- Applied migrations to remote Supabase.

### Manual SQL Paste Error

Symptom:

- Supabase SQL Editor reported an unterminated dollar-quoted string.

Cause:

- Only part of the SQL was pasted into the editor, stopping inside a function body.

Fix:

- Migration SQL used named dollar quote tags.
- Full migrations were used as source of truth.

### Medication Add Failed With `invalid input syntax for type date: ""`

Cause:

- Frontend sent empty string to a Postgres `date` column.

Fix:

- `Medications.jsx` normalizes blank `refill_date` to `null`.

### Reminders Page Crashed

Cause:

- JSX rendered `<Plus />` but `Plus` was not imported.

Fix:

- Imported `Plus`.
- Added defensive array handling.

### Reminder UI Was Too Heavy

Fix:

- Replaced the large orange banner with compact summary UI.

### Reminder Channel Was Single-Choice Only

Fix:

- Channel buttons are independent.
- Each channel is stored as a separate `reminders` row.

### Signup Page Too Tall

Fix:

- Removed/hid the promotional strip and tightened form spacing.

### OAuth Needed UI Buttons

Fix:

- Added Google OAuth to login/signup pages.

## Bugs Still Open

- Retry behavior is simple: failures are recorded and the reminder is advanced to the next daily occurrence.
- No production SMTP/custom auth email configuration is documented as complete.
- Forgot password route may be missing.
- Terms/privacy route pages may be missing.
- Analytics is placeholder.
- Lint warnings remain in older/placeholder frontend code.
- Production redirect URLs still need to be configured when deployed.

## Major Decisions And Reasoning

### Frontend-First Supabase CRUD

Decision:

- Keep CRUD directly in React using the Supabase publishable key.

Reason:

- Existing frontend already used direct Supabase calls.
- RLS protects user data.
- No Express API is needed for basic CRUD.

### Remove Old Backend Prototype

Decision:

- Remove old backend helper files and package metadata.

Reason:

- They were not imported by the frontend.
- They duplicated Supabase CRUD logic.
- The scheduler was not production-ready.
- Notification delivery is moving to Supabase Edge Functions.

### RLS For All User Data

Decision:

- Enable RLS on `profiles`, `medications`, `reminders`, and `adherence`.

Reason:

- Users must only access rows owned by their Supabase auth UID.

### `medications.time` Is `text[]`

Decision:

- Store medication times as a text array.

Reason:

- Frontend supports multiple dose times.

### Reminder Multi-Channel As Separate Rows

Decision:

- SMS and WhatsApp are separate reminder rows.

Reason:

- Matches current schema.
- Allows independent channel CRUD and future delivery tracking.

### Supabase Edge Functions + Cron For Notifications

Decision:

- Deliver notifications with Supabase Edge Functions scheduled by Supabase Cron.

Reason:

- Fewer moving pieces than an always-on Express poller.
- Secrets stay server-side.
- Supabase is already the backend platform.

## Coding Conventions Followed

- Keep edits localized to relevant pages/components.
- Use Supabase client directly from frontend for authenticated CRUD.
- Keep service-role/secret keys out of frontend.
- Use `.env.example` for safe templates and `.env` for local secrets.
- Use Tailwind classes directly in JSX.
- Use `lucide-react` icons.
- Normalize payloads before Supabase writes.
- Keep dashboard pages restrained and functional.
- Run `npm run build` and `npm run lint` after frontend changes.

## Known Limitations

- Local email confirmation links redirect to localhost; they will not open correctly from another device unless using a reachable dev URL or production deployment.
- Supabase default auth email service is fine for dev but limited for production.
- Twilio SMS trial accounts may only send to verified recipient numbers.
- Twilio WhatsApp sandbox requires recipients to join the sandbox before receiving test messages.
- Production WhatsApp may require approved sender/templates.
- Cron should be paused when demos/testing are finished to avoid unnecessary Twilio usage:
  `select cron.unschedule('send-medtrack-reminders-every-minute');`
- Current reminders do not account for explicit user timezone settings.
- Current recurrence model is simplistic.
- Analytics is mostly placeholder.

## Current TODO List

High priority:

- Clean existing lint warnings.
- Add forgot password page and flow.
- Add terms/privacy pages or remove dead links until ready.
- Add real analytics/adherence workflows.
- Decide when to pause notification cron before/after public demos.

Medium priority:

- Add a delivery history table if richer notification audit logs become important.

Lower priority:

- Code-split frontend bundle if bundle warning matters.
- Update Browserslist/caniuse data.
- Improve mobile polish across protected pages.

## Next Recommended Steps

1. Finish notification infrastructure:
   - Add delivery fields and claim RPC.
   - Create Supabase Edge Function.
   - Add Supabase Cron schedule.
   - Store secrets in Supabase.
2. Test reminders with a medication scheduled a few minutes ahead.
3. Add delivery observability:
   - last sent time.
   - last error.
   - send attempt count.
4. Decide production auth/email configuration:
   - Custom SMTP for Supabase auth emails.
   - Production redirect URLs.
   - Google OAuth production domain.
5. Clean remaining warnings and placeholder pages.
6. Prepare deployment.
