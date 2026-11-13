/** NOTIF-04: idempotent 48h nudge for open posts with a first response. */

import {
  hasRecordatorioForPost,
  insertNotification,
} from "../db/notifications";

const NUDGE_MS = 48 * 60 * 60 * 1000;

export type NudgeCandidate = {
  id: string;
  author_id: string;
  status: string;
  nudge_sent_at: string | null;
  first_response_at: string;
};

export function shouldNudge(
  candidate: NudgeCandidate,
  nowIso: string,
): boolean {
  if (candidate.status !== "open") {
    return false;
  }
  if (candidate.nudge_sent_at) {
    return false;
  }
  const first = new Date(candidate.first_response_at).getTime();
  const now = new Date(nowIso).getTime();
  if (Number.isNaN(first) || Number.isNaN(now)) {
    return false;
  }
  return now - first >= NUDGE_MS;
}

export async function runNudgeJob(
  db: D1Database,
  nowIso: string,
): Promise<{ nudged: number }> {
  const rows = await db
    .prepare(
      `SELECT p.id, p.author_id, p.status, p.nudge_sent_at,
              MIN(r.created_at) AS first_response_at
       FROM posts p
       JOIN responses r ON r.post_id = p.id
       WHERE p.status = 'open' AND p.nudge_sent_at IS NULL
       GROUP BY p.id
       HAVING first_response_at IS NOT NULL`,
    )
    .all<NudgeCandidate>();

  let nudged = 0;
  for (const row of rows.results ?? []) {
    if (!shouldNudge(row, nowIso)) {
      continue;
    }
    if (await hasRecordatorioForPost(db, row.id)) {
      await db
        .prepare(`UPDATE posts SET nudge_sent_at = ? WHERE id = ? AND nudge_sent_at IS NULL`)
        .bind(nowIso, row.id)
        .run();
      continue;
    }

    const marked = await db
      .prepare(
        `UPDATE posts SET nudge_sent_at = ?
         WHERE id = ? AND status = 'open' AND nudge_sent_at IS NULL`,
      )
      .bind(nowIso, row.id)
      .run();
    if ((marked.meta.changes ?? 0) === 0) {
      continue;
    }

    await insertNotification(db, {
      id: crypto.randomUUID(),
      userId: row.author_id,
      type: "recordatorio",
      postId: row.id,
      nowIso,
    });
    nudged += 1;
  }
  return { nudged };
}
