# Project History

This file records chronological checkpoints from the MedTrack Supabase recovery, CRUD fixes, OAuth setup, notification planning, and repository cleanup work.

## Checkpoint 1: Initial Repo Inspection

The project was inspected from:

```text
C:\Users\ASUS\Desktop\KR1SHNA\medtrack-main
```

Initial structure:

- `frontend/`
  - React/Vite app and main user-facing product.
- `backend/`
  - Old Node helper files and notification prototypes.
- Root SQL/test scratch files.

Early finding:

- Frontend was effectively the main app.
- Backend/Supabase setup was broken because the old Supabase cloud database had expired or was unreachable.

## Checkpoint 2: Data Model Identified

Tables identified from SQL and frontend usage:

- `profiles`
- `medications`
- `reminders`
- `adherence`

Important mismatch discovered:

- Frontend stores medication times as an array.
- Original schema had `medications.time` as `text`.
- Correct schema needs `time text[]`.

## Checkpoint 3: Supabase Rebuild Plan

A plan was made to:

- Rebuild Supabase database.
- Add RLS policies.
- Add auth trigger to create `profiles` rows.
- Use private Storage bucket for avatars.
- Keep frontend direct-to-Supabase CRUD.
- Move email/WhatsApp delivery to a later server-side task.

## Checkpoint 4: New Supabase Project Created

User created a new Supabase project and provided setup values during the chat.

Important security note:

- Live secrets were shared during setup, but should not be copied into committed docs or source files.
- Local `.env` files are gitignored and can hold secrets locally.

## Checkpoint 5: Environment Wired Locally

Local env files were updated:

- `frontend/.env`
- old `backend/.env` during the earlier prototype phase

Safe template added:

- `frontend/.env.example`

Frontend client supports:

- `VITE_SUPABASE_PUBLISHABLE_KEY`
- fallback: `VITE_SUPABASE_ANON_KEY`

## Checkpoint 6: Supabase Migrations Added

Migration files were created and later moved to:

- `supabase/migrations/20260513000000_medtrack_schema.sql`
- `supabase/migrations/20260513000001_avatar_storage.sql`

Schema migration includes:

- Tables.
- Indexes.
- `updated_at` trigger function.
- `handle_new_user()` auth trigger.
- RLS policies.

Storage migration includes:

- `avatars` bucket creation/update.
- Storage RLS policies for per-user avatar paths.

## Checkpoint 7: Remote Migration Applied

Supabase CLI dry-run succeeded.

Migrations were pushed to the remote database.

Read checks against Supabase REST endpoints returned `200 OK` at that time for:

- `profiles`
- `medications`
- `reminders`

## Checkpoint 8: SQL Editor Paste Issue

User attempted to run older SQL manually in Supabase SQL Editor and hit:

```text
unterminated dollar-quoted string
```

Cause:

- Partial SQL paste stopped inside a PL/pgSQL function.

Fix/Guidance:

- Full migrations had already been applied.
- Named dollar quote delimiters were used in migration files for clarity.

## Checkpoint 9: Protected Route Infinite Loading Fixed

Symptom:

- `/app` stuck on loading.
- Browser console showed refresh-token calls to old expired Supabase URL failing.

Fix:

- `SessionContext` wraps session restoration in a timeout.
- On failure, stale Supabase auth storage is cleared.
- Protected route no longer hangs forever.

## Checkpoint 10: Medication CRUD Fixed

Symptom:

```text
invalid input syntax for type date: ""
```

Cause:

- Blank refill date sent to Supabase as an empty string.

Fix:

- Medication payload normalization:
  - blank date becomes `null`;
  - reminder days become number;
  - optional text normalized;
  - `time` array cleaned.
- Modal waits for Supabase success before closing.

Result:

- User confirmed CRUD works perfectly.

## Checkpoint 11: Reminders Page Crash Fixed

Symptom:

- Reminders page crashed entire site.

Cause:

- `<Plus />` icon used but not imported.

Fix:

- Imported `Plus`.
- Added defensive handling for empty/malformed arrays and blank times.

## Checkpoint 12: Reminders UI Redesigned

Problem:

- Original Reminders page had a large orange banner that looked too heavy.

