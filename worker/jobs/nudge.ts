/** NOTIF-04: idempotent 48h nudge for open posts with a first response. */

import { recordEvent } from "../db/events";
import { hasRecordatorioForPost } from "../db/notifications";
import type { WorkerEnv } from "../env";
import { notifyUser } from "../lib/notify";

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
  env: WorkerEnv,
  nowIso: string,
): Promise<{ nudged: number }> {
  const rows = await env.DB.prepare(
    `SELECT p.id, p.author_id, p.status, p.nudge_sent_at,
            MIN(r.created_at) AS first_response_at
     FROM posts p
     JOIN responses r ON r.post_id = p.id
     WHERE p.status = 'open' AND p.nudge_sent_at IS NULL
     GROUP BY p.id
     HAVING first_response_at IS NOT NULL`,
  ).all<NudgeCandidate>();

  let nudged = 0;
  for (const row of rows.results ?? []) {
    if (!shouldNudge(row, nowIso)) {
      continue;
    }
    if (await hasRecordatorioForPost(env.DB, row.id)) {
      await env.DB.prepare(
        `UPDATE posts SET nudge_sent_at = ? WHERE id = ? AND nudge_sent_at IS NULL`,
      )
        .bind(nowIso, row.id)
        .run();
      continue;
    }

    const marked = await env.DB.prepare(
      `UPDATE posts SET nudge_sent_at = ?
       WHERE id = ? AND status = 'open' AND nudge_sent_at IS NULL`,
    )
      .bind(nowIso, row.id)
      .run();
    if ((marked.meta.changes ?? 0) === 0) {
      continue;
    }

    await notifyUser(env, {
      userId: row.author_id,
      type: "recordatorio",
      postId: row.id,
      nowIso,
    });
    await recordEvent(env.DB, {
      id: crypto.randomUUID(),
      userId: row.author_id,
      name: "nudge_sent",
      props: { postId: row.id },
      nowIso,
    });
    nudged += 1;
  }
  return { nudged };
}
