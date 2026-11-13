import { Hono } from "hono";
import { cors } from "hono/cors";
import { buildGoogleAuthUrl, exchangeGoogleCode, googleConfigured } from "./auth/google";
import { recordEvent } from "./db/events";
import { expireOpenPosts } from "./db/posts";
import { runNudgeJob } from "./jobs/nudge";
import {
  createUser,
  deleteAccount,
  findActiveInvite,
  findUserByGoogleSub,
  findUserById,
  rowToSession,
  updateProfile,
} from "./db/users";
import type { SessionUser, WorkerEnv } from "./env";
import {
  assertAuthIpLimit,
  clientIp,
} from "./lib/rateLimit";
import {
  clearReturnPathCookie,
  readReturnPath,
  returnPathSetCookie,
  sanitizeReturnPath,
} from "./lib/returnPath";
import { normalizePeruWhatsApp } from "./lib/whatsapp";
import { registerAdminRoutes } from "./routes/admin";
import { registerNotificationRoutes } from "./routes/notifications";
import { registerPostRoutes } from "./routes/posts";
import { registerPublicRoutes } from "./routes/public";
import { registerReportRoutes } from "./routes/reports";
import { registerResponseRoutes } from "./routes/responses";
import {
  clearPendingCookie,
  clearSessionCookie,
  pendingSetCookie,
  readPending,
  readSession,
  sessionSetCookie,
} from "./session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

const DEFAULT_DISTRICT = "dist-barranco";
const app = new Hono<AppEnv>();

app.use(
  "/api/*",
  cors({
    origin: (origin) => origin || "*",
    credentials: true,
  }),
);

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    slice: "M6",
    app: c.env.APP_NAME,
    environment: c.env.ENVIRONMENT,
    googleConfigured: googleConfigured(c.env),
    inviteRequired: c.env.INVITE_REQUIRED === "true",
  }),
);

app.get("/api/auth/config", (c) =>
  c.json({
    googleConfigured: googleConfigured(c.env),
    inviteRequired: c.env.INVITE_REQUIRED === "true",
    stubAuth:
      c.env.ENVIRONMENT !== "production" && c.env.DEV_STUB_AUTH === "true",
  }),
);

/** PUB-04: persist safe return path before Google / stub sign-in. */
app.post("/api/auth/return-path", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { next?: string };
  const next = sanitizeReturnPath(body.next);
  if (!next) {
    return c.json({ error: "invalid_next" }, 400);
  }
  appendCookie(c, returnPathSetCookie(c.env, next));
  return c.json({ ok: true, next });
});

