export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
};

export async function upsertPushSubscription(
  db: D1Database,
  input: {
    id: string;
    userId: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    nowIso: string;
  },
): Promise<void> {
  const existing = await db
    .prepare(`SELECT id FROM push_subscriptions WHERE endpoint = ?`)
    .bind(input.endpoint)
    .first<{ id: string }>();
  if (existing) {
    await db
      .prepare(
        `UPDATE push_subscriptions
         SET user_id = ?, p256dh = ?, auth = ?, created_at = ?
         WHERE id = ?`,
      )
      .bind(input.userId, input.p256dh, input.auth, input.nowIso, existing.id)
      .run();
    return;
  }
  await db
    .prepare(
      `INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.id,
      input.userId,
      input.endpoint,
      input.p256dh,
      input.auth,
      input.nowIso,
    )
    .run();
}

export async function listPushForUser(
  db: D1Database,
  userId: string,
): Promise<PushSubscriptionRow[]> {
  const rows = await db
    .prepare(
      `SELECT id, user_id, endpoint, p256dh, auth, created_at
       FROM push_subscriptions WHERE user_id = ?`,
    )
    .bind(userId)
    .all<PushSubscriptionRow>();
  return rows.results ?? [];
}

export async function deletePushByEndpoint(
  db: D1Database,
  endpoint: string,
): Promise<void> {
  await db
    .prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`)
    .bind(endpoint)
    .run();
}
