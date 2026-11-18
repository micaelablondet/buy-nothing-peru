/**
 * AUTH-05: fixed WhatsApp invite share text (no per-person codes, no tracking).
 */

export function inviteShareLink(baseUrl: string, code: string | null): string {
  const base = baseUrl.replace(/\/$/, "");
  if (code) {
    return `${base}/entrar?codigo=${encodeURIComponent(code)}`;
  }
  return `${base}/entrar`;
}

export function inviteShareMessage(baseUrl: string, code: string | null): string {
  const link = inviteShareLink(baseUrl, code);
  return `¡Hola! Te invito a Barrio, una app para donar y pedir cosas en tu comunidad, sin precio. Entra aquí: ${link}`;
}

export function inviteShareWhatsAppUrl(
  baseUrl: string,
  code: string | null,
): string {
  return `https://wa.me/?text=${encodeURIComponent(
    inviteShareMessage(baseUrl, code),
  )}`;
}

/** Show menu item unless invites are required and there is no active code. */
export function shouldShowInviteShare(
  inviteRequired: boolean,
  code: string | null,
): boolean {
  if (!inviteRequired) {
    return true;
  }
  return Boolean(code);
}
