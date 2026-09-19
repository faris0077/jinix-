-- ============================================================================
-- Chavara Residence OS — RLS hardening (row-level authorization)
-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- Problem this fixes: the previous policies only checked "is there a valid
-- session at all" — any signed-in student could read or write ANY row in
-- ANY table (approve their own leave, edit another student's profile, etc.)
-- by calling the Supabase REST API directly, bypassing the app's UI.
--
-- This replaces the blanket policies with per-table rules: students can only
-- touch their own rows; only warden/director can approve, assign, or resolve
-- things. hostel_applicants is untouched (already zero-policy/locked).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER so they can read public.users without recursing
-- into these same policies; search_path pinned for safety).
-- ---------------------------------------------------------------------------

create or replace function public.current_app_user_id()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select id from public.users where auth_user_id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where auth_user_id = auth.uid() and role in ('warden', 'director')
  )
$$;

-- ---------------------------------------------------------------------------
-- Drop every old blanket policy up front.
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
    execute format('drop policy if exists "signed-in full access" on public.%I', t);
    execute format('drop policy if exists "demo full access" on public.%I', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- users — directory readable by anyone signed in; you can only edit your
-- own row, or staff can edit anyone's. No authenticated insert/delete
-- (accounts are created/removed only via the admin API's service_role key).
-- ---------------------------------------------------------------------------

create policy "read all users" on public.users
  for select to authenticated using (true);

create policy "update own or staff" on public.users
  for update to authenticated
  using (auth_user_id = auth.uid() or is_staff())
  with check (auth_user_id = auth.uid() or is_staff());

-- ---------------------------------------------------------------------------
-- leave_requests — own rows only for students; only staff can insert on
-- someone else's behalf, change status (approve/reject/complete), or delete.
-- ---------------------------------------------------------------------------

create policy "select own or staff" on public.leave_requests
  for select to authenticated using (student_id = current_app_user_id() or is_staff());

create policy "insert own or staff" on public.leave_requests
  for insert to authenticated with check (student_id = current_app_user_id() or is_staff());

create policy "staff update" on public.leave_requests
  for update to authenticated using (is_staff()) with check (is_staff());

create policy "staff delete" on public.leave_requests
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- external_deliveries — own rows for students; students may update their own
-- (e.g. mark collected); staff can do anything.
-- ---------------------------------------------------------------------------

create policy "select own or staff" on public.external_deliveries
  for select to authenticated using (student_id = current_app_user_id() or is_staff());

create policy "insert own or staff" on public.external_deliveries
  for insert to authenticated with check (student_id = current_app_user_id() or is_staff());

create policy "update own or staff" on public.external_deliveries
  for update to authenticated
  using (student_id = current_app_user_id() or is_staff())
  with check (student_id = current_app_user_id() or is_staff());

create policy "staff delete" on public.external_deliveries
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- fee_payments — students see/pay only their own bills; only staff can
-- create new fee line items or delete.
-- ---------------------------------------------------------------------------

create policy "select own or staff" on public.fee_payments
  for select to authenticated using (student_id = current_app_user_id() or is_staff());

create policy "staff insert" on public.fee_payments
  for insert to authenticated with check (is_staff());

create policy "update own or staff" on public.fee_payments
  for update to authenticated
  using (student_id = current_app_user_id() or is_staff())
  with check (student_id = current_app_user_id() or is_staff());

create policy "staff delete" on public.fee_payments
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- complaints — students file and view only their own; only staff can assign
-- or resolve.
-- ---------------------------------------------------------------------------

create policy "select own or staff" on public.complaints
  for select to authenticated using (student_id = current_app_user_id() or is_staff());

create policy "insert own or staff" on public.complaints
  for insert to authenticated with check (student_id = current_app_user_id() or is_staff());

create policy "staff update" on public.complaints
  for update to authenticated using (is_staff()) with check (is_staff());

create policy "staff delete" on public.complaints
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- lost_found_items — a bulletin board: everyone signed in can browse it, but
-- you can only edit/resolve your own report (or staff can).
-- ---------------------------------------------------------------------------

create policy "select all" on public.lost_found_items
  for select to authenticated using (true);

create policy "insert own or staff" on public.lost_found_items
  for insert to authenticated with check (student_id = current_app_user_id() or is_staff());

create policy "update own or staff" on public.lost_found_items
  for update to authenticated
  using (student_id = current_app_user_id() or is_staff())
  with check (student_id = current_app_user_id() or is_staff());

create policy "staff delete" on public.lost_found_items
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- room_change_requests — own rows for students; only staff approve/reject.
-- ---------------------------------------------------------------------------

create policy "select own or staff" on public.room_change_requests
  for select to authenticated using (student_id = current_app_user_id() or is_staff());

create policy "insert own or staff" on public.room_change_requests
  for insert to authenticated with check (student_id = current_app_user_id() or is_staff());

create policy "staff update" on public.room_change_requests
  for update to authenticated using (is_staff()) with check (is_staff());

create policy "staff delete" on public.room_change_requests
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- notices — broadcasts readable by everyone signed in; only staff publish.
-- ---------------------------------------------------------------------------

create policy "select all" on public.notices
  for select to authenticated using (true);

create policy "staff insert" on public.notices
  for insert to authenticated with check (is_staff());

create policy "staff update" on public.notices
  for update to authenticated using (is_staff()) with check (is_staff());

create policy "staff delete" on public.notices
  for delete to authenticated using (is_staff());

-- ---------------------------------------------------------------------------
-- rooms — everyone signed in can view (roommate info etc.); only staff
-- manage room assignments/status.
-- ---------------------------------------------------------------------------

create policy "select all" on public.rooms
  for select to authenticated using (true);

create policy "staff write" on public.rooms
  for all to authenticated using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------------
-- food_orders / notifications — no per-person owner column exists in this
-- schema (pre-existing design: a shared daily menu and a shared activity
-- feed, not per-student tables). Left broadly read/write for any signed-in
-- user to match current app behavior; deletion restricted to staff so a
-- student can't wipe the menu or the whole notification feed.
-- ---------------------------------------------------------------------------

create policy "select all" on public.food_orders for select to authenticated using (true);
create policy "insert all" on public.food_orders for insert to authenticated with check (true);
create policy "update all" on public.food_orders for update to authenticated using (true) with check (true);
create policy "staff delete" on public.food_orders for delete to authenticated using (is_staff());

create policy "select all" on public.notifications for select to authenticated using (true);
create policy "insert all" on public.notifications for insert to authenticated with check (true);
create policy "update all" on public.notifications for update to authenticated using (true) with check (true);
create policy "staff delete" on public.notifications for delete to authenticated using (is_staff());
