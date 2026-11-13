import { isReportReason, type ReportReason } from "../lib/reportReasons";

export type ReportRow = {
  id: string;
  reporter_id: string;
  post_id: string;
  response_id: string | null;
  reason: string;
  text: string | null;
  status: string;
  created_at: string;
  post_title: string;
  reporter_name: string;
};

export function validateReportInput(input: {
  reason: string;
  text?: string | null;
  postId: string;
  responseId?: string | null;
}):
  | { ok: true; reason: ReportReason; text: string | null }
  | { ok: false; message: string } {
  if (!input.postId) {
    return { ok: false, message: "Falta la publicación." };
  }
  if (!isReportReason(input.reason)) {
    return { ok: false, message: "Elige un motivo válido." };
  }
  const text = input.text?.trim() || null;
  if (text && text.length > 500) {
    return { ok: false, message: "El texto es demasiado largo (máx. 500)." };
  }
  return { ok: true, reason: input.reason, text };
}

export async function createReport(
  db: D1Database,
  input: {
    id: string;
    reporterId: string;
    postId: string;
    responseId: string | null;
    reason: ReportReason;
    text: string | null;
    nowIso: string;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO reports (id, reporter_id, post_id, response_id, reason, text, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?)`,
    )
    .bind(
      input.id,
      input.reporterId,
      input.postId,
      input.responseId,
      input.reason,
      input.text,
      input.nowIso,
    )
    .run();
}

export async function listOpenReports(db: D1Database): Promise<ReportRow[]> {
  const rows = await db
    .prepare(
      `SELECT r.id, r.reporter_id, r.post_id, r.response_id, r.reason, r.text,
              r.status, r.created_at, p.title AS post_title,
              COALESCE(u.display_name, u.first_name) AS reporter_name
       FROM reports r
       JOIN posts p ON p.id = r.post_id
       JOIN users u ON u.id = r.reporter_id
       WHERE r.status = 'open'
       ORDER BY r.created_at DESC
       LIMIT 100`,
    )
    .all<ReportRow>();
  return rows.results ?? [];
}
