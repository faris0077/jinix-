/**
 * Seeds the Supabase project with the demo dataset from src/lib/mock-data.ts.
 *
 * Prerequisites:
 *   1. Run supabase/schema.sql in the Supabase Dashboard SQL Editor.
 *   2. Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
 *
 * Run from the project root:
 *   npx tsx scripts/seed-supabase.ts
 *
 * Safe to re-run: rows are upserted by primary key.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_USERS,
  INITIAL_LEAVES,
  INITIAL_FOOD_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_FEES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ROOMS,
  INITIAL_LOST_FOUND,
  INITIAL_ROOM_CHANGES,
  INITIAL_NOTICES,
} from '../src/lib/mock-data';
import {
  userToRow,
  leaveToRow,
  foodOrderToRow,
  deliveryToRow,
  feeToRow,
  complaintToRow,
  notificationToRow,
  roomToRow,
  lostFoundToRow,
  roomChangeToRow,
  noticeToRow,
} from '../src/lib/supabase';

// Minimal .env.local loader (no dotenv dependency needed).
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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
      'Fill them in .env.local (Supabase Dashboard → Project Settings → API), then re-run.'
    );
    process.exit(1);
  }

  const db = createClient(url, key);

  const tables: Array<[string, any[]]> = [
    ['users', INITIAL_USERS.map(userToRow)],
    ['leave_requests', INITIAL_LEAVES.map(leaveToRow)],
    ['food_orders', INITIAL_FOOD_ORDERS.map(foodOrderToRow)],
    ['external_deliveries', INITIAL_DELIVERIES.map(deliveryToRow)],
    ['fee_payments', INITIAL_FEES.map(feeToRow)],
    ['complaints', INITIAL_COMPLAINTS.map(complaintToRow)],
    ['notifications', INITIAL_NOTIFICATIONS.map(notificationToRow)],
    ['rooms', INITIAL_ROOMS.map(roomToRow)],
    ['lost_found_items', INITIAL_LOST_FOUND.map(lostFoundToRow)],
    ['room_change_requests', INITIAL_ROOM_CHANGES.map(roomChangeToRow)],
    ['notices', INITIAL_NOTICES.map(noticeToRow)],
  ];

  let failed = false;
  for (const [table, rows] of tables) {
    const { error } = await db.from(table).upsert(rows);
    if (error) {
      failed = true;
      console.error(`✗ ${table}: ${error.message}`);
    } else {
      console.log(`✓ ${table}: ${rows.length} rows upserted`);
    }
  }

  if (failed) {
    console.error('\nSome tables failed. Did you run supabase/schema.sql first?');
    process.exit(1);
  }
  console.log('\nSeed complete — the app will now load this data from Supabase.');
}

main();
