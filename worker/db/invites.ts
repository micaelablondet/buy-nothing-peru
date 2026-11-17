export type InviteRow = {
  id: string;
  code: string;
  active: number;
  created_at: string;
  deactivated_at: string | null;
};

export async function listInvites(db: D1Database): Promise<InviteRow[]> {
  const rows = await db
    .prepare(
      `SELECT id, code, active, created_at, deactivated_at
       FROM invite_codes
       ORDER BY created_at DESC`,
    )
    .all<InviteRow>();
  return rows.results ?? [];
}

/** AUTH-05: newest active invite code (shared building code, not per-person). */
export async function findLatestActiveInviteCode(
  db: D1Database,
): Promise<string | null> {
  const row = await db
    .prepare(
      `SELECT code FROM invite_codes
       WHERE active = 1 AND deactivated_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .first<{ code: string }>();
  return row?.code ?? null;
}

export async function createInvite(
  db: D1Database,
  input: { id: string; code: string; nowIso: string },
): Promise<InviteRow> {
  await db
    .prepare(
      `INSERT INTO invite_codes (id, code, active, created_at, deactivated_at)
       VALUES (?, ?, 1, ?, NULL)`,
    )
    .bind(input.id, input.code.trim(), input.nowIso)
    .run();
  const row = await db
    .prepare(
      `SELECT id, code, active, created_at, deactivated_at FROM invite_codes WHERE id = ?`,
    )
    .bind(input.id)
    .first<InviteRow>();
  if (!row) {
    throw new Error("invite_create_failed");
  }
  return row;
}

export async function setInviteActive(
  db: D1Database,
  id: string,
  active: boolean,
  nowIso: string,
): Promise<InviteRow | null> {
  await db
    .prepare(
      `UPDATE invite_codes
       SET active = ?, deactivated_at = CASE WHEN ? = 0 THEN ? ELSE NULL END
       WHERE id = ?`,
    )
    .bind(active ? 1 : 0, active ? 1 : 0, nowIso, id)
    .run();
  return db
    .prepare(
      `SELECT id, code, active, created_at, deactivated_at FROM invite_codes WHERE id = ?`,
    )
    .bind(id)
    .first<InviteRow>();
}
