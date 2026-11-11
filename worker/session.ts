import { SignJWT, jwtVerify } from "jose";
import type { PendingGoogleIdentity, SessionUser, WorkerEnv } from "./env";

const SESSION_COOKIE = "barrio_session";
const PENDING_COOKIE = "barrio_pending";
const SESSION_TTL_SEC = 60 * 60 * 24 * 30; // AUTH-03: 30 days
const PENDING_TTL_SEC = 60 * 30;

function secretKey(secret: string) {
  return new TextEncoder().encode(secret);
}

function isSecure(env: WorkerEnv): boolean {
  return env.ENVIRONMENT === "production" || env.APP_BASE_URL.startsWith("https");
}

function cookieBase(env: WorkerEnv, name: string, value: string, maxAge: number): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (isSecure(env)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export async function signSessionToken(
  user: SessionUser,
  secret: string,
): Promise<string> {
  return new SignJWT({
    sub: user.id,
    displayName: user.displayName,
    email: user.email,
    districtId: user.districtId,
    whatsapp: user.whatsapp,
    inviteAcceptedAt: user.inviteAcceptedAt,
    isAdmin: user.isAdmin,
    profileComplete: user.profileComplete,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(secretKey(secret));
}

export async function readSession(
  cookieHeader: string | null,
  secret: string,
): Promise<SessionUser | null> {
  const raw = readCookie(cookieHeader, SESSION_COOKIE);
  if (!raw) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(raw, secretKey(secret));
    if (typeof payload.sub !== "string" || typeof payload.displayName !== "string") {
      return null;
    }
    return {
      id: payload.sub,
      displayName: payload.displayName,
      email: typeof payload.email === "string" ? payload.email : null,
      districtId: typeof payload.districtId === "string" ? payload.districtId : null,
      whatsapp: typeof payload.whatsapp === "string" ? payload.whatsapp : null,
      inviteAcceptedAt:
        typeof payload.inviteAcceptedAt === "string" ? payload.inviteAcceptedAt : null,
      isAdmin: Boolean(payload.isAdmin),
      profileComplete: Boolean(payload.profileComplete),
    };
  } catch {
    return null;
  }
}

export async function sessionSetCookie(
  env: WorkerEnv,
  user: SessionUser,
): Promise<string> {
  const token = await signSessionToken(user, env.SESSION_SECRET);
  return cookieBase(env, SESSION_COOKIE, token, SESSION_TTL_SEC);
}

export function clearSessionCookie(env: WorkerEnv): string {
  return cookieBase(env, SESSION_COOKIE, "", 0);
}

export async function signPendingToken(
  identity: PendingGoogleIdentity,
  secret: string,
): Promise<string> {
  return new SignJWT({
    googleSub: identity.googleSub,
    email: identity.email,
    displayName: identity.displayName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PENDING_TTL_SEC}s`)
    .sign(secretKey(secret));
}

export async function readPending(
  cookieHeader: string | null,
  secret: string,
): Promise<PendingGoogleIdentity | null> {
  const raw = readCookie(cookieHeader, PENDING_COOKIE);
  if (!raw) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(raw, secretKey(secret));
    if (
      typeof payload.googleSub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.displayName !== "string"
    ) {
      return null;
    }
    return {
      googleSub: payload.googleSub,
      email: payload.email,
      displayName: payload.displayName,
    };
  } catch {
    return null;
  }
}

export async function pendingSetCookie(
  env: WorkerEnv,
  identity: PendingGoogleIdentity,
): Promise<string> {
  const token = await signPendingToken(identity, env.SESSION_SECRET);
  return cookieBase(env, PENDING_COOKIE, token, PENDING_TTL_SEC);
}

export function clearPendingCookie(env: WorkerEnv): string {
  return cookieBase(env, PENDING_COOKIE, "", 0);
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) {
    return null;
  }
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}
