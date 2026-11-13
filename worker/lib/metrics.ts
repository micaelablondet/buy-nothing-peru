/** ADMIN-03 / ANLY-01 metric definitions (SPEC §10). */

const LIMA_OFFSET_MS = -5 * 60 * 60 * 1000;

/** Monday 00:00 America/Lima of the ISO week containing `nowIso`, as UTC ISO. */
export function startOfIsoWeekLima(nowIso: string): string {
  const utcMs = new Date(nowIso).getTime();
  const limaMs = utcMs + LIMA_OFFSET_MS;
  const lima = new Date(limaMs);
  const day = lima.getUTCDay(); // 0 Sun … 6 Sat in "lima-as-utc"
  const daysFromMonday = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(
      lima.getUTCFullYear(),
      lima.getUTCMonth(),
      lima.getUTCDate() - daysFromMonday,
      0,
      0,
      0,
      0,
    ),
  );
  return new Date(monday.getTime() - LIMA_OFFSET_MS).toISOString();
}

export function endOfIsoWeekLima(nowIso: string): string {
  const start = new Date(startOfIsoWeekLima(nowIso)).getTime();
  return new Date(start + 7 * 24 * 60 * 60 * 1000).toISOString();
}

export function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

export type MetricsSnapshot = {
  accounts: number;
  completedHandoffsThisWeek: number;
  responseRate48h: number | null;
  medianPostFormMs: number | null;
  discAnswers: Record<string, number>;
  inflationCheck: number | null;
  weekStart: string;
  weekEnd: string;
};

export async function computeMetrics(
  db: D1Database,
  nowIso: string,
): Promise<MetricsSnapshot> {
  const weekStart = startOfIsoWeekLima(nowIso);
  const weekEnd = endOfIsoWeekLima(nowIso);

  const accountsRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM users WHERE deleted_at IS NULL`)
    .first<{ n: number }>();

  const chRow = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM posts
       WHERE delivered_at IS NOT NULL
         AND delivered_at >= ? AND delivered_at < ?`,
    )
    .bind(weekStart, weekEnd)
    .first<{ n: number }>();

  const created = await db
    .prepare(
      `SELECT id, created_at, status, withdrawn_at
       FROM posts
       WHERE created_at >= ? AND created_at < ?`,
    )
    .bind(weekStart, weekEnd)
    .all<{
      id: string;
      created_at: string;
      status: string;
      withdrawn_at: string | null;
    }>();

  const posts = created.results ?? [];
  const eligible = posts.filter((p) => {
    const cutoff = new Date(new Date(p.created_at).getTime() + 48 * 3600_000).toISOString();
    if (p.status === "removed" || p.status === "withdrawn") {
      const closedAt = p.withdrawn_at;
      if (closedAt && closedAt <= cutoff) {
        return false;
      }
      // removed without withdrawn_at: still exclude if status is removed/withdrawn early — approximate via status only if within 48h of create
      if (!closedAt && (p.status === "removed" || p.status === "withdrawn")) {
        return false;
      }
    }
    return true;
  });

  let withResponse = 0;
  for (const p of eligible) {
    const cutoff = new Date(
      new Date(p.created_at).getTime() + 48 * 3600_000,
    ).toISOString();
    const hit = await db
      .prepare(
        `SELECT 1 AS ok FROM responses
         WHERE post_id = ? AND created_at <= ?
         LIMIT 1`,
      )
      .bind(p.id, cutoff)
      .first<{ ok: number }>();
    if (hit) {
      withResponse += 1;
    }
  }
  const responseRate48h =
    eligible.length === 0 ? null : withResponse / eligible.length;

  const opened = await db
    .prepare(
      `SELECT user_id, props, created_at FROM events WHERE name = 'post_form_opened'`,
    )
    .all<{ user_id: string | null; props: string | null; created_at: string }>();
  const createdEv = await db
    .prepare(
      `SELECT user_id, props, created_at FROM events WHERE name = 'post_created'`,
    )
    .all<{ user_id: string | null; props: string | null; created_at: string }>();

  const openBySession = new Map<string, string>();
  for (const row of opened.results ?? []) {
    const props = parseProps(row.props);
    const sid = typeof props.formSessionId === "string" ? props.formSessionId : null;
    if (sid && row.user_id) {
      openBySession.set(`${row.user_id}:${sid}`, row.created_at);
    }
  }
  const durations: number[] = [];
  for (const row of createdEv.results ?? []) {
    const props = parseProps(row.props);
    const sid = typeof props.formSessionId === "string" ? props.formSessionId : null;
    if (!sid || !row.user_id) {
      continue;
    }
    const openedAt = openBySession.get(`${row.user_id}:${sid}`);
    if (!openedAt) {
      continue;
    }
    const ms = new Date(row.created_at).getTime() - new Date(openedAt).getTime();
    if (ms >= 0 && ms < 24 * 3600_000) {
      durations.push(ms);
    }
  }

  const discRows = await db
    .prepare(
      `SELECT disc_answer AS answer, COUNT(*) AS n FROM posts
       WHERE disc_answer IS NOT NULL
       GROUP BY disc_answer`,
    )
    .all<{ answer: string; n: number }>();
  const discAnswers: Record<string, number> = {};
  for (const row of discRows.results ?? []) {
    discAnswers[row.answer] = row.n;
  }

  const deliveredRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM posts WHERE status = 'delivered'`)
    .first<{ n: number }>();
  const receivedRow = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM posts
       WHERE status = 'delivered' AND received_confirmed_at IS NOT NULL`,
    )
    .first<{ n: number }>();
  const delivered = deliveredRow?.n ?? 0;
  const inflationCheck =
    delivered === 0 ? null : (receivedRow?.n ?? 0) / delivered;

  return {
    accounts: accountsRow?.n ?? 0,
    completedHandoffsThisWeek: chRow?.n ?? 0,
    responseRate48h,
    medianPostFormMs: median(durations),
    discAnswers,
    inflationCheck,
    weekStart,
    weekEnd,
  };
}

function parseProps(raw: string | null): Record<string, unknown> {
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}
