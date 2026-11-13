/** SAFE-04: per-user post/response caps and per-IP auth limits. */

const POSTS_PER_DAY = 10;
const RESPONSES_PER_DAY = 30;
const AUTH_PER_HOUR = 30;

export function dayWindowStart(nowIso: string): string {
  const d = new Date(nowIso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}T00:00:00.000Z`;
}

export function hourWindowEnd(nowIso: string): string {
  const d = new Date(nowIso);
  d.setUTCMinutes(0, 0, 0);
  d.setUTCHours(d.getUTCHours() + 1);
  return d.toISOString();
}

export async function countUserPostsToday(
  db: D1Database,
  userId: string,
  nowIso: string,
): Promise<number> {
  const since = dayWindowStart(nowIso);
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM posts WHERE author_id = ? AND created_at >= ?`,
    )
    .bind(userId, since)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function countUserResponsesToday(
  db: D1Database,
  userId: string,
  nowIso: string,
): Promise<number> {
  const since = dayWindowStart(nowIso);
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM responses WHERE responder_id = ? AND created_at >= ?`,
    )
    .bind(userId, since)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function assertUnderPostLimit(
  db: D1Database,
  userId: string,
  nowIso: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const n = await countUserPostsToday(db, userId, nowIso);
  if (n >= POSTS_PER_DAY) {
    return {
      ok: false,
      message: `Llegaste al máximo de ${POSTS_PER_DAY} publicaciones por día. Intenta mañana.`,
    };
  }
  return { ok: true };
}

export async function assertUnderResponseLimit(
  db: D1Database,
  userId: string,
  nowIso: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const n = await countUserResponsesToday(db, userId, nowIso);
  if (n >= RESPONSES_PER_DAY) {
    return {
      ok: false,
      message: `Llegaste al máximo de ${RESPONSES_PER_DAY} respuestas por día. Intenta mañana.`,
    };
  }
  return { ok: true };
}

/** Sliding hourly bucket in D1 for auth endpoints. */
export async function assertAuthIpLimit(
  db: D1Database,
  ip: string,
  nowIso: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const windowEnd = hourWindowEnd(nowIso);
  const key = `auth:${ip}:${windowEnd}`;
  const existing = await db
    .prepare(`SELECT count, window_end FROM rate_counters WHERE bucket_key = ?`)
    .bind(key)
    .first<{ count: number; window_end: string }>();

  if (!existing) {
    await db
      .prepare(
        `INSERT INTO rate_counters (bucket_key, count, window_end) VALUES (?, 1, ?)`,
      )
      .bind(key, windowEnd)
      .run();
    return { ok: true };
  }

  if (existing.count >= AUTH_PER_HOUR) {
    return {
      ok: false,
      message: "Demasiados intentos. Espera un rato e intenta de nuevo.",
    };
  }

  await db
    .prepare(`UPDATE rate_counters SET count = count + 1 WHERE bucket_key = ?`)
    .bind(key)
    .run();
  return { ok: true };
}

export function clientIp(header: string | undefined, cfIp: string | undefined): string {
  if (cfIp?.trim()) {
    return cfIp.trim();
  }
  const forwarded = header?.split(",")[0]?.trim();
  return forwarded || "unknown";
}
