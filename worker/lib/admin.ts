/**
 * AUTH-04: allowlisted email is admin only when Google reported email_verified.
 * Unverified emails may sign in but are never admin (and never skip invite).
 */
export function isAdminEmail(
  email: string | null | undefined,
  allowlist: string,
  emailVerified: boolean,
): boolean {
  if (!emailVerified || !email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return allowlist
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}
