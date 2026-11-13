import { isPostCategory } from "../domain/categories";
import {
  applyPostTransition,
  shouldExpire,
  type PostStatus,
} from "../domain/postStateMachine";

export type PostRow = {
  id: string;
  author_id: string;
  type: "regalo" | "pido";
  status: PostStatus;
  title: string;
  description: string;
  category: string | null;
  district_id: string;
  created_at: string;
  expires_at: string | null;
  chosen_response_id: string | null;
  chosen_at: string | null;
  delivered_at: string | null;
  withdrawn_at: string | null;
  received_confirmed_at: string | null;
  disc_answer: string | null;
  author_display_name: string | null;
  author_first_name: string;
  district_name: string;
};

const POST_SELECT = `SELECT p.id, p.author_id, p.type, p.status, p.title, p.description, p.category,
              p.district_id, p.created_at, p.expires_at, p.chosen_response_id, p.chosen_at,
              p.delivered_at, p.withdrawn_at, p.received_confirmed_at, p.disc_answer,
              u.display_name AS author_display_name, u.first_name AS author_first_name,
              d.name AS district_name
       FROM posts p
       JOIN users u ON u.id = p.author_id
       JOIN districts d ON d.id = p.district_id`;

export type PhotoRow = {
  id: string;
  post_id: string;
  r2_key: string;
  position: number;
};

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 500;
const POST_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function validatePostInput(input: {
  type: string;
  title: string;
  description: string;
  category: string;
  photoCount: number;
}): { ok: true } | { ok: false; message: string } {
  if (input.type !== "regalo" && input.type !== "pido") {
    return { ok: false, message: "Tipo de publicación inválido." };
  }
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || title.length > TITLE_MAX) {
    return {
      ok: false,
      message: `El título es obligatorio (máx. ${TITLE_MAX} caracteres).`,
    };
  }
  if (!description || description.length > DESCRIPTION_MAX) {
    return {
      ok: false,
      message: `La descripción es obligatoria (máx. ${DESCRIPTION_MAX} caracteres).`,
    };
  }
  if (!isPostCategory(input.category)) {
    return { ok: false, message: "Elige una categoría válida." };
  }
  if (input.type === "regalo" && (input.photoCount < 1 || input.photoCount > 3)) {
    return { ok: false, message: "Un Regalo necesita de 1 a 3 fotos." };
  }
  if (input.type === "pido" && input.photoCount > 1) {
    return { ok: false, message: "Un Pido admite como máximo 1 foto." };
  }
  return { ok: true };
}

