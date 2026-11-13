export async function recordEvent(
  db: D1Database,
  input: {
    id: string;
    userId: string | null;
    name: string;
    props?: Record<string, unknown>;
    nowIso: string;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO events (id, user_id, name, props, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(
      input.id,
      input.userId,
      input.name,
      input.props ? JSON.stringify(input.props) : null,
      input.nowIso,
    )
    .run();
}
