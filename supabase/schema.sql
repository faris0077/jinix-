-- ============================================================================
-- Chavara Residence OS — Supabase schema
-- Run this once in the Supabase Dashboard → SQL Editor → New query → Run.
-- Mirrors the app types in src/lib/mock-data.ts (snake_case columns).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id               text primary key,
  name             text not null,
  email            text not null,
  role             text not null check (role in ('student', 'warden', 'director')),
  avatar           text not null default '',
  room_number      text,
  block            text,
  course           text,
  year             text,
  phone            text,
  parent_phone     text,
  balance          numeric,
  attendance_today text check (attendance_today in ('present', 'on-leave', 'outpass', 'library'))
);

create table if not exists public.leave_requests (
  id                  text primary key,
  student_id          text not null,
  student_name        text not null,
  room_number         text not null,
  type                text not null check (type in ('general', 'home', 'outpass', 'library', 'class')),
  start_date          text not null,
  end_date            text,
  start_time          text,
  end_time            text,
  actual_arrival_time text,
  reason              text not null,
  destination         text,
  status              text not null check (status in ('pending', 'approved', 'rejected', 'in-progress', 'completed')),
  created_at          timestamptz not null default now(),
  food_requirements   jsonb,
  medical_cert_name   text
);

create table if not exists public.food_orders (
  id          text primary key,
  meal_type   text not null check (meal_type in ('breakfast', 'lunch', 'tea', 'dinner')),
  date        text not null,
  name        text not null,
  description text not null,
  calories    integer not null,
  cutoff_time text not null,
  price       numeric not null,
  ordered     boolean not null default false,
  dietary     text not null check (dietary in ('veg', 'non-veg', 'vegan'))
);

create table if not exists public.external_deliveries (
  id                     text primary key,
  student_id             text not null,
  student_name           text not null,
  room_number            text not null,
  department             text,
  date                   text,
  platform               text not null,
  restaurant_or_store    text not null,
  items_summary          text not null,
  expected_time          text not null,
  actual_arrival_time    text,
  status                 text not null check (status in ('en-route', 'arrived-gate', 'collected')),
  ordered_at             timestamptz not null default now(),
  delivery_partner_phone text,
  amount                 numeric
);

create table if not exists public.fee_payments (
  id         text primary key,
  student_id text,
  title      text not null,
  amount     numeric not null,
  due_date   text not null,
  status     text not null check (status in ('paid', 'pending', 'overdue')),
  paid_on    text,
  receipt_no text,
  category   text not null check (category in ('tuition', 'hostel', 'mess', 'amenities'))
);

create table if not exists public.complaints (
  id           text primary key,
  student_id   text not null,
  student_name text not null,
  room_number  text not null,
  category     text not null check (category in ('plumbing', 'electrical', 'wifi', 'food', 'security', 'other')),
  title        text not null,
  description  text not null,
  image_url    text,
  status       text not null check (status in ('submitted', 'in-progress', 'resolved')),
  created_at   timestamptz not null default now(),
  assigned_to  text,
  resolved_at  timestamptz
);

create table if not exists public.notifications (
  id              text primary key,
  title           text not null,
  message         text not null,
  timestamp_label text not null default 'Just now',
  read            boolean not null default false,
  type            text not null check (type in ('approval', 'alert', 'info', 'payment')),
  link            text,
  created_at      timestamptz not null default now()
);

create table if not exists public.rooms (
  id          text primary key,
  room_number text not null,
  block       text not null check (block in ('A', 'B', 'C', 'D')),
  capacity    integer not null,
  occupied    integer not null default 0,
  status      text not null check (status in ('available', 'full', 'maintenance')),
  students    jsonb not null default '[]'::jsonb
);

create table if not exists public.lost_found_items (
  id          text primary key,
  type        text not null check (type in ('lost', 'found')),
  title       text not null,
  description text not null,
  category    text not null check (category in ('electronics', 'clothing', 'books', 'keys', 'other')),
  status      text not null check (status in ('open', 'resolved')),
  reported_by text not null,
  student_id  text not null,
  date        timestamptz not null default now(),
  image_url   text
);

create table if not exists public.room_change_requests (
  id              text primary key,
  student_id      text not null,
  student_name    text not null,
  current_room    text not null,
  requested_block text not null check (requested_block in ('A', 'B', 'C', 'D', 'Any')),
  reason          text not null,
  status          text not null check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now()
);

create table if not exists public.notices (
  id              text primary key,
  title           text not null,
  message         text not null,
  priority        text not null check (priority in ('normal', 'high', 'urgent')),
  target_audience text not null default 'All' check (target_audience in ('All', 'A', 'B', 'C', 'D')),
  author          text not null,
  date            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpful indexes for the app's common filters
-- ---------------------------------------------------------------------------

create index if not exists idx_leave_requests_student on public.leave_requests (student_id);
create index if not exists idx_leave_requests_status  on public.leave_requests (status);
create index if not exists idx_deliveries_student     on public.external_deliveries (student_id);
create index if not exists idx_complaints_status      on public.complaints (status);
create index if not exists idx_notifications_created  on public.notifications (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Demo posture: RLS is ON with permissive policies so the public (anon) key
-- can read/write. The app has no real auth yet — tighten these when it does.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'users', 'leave_requests', 'food_orders', 'external_deliveries',
    'fee_payments', 'complaints', 'notifications', 'rooms',
    'lost_found_items', 'room_change_requests', 'notices'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "demo full access" on public.%I', t);
    execute format(
      'create policy "demo full access" on public.%I for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Realtime — lets every open portal (student / warden / director) update live
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'users', 'leave_requests', 'food_orders', 'external_deliveries',
    'fee_payments', 'complaints', 'notifications', 'rooms',
    'lost_found_items', 'room_change_requests', 'notices'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      null; -- already in the publication
    end;
  end loop;
end $$;