export async function createPost(
  db: D1Database,
  input: {
    id: string;
    authorId: string;
    type: "regalo" | "pido";
    title: string;
    description: string;
    category: string;
    districtId: string;
    photos: { id: string; r2Key: string; position: number }[];
    nowIso: string;
  },
): Promise<PostRow> {
  const expiresAt = new Date(
    new Date(input.nowIso).getTime() + POST_TTL_MS,
  ).toISOString();

  const statements = [
    db
      .prepare(
        `INSERT INTO posts (
           id, author_id, type, status, title, description, category, district_id,
           created_at, expires_at, chosen_response_id, delivered_at, withdrawn_at, chosen_at
         ) VALUES (?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`,
      )
      .bind(
        input.id,
        input.authorId,
        input.type,
        input.title.trim(),
        input.description.trim(),
        input.category,
        input.districtId,
        input.nowIso,
        expiresAt,
      ),
    ...input.photos.map((photo) =>
      db
        .prepare(
          `INSERT INTO post_photos (id, post_id, r2_key, position, created_at)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(photo.id, input.id, photo.r2Key, photo.position, input.nowIso),
    ),
  ];
  await db.batch(statements);
  const row = await findPostById(db, input.id);
  if (!row) {
    throw new Error("post_create_failed");
  }
  return row;
}

export async function findPostById(
  db: D1Database,
  id: string,
): Promise<PostRow | null> {
  return db
    .prepare(`${POST_SELECT} WHERE p.id = ?`)
    .bind(id)
    .first<PostRow>();
}

export async function listFeed(
  db: D1Database,
  input: {
    type: "regalo" | "pido";
    districtId: string;
    category?: string | null;
    limit: number;
  },
): Promise<PostRow[]> {
  const limit = Math.min(Math.max(input.limit, 1), 100);
  if (input.category) {
    const rows = await db
      .prepare(
        `${POST_SELECT}
         WHERE p.status = 'open' AND p.type = ? AND p.district_id = ? AND p.category = ?
         ORDER BY p.created_at DESC
         LIMIT ?`,
      )
      .bind(input.type, input.districtId, input.category, limit)
      .all<PostRow>();
    return rows.results ?? [];
  }
  const rows = await db
    .prepare(
      `${POST_SELECT}
       WHERE p.status = 'open' AND p.type = ? AND p.district_id = ?
       ORDER BY p.created_at DESC
       LIMIT ?`,
    )
    .bind(input.type, input.districtId, limit)
    .all<PostRow>();
  return rows.results ?? [];
}

export async function listMyPosts(
  db: D1Database,
  authorId: string,
): Promise<PostRow[]> {
  const rows = await db
    .prepare(
      `${POST_SELECT}
       WHERE p.author_id = ?
       ORDER BY p.created_at DESC`,
    )
    .bind(authorId)
    .all<PostRow>();
  return rows.results ?? [];
}

export async function listPhotosForPost(
  db: D1Database,
  postId: string,
): Promise<PhotoRow[]> {
  const rows = await db
    .prepare(
      `SELECT id, post_id, r2_key, position FROM post_photos
       WHERE post_id = ? ORDER BY position ASC`,
    )
    .bind(postId)
    .all<PhotoRow>();
  return rows.results ?? [];
}

export async function listCoverPhotos(
  db: D1Database,
  postIds: string[],
): Promise<Map<string, PhotoRow>> {
  const map = new Map<string, PhotoRow>();
  if (postIds.length === 0) {
    return map;
  }
  const placeholders = postIds.map(() => "?").join(",");
  const rows = await db
    .prepare(
      `SELECT id, post_id, r2_key, position FROM post_photos
       WHERE post_id IN (${placeholders}) AND position = 1`,
    )
    .bind(...postIds)
    .all<PhotoRow>();
  for (const row of rows.results ?? []) {
    map.set(row.post_id, row);
  }
  return map;
}

export async function withdrawPost(
  db: D1Database,
  postId: string,
  actorId: string,
  nowIso: string,
): Promise<
  | { ok: true; post: PostRow }
  | { ok: false; error: "not_found" | "forbidden" | "illegal_transition" }
> {
  const post = await findPostById(db, postId);
  if (!post) {
    return { ok: false, error: "not_found" };
  }
  if (post.author_id !== actorId) {
    return { ok: false, error: "forbidden" };
  }
  const next = applyPostTransition(post.status, "withdraw");
  if (!next.ok) {
    return { ok: false, error: "illegal_transition" };
  }
  await db.batch([
    db
      .prepare(
        `UPDATE posts SET status = ?, withdrawn_at = ? WHERE id = ?`,
      )
      .bind(next.to, nowIso, postId),
    db
      .prepare(
        `UPDATE responses SET status = 'not_chosen'
         WHERE post_id = ? AND status = 'active'`,
      )
      .bind(postId),
  ]);
  const updated = await findPostById(db, postId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, post: updated };
}

/** SAFE-03: admin remove via postStateMachine only. */
export async function removePost(
  db: D1Database,
  postId: string,
): Promise<
  | { ok: true; post: PostRow }
  | { ok: false; error: "not_found" | "illegal_transition" }
> {
  const post = await findPostById(db, postId);
  if (!post) {
    return { ok: false, error: "not_found" };
  }
  const next = applyPostTransition(post.status, "remove");
  if (!next.ok) {
    return { ok: false, error: "illegal_transition" };
  }
  await db
    .prepare(`UPDATE posts SET status = ? WHERE id = ?`)
    .bind(next.to, postId)
    .run();
  const updated = await findPostById(db, postId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, post: updated };
}

export async function setDiscAnswer(
  db: D1Database,
  postId: string,
  answer: string,
): Promise<
  | { ok: true; post: PostRow }
  | { ok: false; error: "not_found" | "not_delivered" }
> {
  const post = await findPostById(db, postId);
  if (!post) {
    return { ok: false, error: "not_found" };
  }
  if (post.status !== "delivered") {
    return { ok: false, error: "not_delivered" };
  }
  await db
    .prepare(`UPDATE posts SET disc_answer = ? WHERE id = ?`)
    .bind(answer, postId)
    .run();
  const updated = await findPostById(db, postId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, post: updated };
}

/** Idempotent expiry job (POST-06). Returns expired post ids for ANLY-01. */
export async function expireOpenPosts(
  db: D1Database,
  nowIso: string,
): Promise<{ expired: number; ids: string[] }> {
  const candidates = await db
    .prepare(
      `SELECT id, status, expires_at FROM posts WHERE status = 'open' AND expires_at IS NOT NULL AND expires_at <= ?`,
    )
    .bind(nowIso)
    .all<{ id: string; status: PostStatus; expires_at: string | null }>();

  let expired = 0;
  const ids: string[] = [];
  for (const row of candidates.results ?? []) {
    if (!shouldExpire(row.status, row.expires_at, nowIso)) {
      continue;
    }
    const next = applyPostTransition(row.status, "expire");
    if (!next.ok) {
      continue;
    }
    const result = await db
      .prepare(
        `UPDATE posts SET status = ?
         WHERE id = ? AND status = 'open'`,
      )
      .bind(next.to, row.id)
      .run();
    if ((result.meta.changes ?? 0) > 0) {
      expired += 1;
      ids.push(row.id);
    }
  }
  return { expired, ids };
}

export function publicAuthorName(row: PostRow): string {
  return (row.author_display_name?.trim() || row.author_first_name).trim();
}
