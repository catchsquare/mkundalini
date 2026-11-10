-- Online appointment booking
--
-- Patients book from the public website through two functions only:
--   get_available_slots(date)  -> free times for a day (no patient data)
--   book_appointment(...)      -> creates a 'requested' appointment
-- The public never reads or writes the appointments or patients tables
-- directly. Staff confirm, reschedule or cancel from the admin panel.

-- 1. Appointment statuses and booking fields ---------------------------------

alter table public.appointments drop constraint if exists appointments_status_check;
alter table public.appointments add constraint appointments_status_check
  check (status in ('requested', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'));

alter table public.appointments
  add column if not exists booking_ref text unique,
  add column if not exists source text not null default 'staff'
    check (source in ('staff', 'website', 'phone', 'whatsapp', 'walkin')),
  add column if not exists patient_timezone text,
  add column if not exists patient_message text;

create index if not exists appointments_active_date_idx
  on public.appointments (appointment_date, start_time)
  where status not in ('cancelled', 'no_show');

-- Receptionists confirm bookings, so they need update rights too.
drop policy if exists "Authorized staff can update appointments" on public.appointments;
create policy "Authorized staff can update appointments" on public.appointments
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.user_id = auth.uid()
        and profiles.role in ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
    )
  );

-- 2. Booking settings (single row) ------------------------------------------

create table if not exists public.booking_settings (
  id int primary key default 1 check (id = 1),
  is_enabled boolean not null default true,
  slot_minutes int not null default 30 check (slot_minutes between 10 and 180),
  capacity_per_slot int not null default 2 check (capacity_per_slot between 1 and 20),
  min_notice_minutes int not null default 180 check (min_notice_minutes >= 0),
  max_days_ahead int not null default 60 check (max_days_ahead between 1 and 365),
  max_pending_per_phone int not null default 3 check (max_pending_per_phone between 1 and 20),
  clinic_timezone text not null default 'Asia/Kathmandu',
  updated_at timestamptz not null default now()
);
insert into public.booking_settings (id) values (1) on conflict (id) do nothing;

alter table public.booking_settings enable row level security;
drop policy if exists "Anyone can read booking settings" on public.booking_settings;
create policy "Anyone can read booking settings" on public.booking_settings
  for select using (true);
drop policy if exists "Admins manage booking settings" on public.booking_settings;
create policy "Admins manage booking settings" on public.booking_settings
  for update using (
    exists (select 1 from public.profiles
            where profiles.user_id = auth.uid()
              and profiles.role in ('super_admin', 'admin', 'manager'))
  );

-- 3. Closed dates (public holidays, festivals, clinic leave) -----------------

create table if not exists public.blocked_dates (
  blocked_date date primary key,
  reason text,
  created_at timestamptz not null default now()
);
alter table public.blocked_dates enable row level security;
drop policy if exists "Anyone can read blocked dates" on public.blocked_dates;
create policy "Anyone can read blocked dates" on public.blocked_dates
  for select using (true);
drop policy if exists "Staff manage blocked dates" on public.blocked_dates;
create policy "Staff manage blocked dates" on public.blocked_dates
  for all using (
    exists (select 1 from public.profiles
            where profiles.user_id = auth.uid()
              and profiles.role in ('super_admin', 'admin', 'manager', 'receptionist'))
  );

-- 4. Free slots for a day ----------------------------------------------------

create or replace function public.get_available_slots(p_date date)
returns table (start_time time, end_time time, remaining int)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  s public.booking_settings;
  wh public.working_hours;
  clinic_now timestamp;
  slot_start time;
  slot_end time;
  taken int;
begin
  select * into s from public.booking_settings where id = 1;
  if s is null or not s.is_enabled or p_date is null then
    return;
  end if;

  clinic_now := now() at time zone s.clinic_timezone;
  if p_date < clinic_now::date or p_date > clinic_now::date + s.max_days_ahead then
    return;
  end if;

  if exists (select 1 from public.blocked_dates b where b.blocked_date = p_date) then
    return;
  end if;

  -- working_hours.day_of_week: 0 = Sunday ... 6 = Saturday
  select * into wh from public.working_hours w
  where w.day_of_week = extract(dow from p_date)::int;
  if wh is null or wh.is_closed or wh.open_time is null or wh.close_time is null then
    return;
  end if;

  slot_start := wh.open_time;
  loop
    slot_end := slot_start + make_interval(mins => s.slot_minutes);
    -- stop when the slot would run past closing (or wrap past midnight)
    exit when slot_end > wh.close_time or slot_end <= slot_start;

    if not (wh.break_start is not null and wh.break_end is not null
            and slot_start < wh.break_end and slot_end > wh.break_start)
       and (p_date + slot_start) >= clinic_now + make_interval(mins => s.min_notice_minutes)
    then
      select count(*) into taken
      from public.appointments a
      where a.appointment_date = p_date
        and a.status not in ('cancelled', 'no_show')
        and a.start_time < slot_end
        and a.end_time > slot_start;

      if taken < s.capacity_per_slot then
        start_time := slot_start;
        end_time := slot_end;
        remaining := s.capacity_per_slot - taken;
        return next;
      end if;
    end if;

    slot_start := slot_end;
  end loop;
end;
$$;

-- 5. Book a slot ---------------------------------------------------------------
-- Errors are raised with a stable code in the message (e.g. 'SLOT_UNAVAILABLE')
-- so the website can show a friendly explanation.

