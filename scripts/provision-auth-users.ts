/**
 * Creates real Supabase Auth accounts for the 7 seeded demo users and links
 * each one to its public.users row via auth_user_id.
 *
 * Prerequisites:
 *   1. supabase/schema.sql already applied (creates public.users, etc).
 *   2. In Supabase Dashboard: Authentication -> Sign In / Providers -> Email
 *      -> turn OFF "Confirm email" (none of these are real inboxes).
 *   3. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Project Settings -> API
 *      -> service_role secret). NEVER commit this key or share it in chat —
 *      it bypasses every security rule in the project.
 *
 * Run from the project root:
 *   npx tsx scripts/provision-auth-users.ts
 *
 * Safe to re-run: existing accounts are detected and only re-linked.
 * Prints each account's initial password (its phone number) ONCE — this is
 * the only place these passwords are shown; share them with each person
 * directly and have them change it via "Change Password" after first login.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_USERS } from '../src/lib/mock-data';
import { phoneToInitialPassword } from '../src/lib/auth-helpers';

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith('#')) {
        const value = m[2].replace(/^["']|["']$/g, '');
        if (!process.env[m[1]]) process.env[m[1]] = value;
      }
    }
  } catch {
    // .env.local missing — env vars may be set another way.
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n' +
      'Get the service_role secret from Project Settings -> API and add it as:\n' +
      '  SUPABASE_SERVICE_ROLE_KEY=...'
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Build an email -> auth user id map once (avoids one listUsers() call per person).
  const existingByEmail = new Map<string, string>();
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error('Failed to list existing auth users:', error.message);
      process.exit(1);
    }
    for (const u of data.users) {
      if (u.email) existingByEmail.set(u.email.toLowerCase(), u.id);
    }
    if (data.users.length < 200) break;
    page += 1;
  }

  const results: { name: string; email: string; role: string; password: string | null; status: string }[] = [];

  for (const user of INITIAL_USERS) {
    const password = phoneToInitialPassword(user.phone);
    const emailKey = user.email.toLowerCase();
    let authUserId = existingByEmail.get(emailKey) ?? null;

    if (!authUserId) {
      if (!password) {
        results.push({ name: user.name, email: user.email, role: user.role, password: null, status: 'SKIPPED — no usable phone number' });
        continue;
      }
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email: user.email,
        password,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role },
      });
      if (createError || !created.user) {
        results.push({ name: user.name, email: user.email, role: user.role, password: null, status: `FAILED — ${createError?.message}` });
        continue;
      }
      authUserId = created.user.id;
      results.push({ name: user.name, email: user.email, role: user.role, password, status: 'CREATED' });
    } else {
      results.push({ name: user.name, email: user.email, role: user.role, password: null, status: 'ALREADY EXISTED — relinked' });
    }

    const { error: linkError } = await admin.from('users').update({ auth_user_id: authUserId }).eq('id', user.id);
    if (linkError) {
      console.error(`  ! Failed to link ${user.email} to public.users:`, linkError.message);
    }
  }

  console.log('\n--- Provisioning report ---');
  for (const r of results) {
    console.log(`${r.status.padEnd(32)} ${r.role.padEnd(9)} ${r.name.padEnd(24)} ${r.email}${r.password ? `  (password: ${r.password})` : ''}`);
  }
  console.log('\nDone. Passwords above are shown only this once — share them directly with each person.');
}

main();
