/**
 * Shared helpers for the real-login system. Used by both the browser app
 * and server-only scripts/API routes, so the password-derivation rule lives
 * in exactly one place.
 */

/**
 * Turns a phone number like "+91 98765 43210" into the initial account
 * password: the last 10 digits, no spaces or symbols ("9876543210").
 *
 * This is intentionally a WEAK, guessable password (a phone number is often
 * known to family, roommates, or classmates). It exists only so first login
 * is friction-free; every account can change it immediately afterward via
 * the "Change Password" action in the header. Never use this scheme for
 * anything that isn't meant to be reset on first use.
 */
export function phoneToInitialPassword(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return null; // too short to be a usable Supabase password
  return digits.slice(-10);
}
