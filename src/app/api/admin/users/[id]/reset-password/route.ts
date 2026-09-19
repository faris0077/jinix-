import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireStaffCaller } from '../../../_auth';
import { phoneToInitialPassword } from '@/lib/auth-helpers';

/**
 * POST /api/admin/users/:id/reset-password
 * Body: { newPassword?: string } — omit to reset back to the user's phone number.
 * Only a signed-in warden or director may call this.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireStaffCaller(request);
  if ('error' in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin client unavailable.' }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const requestedPassword = typeof body?.newPassword === 'string' ? body.newPassword : null;

  const { data: target, error: findError } = await supabaseAdmin
    .from('users')
    .select('id, auth_user_id, phone, name')
    .eq('id', id)
    .maybeSingle();

  if (findError || !target) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  if (!target.auth_user_id) {
    return NextResponse.json({ error: 'This user has no linked login account yet.' }, { status: 409 });
  }

  const newPassword = requestedPassword && requestedPassword.length >= 6
    ? requestedPassword
    : phoneToInitialPassword(target.phone);

  if (!newPassword) {
    return NextResponse.json(
      { error: 'No password provided and no phone number on file to reset to.' },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(target.auth_user_id, {
    password: newPassword,
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newPassword });
}