Fix:

- Replaced with compact white summary panel.
- Redesigned rows with lighter visual treatment.

## Checkpoint 13: Reminder Channel Selection Improved

Original behavior:

- User could choose only one of email or WhatsApp.

New behavior:

- Email and WhatsApp are independent buttons.
- User can choose both.
- User can unchoose both.
- Separate reminder rows store separate channels.
- WhatsApp selection shows a notice if no phone number exists in profile.

## Checkpoint 14: Auth Email Confirmation Enabled

User enabled Supabase email confirmation.

Behavior verified:

- Signup shows check-email message.
- User receives confirmation email.
- Clicking confirmation link confirms email and redirects to local app.
- Login works after confirmation.

Important local dev explanation:

- Confirmation links opened on a phone redirecting to localhost will not load the app because localhost points to the phone.
- Production Site URL and redirect URLs must use deployed frontend domain.

## Checkpoint 15: Google OAuth Configured

User created Google Cloud project and OAuth client.

Setup included:

- Google Auth Platform configuration.
- OAuth client type: Web application.
- Local JavaScript origins:
  - `http://127.0.0.1:5173`
  - `http://localhost:5173`
- Supabase callback:
  - Supabase project's `/auth/v1/callback`.

User connected Client ID and Client Secret in Supabase:

```text
Authentication > Sign In / Providers > Google
```

## Checkpoint 16: Google OAuth Buttons Added

Frontend changed:

- `LoginPage.jsx`
  - Added Continue with Google.
  - Calls `supabase.auth.signInWithOAuth`.
- `SignupPage.jsx`
  - Added Continue with Google.
  - Requires terms checkbox first.

User confirmed OAuth works.

## Checkpoint 17: Signup Page Height Reduced

Problem:

- Signup page was too tall and required scrolling.

Fix:

- Promotional "Free forever / No credit card required" strip hidden/removed.
- Form spacing tightened.

## Checkpoint 18: Notification Architecture Planned

Notification goal:

- Send medication reminder emails and WhatsApp messages.

Options discussed:

- Old Express/Node poller.
- Supabase Edge Functions + Cron.

Decision:

- Use Supabase Edge Functions + Supabase Cron.

Reason:

- Better fit for Supabase-centered app.
- No always-on server needed.
- Secrets stay server-side.

Planned implementation:

- Add Edge Function `send-reminders`.
- Add Supabase Cron invocation every minute.
- Add database fields for delivery tracking/locking:
  - `last_sent_at`
  - `last_error`
  - `send_attempts`
  - `locked_until`
- Add RPC to claim due reminders.
- Send through SendGrid and Twilio.
- Reschedule successful reminders.

## Checkpoint 19: SendGrid/Twilio Guidance

Clarification:

- SendGrid is Twilio SendGrid.
- Email API keys are managed in SendGrid.
- WhatsApp credentials are managed in Twilio.

Needed future values:

- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

Important:

- These belong in Supabase Edge Function secrets, not frontend.

## Checkpoint 20: Project Handoff Created

Created:

- `PROJECT_HANDOFF.md`
- `AGENTS.md`
- `project-history.md`

Purpose:

- Preserve context for future chats with no access to this conversation.

## Checkpoint 21: Repository Cleanup

User decided the old backend context should not remain because notifications are moving to Supabase Edge Functions.

Removed:

- Old Node backend helper files.
- Old Node backend package files.
- Old nested Supabase `.temp` files.
- Old root SQL scratch files.
- Old root reminder test script.
- Old plaintext Supabase notes file.

Moved:

- Supabase migrations from `backend/supabase/migrations/` to `supabase/migrations/`.

Current architecture after cleanup:

- `frontend/` is the runnable app.
- `supabase/migrations/` is the database/schema source.
- Future notification code should go under `supabase/functions/`.

## Current Immediate Next Step

Implement the notification delivery plan:

1. Add reminder delivery migration.
2. Create `supabase/functions/send-reminders/index.ts`.
3. Store SendGrid/Twilio secrets in Supabase.
4. Add Supabase Cron job.
5. Test email reminder.
6. Test WhatsApp reminder.
7. Confirm success/failure metadata updates.
