import type { SessionUser } from "./env";

const COOKIE = "barrio_session";

/** M0 stub session only. Real signed cookies arrive in M1 (AUTH). */
export function readStubSession(cookieHeader: string | null): SessionUser | null {
  if (!cookieHeader) {
    return null;
  }
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`));
  if (!match) {
    return null;
  }
  const raw = decodeURIComponent(match.slice(COOKIE.length + 1));
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.id || !parsed?.firstName) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function stubSessionCookie(user: SessionUser): string {
  const value = encodeURIComponent(JSON.stringify(user));
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export const STUB_USERS: Record<string, SessionUser> = {
  mica: {
    id: "user-mica",
    firstName: "Mica",
    districtId: "dist-barranco",
    isAdmin: true,
  },
};
