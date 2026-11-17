/** AUTH-05: carry `/entrar?codigo=` into the invite step (same tab). */

const STORAGE_KEY = "barrio_invite_codigo";

export function stashInviteCodigo(raw: string | null | undefined): void {
  const code = raw?.trim() ?? "";
  if (!code) {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Private mode / blocked storage — InvitePage can still read ?codigo=.
  }
}

export function readStashedInviteCodigo(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}
