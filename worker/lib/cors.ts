import type { WorkerEnv } from "../env";

/** Vite default origins (SAFE-05, non-production only). */
export const VITE_DEV_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
] as const;

/**
 * SAFE-05: allow credentialed CORS only for APP_BASE_URL
 * (plus Vite when ENVIRONMENT is not production). Never reflect arbitrary Origin.
 */
export function resolveCorsOrigin(
  env: Pick<WorkerEnv, "APP_BASE_URL" | "ENVIRONMENT">,
  requestOrigin: string | undefined | null,
): string | null {
  if (!requestOrigin) {
    return null;
  }
  let appOrigin: string;
  try {
    appOrigin = new URL(env.APP_BASE_URL).origin;
  } catch {
    return null;
  }
  if (requestOrigin === appOrigin) {
    return requestOrigin;
  }
  if (
    env.ENVIRONMENT !== "production" &&
    (VITE_DEV_ORIGINS as readonly string[]).includes(requestOrigin)
  ) {
    return requestOrigin;
  }
  return null;
}
