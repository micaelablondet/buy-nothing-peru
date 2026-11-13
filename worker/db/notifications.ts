/** Notifications inbox + nudge helpers (NOTIF-01/03/04). */

export type NotificationType =
  | "nuevo_interesado"
  | "nueva_oferta"
  | "te_eligieron"
  | "recordatorio";

export type NotificationRow = {
  id: string;
  user_id: string;
  type: NotificationType;
  post_id: string | null;
  read_at: string | null;
  created_at: string;
  post_title: string | null;
};

export async function insertNotification(
  db: D1Database,
  input: {
    id: string;
    userId: string;
    type: NotificationType;
    postId: string;
    nowIso: string;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO notifications (id, user_id, type, post_id, read_at, created_at)
       VALUES (?, ?, ?, ?, NULL, ?)`,
    )
    .bind(input.id, input.userId, input.type, input.postId, input.nowIso)
    .run();
}

export async function listNotifications(
  db: D1Database,
  userId: string,
  limit = 50,
): Promise<NotificationRow[]> {
  const rows = await db
    .prepare(
      `SELECT n.id, n.user_id, n.type, n.post_id, n.read_at, n.created_at,
              p.title AS post_title
       FROM notifications n
       LEFT JOIN posts p ON p.id = n.post_id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT ?`,
    )
    .bind(userId, limit)
    .all<NotificationRow>();
  return rows.results ?? [];
}

export async function countUnread(
  db: D1Database,
  userId: string,
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM notifications
       WHERE user_id = ? AND read_at IS NULL`,
    )
    .bind(userId)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function markNotificationRead(
  db: D1Database,
  input: { id: string; userId: string; nowIso: string },
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE notifications SET read_at = ?
       WHERE id = ? AND user_id = ? AND read_at IS NULL`,
    )
    .bind(input.nowIso, input.id, input.userId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function hasRecordatorioForPost(
  db: D1Database,
  postId: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT id FROM notifications
       WHERE post_id = ? AND type = 'recordatorio' LIMIT 1`,
    )
    .bind(postId)
    .first<{ id: string }>();
  return Boolean(row);
}
