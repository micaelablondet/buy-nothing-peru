import { isAdminEmail } from "./admin";

/**
 * AUTH-02 + DEC-30: whether a new Google signup must enter an invite code.
 * Admins in ADMIN_EMAILS skip only when Google email_verified is true.
 */
export function mustEnterInviteCode(
  inviteRequired: boolean,
  email: string | null | undefined,
  adminEmails: string,
  emailVerified: boolean,
): boolean {
  if (!inviteRequired) {
    return false;
  }
  if (isAdminEmail(email, adminEmails, emailVerified)) {
    return false;
  }
  return true;
}
