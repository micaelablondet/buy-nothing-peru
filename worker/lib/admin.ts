export function isAdminEmail(email: string | null | undefined, allowlist: string): boolean {
  if (!email) {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return allowlist
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}
