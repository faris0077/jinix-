import 'server-only';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Verifies the caller is a signed-in warden or director before an admin
 * route (create user / reset password) proceeds. Reads the caller's own
 * Supabase Auth access token from the Authorization header (the client
 * attaches its current session token — see src/lib/store.tsx) and looks up
 * their role via auth_user_id, never trusting a role sent in the request body.
 */
export async function requireStaffCaller(request: NextRequest) {
  if (!supabaseAdmin) {
    return { error: 'Server is not configured with SUPABASE_SERVICE_ROLE_KEY.', status: 500 } as const;
  }

  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { error: 'Missing bearer token.', status: 401 } as const;
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData.user) {
    return { error: 'Invalid or expired session.', status: 401 } as const;
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('id, role, name')
    .eq('auth_user_id', authData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { error: 'No app profile linked to this account.', status: 403 } as const;
  }
  if (profile.role !== 'warden' && profile.role !== 'director') {
    return { error: 'Only wardens and directors can manage accounts.', status: 403 } as const;
  }

  return { caller: profile as { id: string; role: 'warden' | 'director'; name: string } } as const;
}
