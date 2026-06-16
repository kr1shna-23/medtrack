-- Switch notification preferences from email/WhatsApp to SMS/WhatsApp and
-- add delivery tracking for the Supabase Edge Function.

alter table public.reminders
  add column if not exists last_sent_at timestamptz,
  add column if not exists last_error text,
  add column if not exists send_attempts integer not null default 0,
  add column if not exists locked_until timestamptz;

alter table public.reminders
  alter column type set default 'sms';

alter table public.reminders
  drop constraint if exists reminders_type_check;

update public.reminders
set type = 'sms'
where type = 'email';

alter table public.reminders
  add constraint reminders_type_check
  check (type in ('sms', 'whatsapp'));

create index if not exists reminders_due_delivery_idx
  on public.reminders(status, reminder_time, locked_until)
  where status = 'active';

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
