import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * SERVER-ONLY Supabase client using the service_role secret key.
 * This key bypasses every Row Level Security policy — it must never reach
 * the browser bundle. `import 'server-only'` makes any accidental import
 * from client code fail the build instead of shipping the secret.
 *
 * Read from SUPABASE_SERVICE_ROLE_KEY (deliberately NOT prefixed with
 * NEXT_PUBLIC_, which is what would leak it into client JS).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = Boolean(url && serviceRoleKey);

export const supabaseAdmin = isAdminConfigured
  ? createClient(url!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
