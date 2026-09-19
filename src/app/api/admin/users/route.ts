import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireStaffCaller } from '../_auth';
import { phoneToInitialPassword } from '@/lib/auth-helpers';
import type { UserRole } from '@/lib/mock-data';

/**
 * POST /api/admin/users
 * Creates a real Supabase Auth account + matching public.users row.
 * Only a signed-in warden or director may call this (enforced server-side —
 * the service_role key never reaches the browser).
 */
export async function POST(request: NextRequest) {
  const guard = await requireStaffCaller(request);
  if ('error' in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Admin client unavailable.' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, email, phone, role, roomNumber, block, course, year, parentPhone } = body as {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    roomNumber?: string;
    block?: string;
    course?: string;
    year?: string;
    parentPhone?: string;
  };

  if (!name || !email || !phone || !role) {
    return NextResponse.json({ error: 'name, email, phone, and role are required.' }, { status: 400 });
  }
  if (!['student', 'warden', 'director'].includes(role)) {
    return NextResponse.json({ error: 'role must be student, warden, or director.' }, { status: 400 });
  }

  const initialPassword = phoneToInitialPassword(phone);
  if (!initialPassword) {
    return NextResponse.json({ error: 'Phone number is too short to derive a password from.' }, { status: 400 });
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: initialPassword,
    email_confirm: true,
    user_metadata: { name, role },
  });
  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message ?? 'Could not create the account.' }, { status: 409 });
  }

  const appUserId = `${role}-${created.user.id.slice(0, 8)}`;
  const { error: insertError } = await supabaseAdmin.from('users').insert({
    id: appUserId,
    auth_user_id: created.user.id,
    name,
    email,
    role,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    room_number: roomNumber ?? null,
    block: block ?? null,
    course: course ?? null,
    year: year ?? null,
    phone,
    parent_phone: parentPhone ?? null,
    attendance_today: role === 'student' ? 'present' : null,
  });
  if (insertError) {
    // Roll back the orphaned auth account so retries don't collide on email.
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: appUserId,
    authUserId: created.user.id,
    initialPassword, // returned once so the admin can share it with the new user
  });
}
