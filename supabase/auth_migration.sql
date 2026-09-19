-- ============================================================================
-- Chavara Residence OS — real login migration
-- Run in Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- Run this ONLY after you have:
--   1. Disabled "Confirm email" in Authentication -> Sign In / Providers -> Email
--      (none of the seeded accounts have real inboxes, so confirmation
--      emails would never arrive or be clickable).
--   2. Been told by the assistant that scripts/provision-auth-users.ts has
--      successfully created and linked the 7 seeded Supabase Auth accounts.
-- Applying this BEFORE step 2 will lock the running app out of its own
-- database, because it switches every operational table from "anyone with
-- the public key" access to "must be logged in" access.
-- ============================================================================

-- Link each app user row to its real Supabase Auth account.
alter table public.users add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;
create index if not exists idx_users_auth_user_id on public.users (auth_user_id);

-- ---------------------------------------------------------------------------
-- Tighten RLS: replace "anon, authenticated" demo policies with
-- "authenticated" only. After this runs, the public anon key alone can no
-- longer read or write a single row in these tables — a valid, signed-in
-- Supabase Auth session is required. (hostel_applicants is untouched: it
-- already has zero policies and stays dashboard-only.)
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
    execute format('drop policy if exists "demo full access" on public.%I', t);
    execute format(
      'create policy "signed-in full access" on public.%I for all to authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;
