/** Thin notification inserts for RESP/HAND (inbox UI is M4). */

export async function insertNotification(
  db: D1Database,
  input: {
    id: string;
    userId: string;
    type: "nuevo_interesado" | "nueva_oferta" | "te_eligieron" | "recordatorio";
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
