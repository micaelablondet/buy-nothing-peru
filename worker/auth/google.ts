import type { PendingGoogleIdentity, WorkerEnv } from "../env";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

/** AUTH-01: only openid email profile. */
export const GOOGLE_SCOPES = "openid email profile";

export function googleRedirectUri(env: WorkerEnv): string {
  const base = env.APP_BASE_URL.replace(/\/$/, "");
  return `${base}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(env: WorkerEnv, state: string): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(env),
    response_type: "code",
    scope: GOOGLE_SCOPES,
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCode(
  env: WorkerEnv,
  code: string,
): Promise<PendingGoogleIdentity> {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: googleRedirectUri(env),
    grant_type: "authorization_code",
  });

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!tokenRes.ok) {
    throw new Error("google_token_failed");
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) {
    throw new Error("google_token_missing");
  }

  const userRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  if (!userRes.ok) {
    throw new Error("google_userinfo_failed");
  }
  const profile = (await userRes.json()) as {
    sub?: string;
    email?: string;
    given_name?: string;
    name?: string;
  };
  if (!profile.sub || !profile.email) {
    throw new Error("google_profile_incomplete");
  }

  return {
    googleSub: profile.sub,
    email: profile.email,
    displayName: profile.given_name || profile.name || profile.email.split("@")[0],
  };
}

export function googleConfigured(env: WorkerEnv): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.SESSION_SECRET);
}
