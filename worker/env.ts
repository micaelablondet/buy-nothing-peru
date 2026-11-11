export type WorkerEnv = {
  DB: D1Database;
  PHOTOS: R2Bucket;
  ASSETS: Fetcher;
  APP_NAME: string;
  INVITE_REQUIRED: string;
  ENVIRONMENT: string;
  /** Set in production for signing session cookies (M1). */
  SESSION_SECRET?: string;
};

export type SessionUser = {
  id: string;
  firstName: string;
  districtId: string | null;
  isAdmin: boolean;
};
