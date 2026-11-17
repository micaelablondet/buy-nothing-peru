import { isAdminEmail } from "./admin";

/**
 * AUTH-02 + DEC-30: whether a new Google signup must enter an invite code.
 * Admins in ADMIN_EMAILS skip so they can bootstrap codes in /admin.
 */
export function mustEnterInviteCode(
  inviteRequired: boolean,
  email: string | null | undefined,
  adminEmails: string,
): boolean {
  if (!inviteRequired) {
    return false;
  }
  if (isAdminEmail(email, adminEmails)) {
    return false;
  }
  return true;
}
