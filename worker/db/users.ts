import { isAdminEmail } from "../lib/admin";
import type { SessionUser, WorkerEnv } from "../env";
import { withdrawPost } from "./posts";

export type UserRow = {
  id: string;
  google_sub: string | null;
  email: string | null;
  first_name: string;
  display_name: string | null;
  whatsapp: string | null;
  district_id: string | null;
  invite_accepted_at: string | null;
  created_at: string;
  deleted_at: string | null;
};

export function rowToSession(row: UserRow, adminEmails: string): SessionUser {
  const displayName = row.display_name?.trim() || row.first_name;
  const whatsapp = row.whatsapp;
  return {
    id: row.id,
    displayName,
    email: row.email,
    districtId: row.district_id,
    whatsapp,
    inviteAcceptedAt: row.invite_accepted_at,
    isAdmin: isAdminEmail(row.email, adminEmails),
    profileComplete: Boolean(whatsapp && row.district_id),
  };
}

export async function findUserByGoogleSub(
  db: D1Database,
  googleSub: string,
): Promise<UserRow | null> {
  return db
    .prepare(
      `SELECT id, google_sub, email, first_name, display_name, whatsapp, district_id,
              invite_accepted_at, created_at, deleted_at
       FROM users WHERE google_sub = ? AND deleted_at IS NULL`,
    )
    .bind(googleSub)
    .first<UserRow>();
}

export async function findUserById(
  db: D1Database,
  id: string,
): Promise<UserRow | null> {
  return db
    .prepare(
      `SELECT id, google_sub, email, first_name, display_name, whatsapp, district_id,
              invite_accepted_at, created_at, deleted_at
       FROM users WHERE id = ? AND deleted_at IS NULL`,
    )
    .bind(id)
    .first<UserRow>();
}

export async function createUser(
  db: D1Database,
  input: {
    id: string;
    googleSub: string;
    email: string;
    displayName: string;
    inviteAcceptedAt: string | null;
    districtId: string;
  },
): Promise<UserRow> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO users (
         id, google_sub, email, first_name, display_name, whatsapp, district_id,
         is_admin, created_at, deleted_at, invite_accepted_at
       ) VALUES (?, ?, ?, ?, ?, NULL, ?, 0, ?, NULL, ?)`,
    )
    .bind(
      input.id,
      input.googleSub,
      input.email,
      input.displayName,
      input.displayName,
      input.districtId,
      now,
      input.inviteAcceptedAt,
    )
    .run();
  const row = await findUserById(db, input.id);
  if (!row) {
    throw new Error("user_create_failed");
  }
  return row;
}

export async function updateProfile(
  db: D1Database,
  userId: string,
  input: { displayName: string; whatsapp: string; districtId: string },
): Promise<UserRow | null> {
  await db
    .prepare(
      `UPDATE users
       SET display_name = ?, first_name = ?, whatsapp = ?, district_id = ?
       WHERE id = ? AND deleted_at IS NULL`,
    )
    .bind(
      input.displayName,
      input.displayName,
      input.whatsapp,
      input.districtId,
      userId,
    )
    .run();
  return findUserById(db, userId);
}

/** PROF-04: soft-delete personal data; withdraw open posts; anonymize label. */
export async function deleteAccount(db: D1Database, userId: string): Promise<void> {
  const now = new Date().toISOString();
  const openOrChosen = await db
    .prepare(
      `SELECT id FROM posts WHERE author_id = ? AND status IN ('open', 'chosen')`,
    )
    .bind(userId)
    .all<{ id: string }>();
  for (const row of openOrChosen.results ?? []) {
    await withdrawPost(db, row.id, userId, now);
  }
  await db
    .prepare(
      `UPDATE users SET
         google_sub = NULL,
         email = NULL,
         first_name = 'Ex vecino',
         display_name = 'Ex vecino',
         whatsapp = NULL,
         deleted_at = ?
       WHERE id = ?`,
    )
    .bind(now, userId)
    .run();
}

export async function findActiveInvite(
  db: D1Database,
  code: string,
): Promise<{ id: string; code: string; active: number } | null> {
  return db
    .prepare(
      `SELECT id, code, active FROM invite_codes
       WHERE lower(code) = lower(?) AND active = 1 AND deactivated_at IS NULL`,
    )
    .bind(code.trim())
    .first<{ id: string; code: string; active: number }>();
}

export function requireEnvSecret(env: WorkerEnv): void {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 16) {
    throw new Error("SESSION_SECRET missing or too short");
  }
}
