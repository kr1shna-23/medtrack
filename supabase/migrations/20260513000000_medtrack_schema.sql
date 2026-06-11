-- MedTrack Supabase schema
-- Run this in the Supabase SQL Editor after creating a fresh project.

create extension if not exists "pgcrypto";

-- Profiles are API-safe user records linked to Supabase Auth users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text,
  dosage text,
  frequency text,
  time text[] not null default '{}',
  refill_date date,
  refill_reminder integer default 7,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id bigint references public.medications(id) on delete cascade,
  medication_name text,
  dosage text,
  reminder_time timestamptz not null,
  frequency text,
  type text not null default 'sms' check (type in ('sms', 'whatsapp')),
  status text not null default 'active' check (status in ('active', 'inactive', 'sent')),
  last_sent_at timestamptz,
  last_error text,
  send_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adherence (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id bigint references public.medications(id) on delete cascade,
  taken_at timestamptz not null default now(),
  status text not null default 'taken' check (status in ('taken', 'missed', 'skipped')),
  created_at timestamptz not null default now()
);

create index if not exists medications_user_id_created_at_idx
  on public.medications(user_id, created_at desc);

create index if not exists reminders_user_id_time_idx
  on public.reminders(user_id, reminder_time);

create index if not exists reminders_medication_id_idx
  on public.reminders(medication_id);

create index if not exists reminders_due_delivery_idx
  on public.reminders(status, reminder_time, locked_until)
  where status = 'active';

create index if not exists adherence_user_id_taken_at_idx
  on public.adherence(user_id, taken_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $set_updated_at$
begin
  new.updated_at = now();
  return new;
end;
$set_updated_at$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_medications_updated_at on public.medications;
create trigger set_medications_updated_at
before update on public.medications
for each row execute function public.set_updated_at();

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at
before update on public.reminders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $handle_new_user$
begin
  insert into public.profiles (id, full_name, phone_number, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$handle_new_user$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.medications enable row level security;
alter table public.reminders enable row level security;
alter table public.adherence enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can view their medications" on public.medications;
create policy "Users can view their medications"
on public.medications for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their medications" on public.medications;
create policy "Users can insert their medications"
on public.medications for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their medications" on public.medications;
create policy "Users can update their medications"
on public.medications for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their medications" on public.medications;
create policy "Users can delete their medications"
on public.medications for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view their reminders" on public.reminders;
create policy "Users can view their reminders"
on public.reminders for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their reminders" on public.reminders;
create policy "Users can insert their reminders"
on public.reminders for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    medication_id is null
    or medication_id in (
      select id from public.medications
      where user_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can update their reminders" on public.reminders;
create policy "Users can update their reminders"
on public.reminders for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    medication_id is null
    or medication_id in (
      select id from public.medications
      where user_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can delete their reminders" on public.reminders;
create policy "Users can delete their reminders"
on public.reminders for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view their adherence" on public.adherence;
create policy "Users can view their adherence"
on public.adherence for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their adherence" on public.adherence;
create policy "Users can insert their adherence"
on public.adherence for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    medication_id is null
    or medication_id in (
      select id from public.medications
      where user_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can update their adherence" on public.adherence;
create policy "Users can update their adherence"
on public.adherence for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    medication_id is null
    or medication_id in (
      select id from public.medications
      where user_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can delete their adherence" on public.adherence;
create policy "Users can delete their adherence"
on public.adherence for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.claim_due_reminders(
  batch_size integer default 25,
  lock_minutes integer default 5
)
returns table (
  id bigint,
  user_id uuid,
  medication_id bigint,
  medication_name text,
  dosage text,
  frequency text,
  reminder_time timestamptz,
  type text,
  send_attempts integer,
  full_name text,
  phone_number text
)
language plpgsql
security definer
set search_path = public
as $claim_due_reminders$
begin
  return query
  with due as (
    select r.id
    from public.reminders r
    where r.status = 'active'
      and r.type in ('sms', 'whatsapp')
      and r.reminder_time <= now()
      and (r.locked_until is null or r.locked_until < now())
    order by r.reminder_time asc
    limit greatest(1, least(batch_size, 100))
    for update skip locked
  ),
  locked as (
    update public.reminders r
    set locked_until = now() + make_interval(mins => greatest(1, least(lock_minutes, 60))),
        updated_at = now()
    from due
    where r.id = due.id
    returning r.*
  )
  select
    locked.id,
    locked.user_id,
    locked.medication_id,
    locked.medication_name,
    locked.dosage,
    locked.frequency,
    locked.reminder_time,
    locked.type,
    locked.send_attempts,
    p.full_name,
    p.phone_number
  from locked
  left join public.profiles p on p.id = locked.user_id;
end;
$claim_due_reminders$;

revoke all on function public.claim_due_reminders(integer, integer) from public;
grant execute on function public.claim_due_reminders(integer, integer) to service_role;
