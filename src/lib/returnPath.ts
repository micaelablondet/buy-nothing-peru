/**
 * Client-side post-auth return path guard (mirrors worker/lib/returnPath.ts).
 * Rejects external URLs, protocol-relative "//", and backslash open-redirects.
 */
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
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    /%5c/i.test(path)
  ) {
    return null;
  }
  const qIndex = path.indexOf("?");
  const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const search = qIndex >= 0 ? path.slice(qIndex) : "";
  if (
    PUBLIC_POST.test(pathname) ||
    pathname === "/app" ||
    APP_PATH.test(pathname)
  ) {
    return `${pathname}${search}`;
  }
  return null;
}