/** AUTH-01 */
app.get("/api/auth/google", async (c) => {
  if (!googleConfigured(c.env)) {
    return c.json(
      {
        error: "google_not_configured",
        message: "Falta configurar GOOGLE_CLIENT_ID / SECRET / SESSION_SECRET.",
      },
      503,
    );
  }
  const ip = clientIp(
    c.req.header("X-Forwarded-For"),
    c.req.header("CF-Connecting-IP"),
  );
  const authLimit = await assertAuthIpLimit(
    c.env.DB,
    ip,
    new Date().toISOString(),
  );
  if (!authLimit.ok) {
    return c.json({ error: "rate_limited", message: authLimit.message }, 429);
  }
  const next = sanitizeReturnPath(c.req.query("next"));
  if (next) {
    appendCookie(c, returnPathSetCookie(c.env, next));
  }
  const state = crypto.randomUUID();
  const stateCookie = [
    `barrio_oauth_state=${state}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=600",
  ];
  if (c.env.APP_BASE_URL.startsWith("https")) {
    stateCookie.push("Secure");
  }
  c.header("Set-Cookie", stateCookie.join("; "), { append: true });
  return c.redirect(buildGoogleAuthUrl(c.env, state), 302);
});

app.get("/api/auth/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const cookie = c.req.header("Cookie") ?? "";
  const expected = cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("barrio_oauth_state="))
    ?.slice("barrio_oauth_state=".length);

  if (!code || !state || !expected || state !== expected) {
    return c.redirect("/entrar?error=oauth_state", 302);
  }

  try {
    const identity = await exchangeGoogleCode(c.env, code);
    const existing = await findUserByGoogleSub(c.env.DB, identity.googleSub);

    if (existing) {
      const session = rowToSession(existing, c.env.ADMIN_EMAILS);
      appendCookie(c, await sessionSetCookie(c.env, session));
      appendCookie(c, clearPendingCookie(c.env));
      appendCookie(c, clearOauthStateCookie(c.env));
      return c.redirect(finishAuthRedirect(c, session, cookie), 302);
    }

    if (c.env.INVITE_REQUIRED !== "true") {
      const nowIso = new Date().toISOString();
      const user = await createUser(c.env.DB, {
        id: crypto.randomUUID(),
        googleSub: identity.googleSub,
        email: identity.email,
        displayName: identity.displayName,
        inviteAcceptedAt: nowIso,
        districtId: DEFAULT_DISTRICT,
      });
      await recordEvent(c.env.DB, {
        id: crypto.randomUUID(),
        userId: user.id,
        name: "user_signed_up",
        props: { via_invite: false },
        nowIso,
      });
      const session = rowToSession(user, c.env.ADMIN_EMAILS);
      appendCookie(c, await sessionSetCookie(c.env, session));
      appendCookie(c, clearPendingCookie(c.env));
      appendCookie(c, clearOauthStateCookie(c.env));
      return c.redirect(finishAuthRedirect(c, session, cookie), 302);
    }

    appendCookie(c, await pendingSetCookie(c.env, identity));
    appendCookie(c, clearOauthStateCookie(c.env));
    return c.redirect("/invitar", 302);
  } catch {
    return c.redirect("/entrar?error=oauth_failed", 302);
  }
});

/** AUTH-02 */
app.post("/api/auth/invite", async (c) => {
  const pending = await readPending(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!pending) {
    return c.json({ error: "pending_required" }, 401);
  }
  const ip = clientIp(
    c.req.header("X-Forwarded-For"),
    c.req.header("CF-Connecting-IP"),
  );
  const authLimit = await assertAuthIpLimit(
    c.env.DB,
    ip,
    new Date().toISOString(),
  );
  if (!authLimit.ok) {
    return c.json({ error: "rate_limited", message: authLimit.message }, 429);
  }
  const body = (await c.req.json().catch(() => ({}))) as { code?: string };
  const code = body.code?.trim() ?? "";
  if (!code) {
    return c.json({ error: "invalid_code", message: "Código inválido" }, 400);
  }

  const invite = await findActiveInvite(c.env.DB, code);
  if (!invite) {
    return c.json({ error: "invalid_code", message: "Código inválido" }, 400);
  }

  const cookie = c.req.header("Cookie") ?? "";
  const existing = await findUserByGoogleSub(c.env.DB, pending.googleSub);
  if (existing) {
    const session = rowToSession(existing, c.env.ADMIN_EMAILS);
    appendCookie(c, await sessionSetCookie(c.env, session));
    appendCookie(c, clearPendingCookie(c.env));
    return c.json({
      user: publicMe(session),
      next: finishAuthRedirect(c, session, cookie),
    });
  }

  const nowIso = new Date().toISOString();
  const user = await createUser(c.env.DB, {
    id: crypto.randomUUID(),
    googleSub: pending.googleSub,
    email: pending.email,
    displayName: pending.displayName,
    inviteAcceptedAt: nowIso,
    districtId: DEFAULT_DISTRICT,
  });
  await recordEvent(c.env.DB, {
    id: crypto.randomUUID(),
    userId: user.id,
    name: "user_signed_up",
    props: { via_invite: true },
    nowIso,
  });
  const session = rowToSession(user, c.env.ADMIN_EMAILS);
  appendCookie(c, await sessionSetCookie(c.env, session));
  appendCookie(c, clearPendingCookie(c.env));
  return c.json({
    user: publicMe(session),
    next: finishAuthRedirect(c, session, cookie),
  });
});

app.post("/api/auth/logout", async (c) => {
  appendCookie(c, clearSessionCookie(c.env));
  appendCookie(c, clearPendingCookie(c.env));
  return c.json({ ok: true });
});

/** Dev-only stub (AUTH not available without Google). */
app.post("/api/dev/session", async (c) => {
  if (c.env.ENVIRONMENT === "production" || c.env.DEV_STUB_AUTH !== "true") {
    return c.json({ error: "not_available" }, 404);
  }
  const seed = await findUserById(c.env.DB, "user-mica");
  if (!seed) {
    return c.json({ error: "seed_missing", message: "Corre npm run db:reset:local" }, 500);
  }
  const session = rowToSession(seed, c.env.ADMIN_EMAILS);
  appendCookie(c, await sessionSetCookie(c.env, session));
  const cookie = c.req.header("Cookie") ?? "";
  return c.json({
    user: publicMe(session),
    next: finishAuthRedirect(c, session, cookie),
  });
});

app.get("/api/me", async (c) => {
  const session = await readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!session) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const fresh = await findUserById(c.env.DB, session.id);
  if (!fresh) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return c.json(publicMe(rowToSession(fresh, c.env.ADMIN_EMAILS)));
});

app.patch("/api/me/profile", async (c) => {
  const session = await readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!session) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const body = (await c.req.json().catch(() => ({}))) as {
    displayName?: string;
    whatsapp?: string;
    districtId?: string;
  };
  const displayName = body.displayName?.trim() ?? "";
  if (!displayName) {
    return c.json({ error: "validation", message: "Escribe tu nombre." }, 400);
  }
  const phone = normalizePeruWhatsApp(body.whatsapp ?? "");
  if (!phone.ok) {
    return c.json({ error: "validation", message: phone.message }, 400);
  }
  const districtId = body.districtId?.trim() || DEFAULT_DISTRICT;
  const district = await c.env.DB.prepare(
    `SELECT id FROM districts WHERE id = ?`,
  )
    .bind(districtId)
    .first<{ id: string }>();
  if (!district) {
    return c.json({ error: "validation", message: "Elige un distrito válido." }, 400);
  }

  const updated = await updateProfile(c.env.DB, session.id, {
    displayName,
    whatsapp: phone.e164,
    districtId,
  });
  if (!updated) {
    return c.json({ error: "not_found" }, 404);
  }
  const nextSession = rowToSession(updated, c.env.ADMIN_EMAILS);
  appendCookie(c, await sessionSetCookie(c.env, nextSession));
  const cookie = c.req.header("Cookie") ?? "";
  const returnTo = finishAuthRedirect(c, nextSession, cookie);
  return c.json({ ...publicMe(nextSession), next: returnTo });
});

app.delete("/api/me", async (c) => {
  const session = await readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!session) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await deleteAccount(c.env.DB, session.id);
  appendCookie(c, clearSessionCookie(c.env));
  return c.json({ ok: true });
});

app.get("/api/districts", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, name FROM districts ORDER BY name`,
  ).all<{ id: string; name: string }>();
  return c.json({ districts: rows.results ?? [] });
});

