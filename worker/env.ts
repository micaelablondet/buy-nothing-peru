export type WorkerEnv = {
  DB: D1Database;
  PHOTOS: R2Bucket;
  ASSETS: Fetcher;
  APP_NAME: string;
  INVITE_REQUIRED: string;
  ENVIRONMENT: string;
  /** Public origin, e.g. https://barrio.example.com or http://127.0.0.1:8787 */
  APP_BASE_URL: string;
  /** Comma-separated Google emails with admin access (AUTH-04). */
  ADMIN_EMAILS: string;
  /** Required in production; HS256 secret for session + pending-auth JWTs. */
  SESSION_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  /** Optional: allow POST /api/dev/session when "true" and not production. */
  DEV_STUB_AUTH?: string;
  /** Web Push VAPID keys (optional; inbox works without them). */
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
};

export type SessionUser = {
  id: string;
  displayName: string;
  email: string | null;
  districtId: string | null;
  whatsapp: string | null;
  inviteAcceptedAt: string | null;
  isAdmin: boolean;
  profileComplete: boolean;
};

export type PendingGoogleIdentity = {
  googleSub: string;
  email: string;
  displayName: string;
};
