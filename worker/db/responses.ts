import { applyPostTransition } from "../domain/postStateMachine";
import {
  MAX_ACTIVE_RESPONSES,
  applyResponseTransition,
  type ResponseStatus,
} from "../domain/responseStateMachine";
import { findPostById, type PostRow } from "./posts";

export type ResponseRow = {
  id: string;
  post_id: string;
  responder_id: string;
  status: ResponseStatus;
  note: string | null;
  photo_r2_key: string | null;
  created_at: string;
  withdrawn_at: string | null;
  display_name: string | null;
  first_name: string;
  district_name: string | null;
};

const NOTE_MAX = 140;

export function validateResponseNote(
  note: string,
): { ok: true; note: string } | { ok: false; message: string } {
  const trimmed = note.trim();
  if (trimmed.length > NOTE_MAX) {
    return {
      ok: false,
      message: `La nota puede tener hasta ${NOTE_MAX} caracteres.`,
    };
  }
  return { ok: true, note: trimmed };
}

export async function countActiveResponses(
  db: D1Database,
  postId: string,
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM responses WHERE post_id = ? AND status = 'active'`,
    )
    .bind(postId)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function findViewerResponse(
  db: D1Database,
  postId: string,
  userId: string,
): Promise<ResponseRow | null> {
  return db
    .prepare(
      `SELECT r.id, r.post_id, r.responder_id, r.status, r.note, r.photo_r2_key,
              r.created_at, r.withdrawn_at,
              u.display_name, u.first_name, d.name AS district_name
       FROM responses r
       JOIN users u ON u.id = r.responder_id
       LEFT JOIN districts d ON d.id = u.district_id
       WHERE r.post_id = ? AND r.responder_id = ?`,
    )
    .bind(postId, userId)
    .first<ResponseRow>();
}

export async function listActiveResponses(
  db: D1Database,
  postId: string,
): Promise<ResponseRow[]> {
  const rows = await db
    .prepare(
      `SELECT r.id, r.post_id, r.responder_id, r.status, r.note, r.photo_r2_key,
              r.created_at, r.withdrawn_at,
              u.display_name, u.first_name, d.name AS district_name
       FROM responses r
       JOIN users u ON u.id = r.responder_id
       LEFT JOIN districts d ON d.id = u.district_id
       WHERE r.post_id = ? AND r.status = 'active'
       ORDER BY r.created_at ASC`,
    )
    .bind(postId)
    .all<ResponseRow>();
  return rows.results ?? [];
}

export async function findResponseById(
  db: D1Database,
  id: string,
): Promise<ResponseRow | null> {
  return db
    .prepare(
      `SELECT r.id, r.post_id, r.responder_id, r.status, r.note, r.photo_r2_key,
              r.created_at, r.withdrawn_at,
              u.display_name, u.first_name, d.name AS district_name
       FROM responses r
       JOIN users u ON u.id = r.responder_id
       LEFT JOIN districts d ON d.id = u.district_id
       WHERE r.id = ?`,
    )
    .bind(id)
    .first<ResponseRow>();
}

export async function createResponse(
  db: D1Database,
  input: {
    id: string;
    postId: string;
    responderId: string;
    note: string;
    photoR2Key: string | null;
    nowIso: string;
  },
): Promise<
  | { ok: true; response: ResponseRow }
  | {
      ok: false;
      error:
        | "not_found"
        | "forbidden"
        | "already_active"
        | "capped"
        | "post_not_open";
    }
> {
  const post = await findPostById(db, input.postId);
  if (!post) {
    return { ok: false, error: "not_found" };
  }
  if (post.status !== "open") {
    return { ok: false, error: "post_not_open" };
  }
  if (post.author_id === input.responderId) {
    return { ok: false, error: "forbidden" };
  }

  const existing = await findViewerResponse(db, input.postId, input.responderId);
  if (existing?.status === "active") {
    return { ok: false, error: "already_active" };
  }

  const active = await countActiveResponses(db, input.postId);
  if (active >= MAX_ACTIVE_RESPONSES) {
    return { ok: false, error: "capped" };
  }

  if (existing) {
    await db
      .prepare(
        `UPDATE responses
         SET status = 'active', note = ?, photo_r2_key = ?, created_at = ?, withdrawn_at = NULL
         WHERE id = ?`,
      )
      .bind(input.note, input.photoR2Key, input.nowIso, existing.id)
      .run();
    const row = await findResponseById(db, existing.id);
    if (!row) {
      return { ok: false, error: "not_found" };
    }
    return { ok: true, response: row };
  }

  await db
    .prepare(
      `INSERT INTO responses (
         id, post_id, responder_id, status, note, photo_r2_key, created_at, withdrawn_at
       ) VALUES (?, ?, ?, 'active', ?, ?, ?, NULL)`,
    )
    .bind(
      input.id,
      input.postId,
      input.responderId,
      input.note,
      input.photoR2Key,
      input.nowIso,
    )
    .run();
  const row = await findResponseById(db, input.id);
  if (!row) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, response: row };
}

export async function withdrawResponse(
  db: D1Database,
  responseId: string,
  actorId: string,
  nowIso: string,
): Promise<
  | { ok: true; response: ResponseRow }
  | { ok: false; error: "not_found" | "forbidden" | "illegal_transition" }
> {
  const row = await findResponseById(db, responseId);
  if (!row) {
    return { ok: false, error: "not_found" };
  }
  if (row.responder_id !== actorId) {
    return { ok: false, error: "forbidden" };
  }
  const next = applyResponseTransition(row.status, "withdraw");
  if (!next.ok) {
    return { ok: false, error: "illegal_transition" };
  }
  await db
    .prepare(
      `UPDATE responses SET status = ?, withdrawn_at = ? WHERE id = ?`,
    )
    .bind(next.to, nowIso, responseId)
    .run();
  const updated = await findResponseById(db, responseId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, response: updated };
}

export async function chooseResponse(
  db: D1Database,
  input: {
    postId: string;
    responseId: string;
    actorId: string;
    nowIso: string;
  },
): Promise<
  | { ok: true; post: PostRow }
  | {
      ok: false;
      error:
        | "not_found"
        | "forbidden"
        | "illegal_transition"
        | "response_not_active";
    }
> {
  const post = await findPostById(db, input.postId);
  if (!post) {
    return { ok: false, error: "not_found" };
  }
  if (post.author_id !== input.actorId) {
    return { ok: false, error: "forbidden" };
  }
  const postNext = applyPostTransition(post.status, "choose");
  if (!postNext.ok) {
    return { ok: false, error: "illegal_transition" };
  }
  const response = await findResponseById(db, input.responseId);
  if (!response || response.post_id !== input.postId) {
    return { ok: false, error: "not_found" };
  }
  const respNext = applyResponseTransition(response.status, "choose");
  if (!respNext.ok) {
    return { ok: false, error: "response_not_active" };
  }

  await db.batch([
    db
      .prepare(
        `UPDATE posts
         SET status = ?, chosen_response_id = ?, chosen_at = ?
         WHERE id = ? AND status = 'open'`,
      )
      .bind(postNext.to, input.responseId, input.nowIso, input.postId),
    db
      .prepare(
        `UPDATE responses SET status = ? WHERE id = ? AND status = 'active'`,
      )
      .bind(respNext.to, input.responseId),
    db
      .prepare(
        `UPDATE responses SET status = 'not_chosen'
         WHERE post_id = ? AND status = 'active' AND id != ?`,
      )
      .bind(input.postId, input.responseId),
  ]);

  const updated = await findPostById(db, input.postId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, post: updated };
}

export async function markDelivered(
  db: D1Database,
  postId: string,
  nowIso: string,
): Promise<PostRow | null> {
  const post = await findPostById(db, postId);
  if (!post) {
    return null;
  }
  const next = applyPostTransition(post.status, "deliver");
  if (!next.ok) {
    return null;
  }
  await db
    .prepare(
      `UPDATE posts SET status = ?, delivered_at = ? WHERE id = ? AND status = 'chosen'`,
    )
    .bind(next.to, nowIso, postId)
    .run();
  return findPostById(db, postId);
}

export async function markReceived(
  db: D1Database,
  postId: string,
  nowIso: string,
): Promise<PostRow | null> {
  await db
    .prepare(
      `UPDATE posts SET received_confirmed_at = ?
       WHERE id = ? AND status IN ('chosen', 'delivered') AND received_confirmed_at IS NULL`,
    )
    .bind(nowIso, postId)
    .run();
  return findPostById(db, postId);
}

export function publicResponderName(row: ResponseRow): string {
  return (row.display_name?.trim() || row.first_name).trim();
}

export { MAX_ACTIVE_RESPONSES };