registerPostRoutes(app);
registerResponseRoutes(app);
registerNotificationRoutes(app);
registerPublicRoutes(app);
registerReportRoutes(app);
registerAdminRoutes(app);

/** Dev/manual trigger for POST-06 expiry (also runs on cron). */
app.post("/api/jobs/expire-posts", async (c) => {
  if (c.env.ENVIRONMENT === "production") {
    return c.json({ error: "not_available" }, 404);
  }
  const nowIso = new Date().toISOString();
  const result = await expireOpenPosts(c.env.DB, nowIso);
  for (const postId of result.ids) {
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: null,
      name: "post_expired",
      props: { postId },
      nowIso,
    });
  }
  return c.json({ ok: true, expired: result.expired });
});

/** Dev/manual trigger for NOTIF-04 nudge. */
app.post("/api/jobs/nudge", async (c) => {
  if (c.env.ENVIRONMENT === "production") {
    return c.json({ error: "not_available" }, 404);
  }
  const result = await runNudgeJob(c.env.DB, new Date().toISOString());
  return c.json({ ok: true, ...result });
});

app.get("/api/seed-stats", async (c) => {
  const session = await readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
  if (!session) {
    return c.json({ error: "unauthorized" }, 401);
  }
  try {
    const row = await c.env.DB.prepare(
      `SELECT
         (SELECT COUNT(*) FROM districts) AS districts,
         (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS users,
         (SELECT COUNT(*) FROM posts) AS posts,
         (SELECT COUNT(*) FROM responses) AS responses`,
    ).first<{
      districts: number;
      users: number;
      posts: number;
      responses: number;
    }>();
    return c.json({ seeded: Boolean(row && row.districts > 0), counts: row });
  } catch {
    return c.json({ seeded: false, counts: null });
  }
});

function publicMe(session: SessionUser) {
  return {
    id: session.id,
    displayName: session.displayName,
    email: session.email,
    districtId: session.districtId,
    whatsapp: session.whatsapp,
    inviteAcceptedAt: session.inviteAcceptedAt,
    isAdmin: session.isAdmin,
    profileComplete: session.profileComplete,
  };
}

/**
 * PUB-04: after auth/invite/profile, send the user back to a safe stored path
 * (e.g. `/p/{id}`). Keep the cookie until the profile is complete.
 */
function finishAuthRedirect(
  c: {
    header: (name: string, value: string, options?: { append: boolean }) => void;
    env: WorkerEnv;
  },
  session: SessionUser,
  cookieHeader: string,
): string {
  if (!session.profileComplete) {
    return "/onboarding/perfil";
  }
  const stored = readReturnPath(cookieHeader);
  appendCookie(c, clearReturnPathCookie(c.env));
  return stored ?? "/app";
}

function appendCookie(
  c: { header: (name: string, value: string, options?: { append: boolean }) => void },
  value: string,
) {
  c.header("Set-Cookie", value, { append: true });
}

function clearOauthStateCookie(env: WorkerEnv): string {
  const parts = [
    "barrio_oauth_state=",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (env.ENVIRONMENT === "production" || env.APP_BASE_URL.startsWith("https")) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export default {
  fetch: app.fetch,
  async scheduled(
    _controller: ScheduledController,
    env: WorkerEnv,
    ctx: ExecutionContext,
  ) {
    const now = new Date().toISOString();
    ctx.waitUntil(
      Promise.all([
        expireOpenPosts(env.DB, now).then(async (result) => {
          for (const postId of result.ids) {
            await recordEvent(env.DB, {
              id: crypto.randomUUID(),
              userId: null,
              name: "post_expired",
              props: { postId },
              nowIso: now,
            });
          }
          console.log(`expireOpenPosts: ${result.expired}`);
        }),
        runNudgeJob(env.DB, now).then((result) => {
          console.log(`runNudgeJob: ${result.nudged}`);
        }),
      ]),
    );
  },
};
