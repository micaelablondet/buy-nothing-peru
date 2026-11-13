/** PUB-04: safe post-auth return paths (open redirect guard). */

const PUBLIC_POST = /^\/p\/[A-Za-z0-9_-]+$/;
const APP_PATH = /^\/app(?:\/.*)?$/;

export function sanitizeReturnPath(
  raw: string | null | undefined,
): string | null {
  if (!raw) {
    return null;
  }
  let path = raw.trim();
  if (!path) {
    return null;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      path = `${url.pathname}${url.search}`;
    } catch {
      return null;
    }
  }
  if (!path.startsWith("/") || path.startsWith("//")) {
    return null;
  }
  const qIndex = path.indexOf("?");
  const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const search = qIndex >= 0 ? path.slice(qIndex) : "";
  if (PUBLIC_POST.test(pathname) || pathname === "/app" || APP_PATH.test(pathname)) {
    return `${pathname}${search}`;
  }
  return null;
}

export function readReturnPath(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }
  const raw = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("barrio_next="))
    ?.slice("barrio_next=".length);
  if (!raw) {
    return null;
  }
  try {
    return sanitizeReturnPath(decodeURIComponent(raw));
  } catch {
    return sanitizeReturnPath(raw);
  }
}

function cookieSecure(env: { ENVIRONMENT: string; APP_BASE_URL: string }): boolean {
  return env.ENVIRONMENT === "production" || env.APP_BASE_URL.startsWith("https");
}

export function returnPathSetCookie(
  env: { ENVIRONMENT: string; APP_BASE_URL: string },
  path: string,
): string {
  const parts = [
    `barrio_next=${encodeURIComponent(path)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=1800",
  ];
  if (cookieSecure(env)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function clearReturnPathCookie(env: {
  ENVIRONMENT: string;
  APP_BASE_URL: string;
}): string {
  const parts = [
    "barrio_next=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (cookieSecure(env)) {
    parts.push("Secure");
  }
  return parts.join("; ");
}