create or replace function public.book_appointment(
  p_date date,
  p_start_time time,
  p_treatment text,
  p_full_name text,
  p_phone text,
  p_email text default null,
  p_country text default null,
  p_timezone text default null,
  p_message text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  s public.booking_settings;
  v_name text := btrim(coalesce(p_full_name, ''));
  v_phone_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  v_country text := nullif(btrim(coalesce(p_country, '')), '');
  v_treatment text := btrim(coalesce(p_treatment, ''));
  v_message text := nullif(btrim(coalesce(p_message, '')), '');
  v_slot record;
  v_patient_id uuid;
  v_pending int;
  v_ref text;
  v_first text;
  v_last text;
begin
  select * into s from public.booking_settings where id = 1;
  if s is null or not s.is_enabled then
    raise exception 'BOOKING_DISABLED';
  end if;

  -- Input validation
  if length(v_name) < 2 or length(v_name) > 100 then
    raise exception 'INVALID_NAME';
  end if;
  if length(v_phone_digits) < 7 or length(v_phone_digits) > 15 then
    raise exception 'INVALID_PHONE';
  end if;
  if v_email is not null and (length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    raise exception 'INVALID_EMAIL';
  end if;
  if length(v_treatment) < 2 or length(v_treatment) > 100 then
    raise exception 'INVALID_TREATMENT';
  end if;
  if v_message is not null and length(v_message) > 1000 then
    raise exception 'MESSAGE_TOO_LONG';
  end if;
  if v_country is not null and length(v_country) > 60 then
    raise exception 'INVALID_COUNTRY';
  end if;
  if p_timezone is not null and length(p_timezone) > 64 then
    raise exception 'INVALID_TIMEZONE';
  end if;

  -- Serialise bookings for the same day so two people cannot take the last
  -- place in a slot at the same moment.
  perform pg_advisory_xact_lock(hashtext('booking:' || p_date::text));

  select * into v_slot
  from public.get_available_slots(p_date) g
  where g.start_time = p_start_time;
  if v_slot is null then
    raise exception 'SLOT_UNAVAILABLE';
  end if;

  -- Spam / duplicate protection: limit open requests per phone number.
  select count(*) into v_pending
  from public.appointments a
  join public.patients p on p.id = a.patient_id
  where regexp_replace(p.phone, '\D', '', 'g') = v_phone_digits
    and a.status = 'requested'
    and a.appointment_date >= (now() at time zone s.clinic_timezone)::date;
  if v_pending >= s.max_pending_per_phone then
    raise exception 'TOO_MANY_PENDING';
  end if;

  -- Find or create the patient record by phone number.
  select p.id into v_patient_id
  from public.patients p
  where regexp_replace(p.phone, '\D', '', 'g') = v_phone_digits
  order by p.created_at
  limit 1;

  if v_patient_id is null then
    v_first := split_part(v_name, ' ', 1);
    v_last := nullif(btrim(substr(v_name, length(v_first) + 1)), '');
    insert into public.patients (first_name, last_name, phone, email, country, is_international, notes)
    values (
      v_first,
      coalesce(v_last, '-'),
      btrim(p_phone),
      v_email,
      coalesce(v_country, 'Nepal'),
      coalesce(v_country, 'Nepal') <> 'Nepal',
      'Created from online booking'
    )
    returning id into v_patient_id;
  elsif v_email is not null then
    update public.patients set email = coalesce(email, v_email) where id = v_patient_id;
  end if;

  -- Short, readable reference, e.g. KD-7F3K9Q (no 0/O/1/I to avoid confusion)
  loop
    v_ref := 'KD-' || (
      select string_agg(substr('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 1 + floor(random() * 32)::int, 1), '')
      from generate_series(1, 6)
    );
    exit when not exists (select 1 from public.appointments where booking_ref = v_ref);
  end loop;

  insert into public.appointments (
    patient_id, appointment_date, start_time, end_time, treatment_type,
    status, source, booking_ref, patient_timezone, patient_message
  ) values (
    v_patient_id, p_date, v_slot.start_time, v_slot.end_time, v_treatment,
    'requested', 'website', v_ref, p_timezone, v_message
  );

  -- Also log it in the Leads inbox so the existing email alert fires.
  insert into public.leads (name, email, phone, source, form_type, message, treatment_interest, priority, metadata)
  values (
    v_name, v_email, btrim(p_phone), 'website', 'appointment',
    format('Online booking %s: %s at %s (Nepal time)%s',
           v_ref, to_char(p_date, 'Dy DD Mon YYYY'), to_char(v_slot.start_time, 'HH12:MI AM'),
           coalesce(E'\n' || v_message, '')),
    v_treatment, 'high',
    jsonb_build_object('booking_ref', v_ref, 'country', v_country, 'timezone', p_timezone)
  );

  return jsonb_build_object(
    'booking_ref', v_ref,
    'date', p_date,
    'start_time', v_slot.start_time,
    'end_time', v_slot.end_time
  );
end;
$$;

revoke all on function public.get_available_slots(date) from public;
revoke all on function public.book_appointment(date, time, text, text, text, text, text, text, text) from public;
grant execute on function public.get_available_slots(date) to anon, authenticated;
grant execute on function public.book_appointment(date, time, text, text, text, text, text, text, text) to anon, authenticated;
