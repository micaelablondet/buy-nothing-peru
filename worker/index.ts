import { Hono } from "hono";
import { cors } from "hono/cors";
import type { WorkerEnv } from "./env";
import {
  clearSessionCookie,
  readStubSession,
  STUB_USERS,
  stubSessionCookie,
} from "./session";

type AppEnv = { Bindings: WorkerEnv };

const app = new Hono<AppEnv>();

app.use("/api/*", cors({ origin: (origin) => origin || "*", credentials: true }));

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    slice: "M0",
    app: c.env.APP_NAME,
    environment: c.env.ENVIRONMENT,
  }),
);

/** M0 stub sign-in. Replaced by Google OIDC in M1 (AUTH-01). */
app.post("/api/dev/session", async (c) => {
  if (c.env.ENVIRONMENT === "production") {
    return c.json({ error: "not_available" }, 404);
  }
  const body = (await c.req.json().catch(() => ({}))) as { user?: string };
  const key = body.user === "lucia" ? "lucia" : "mica";
  const user =
    key === "lucia"
      ? {
          id: "user-lucia",
          firstName: "Lucía",
          districtId: "dist-barranco",
          isAdmin: false,
        }
      : STUB_USERS.mica;
  c.header("Set-Cookie", stubSessionCookie(user));
  return c.json({ user });
});

app.post("/api/dev/logout", (c) => {
  c.header("Set-Cookie", clearSessionCookie());
  return c.json({ ok: true });
});

app.get("/api/me", (c) => {
  const user = readStubSession(c.req.header("Cookie") ?? null);
  if (!user) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return c.json({
    id: user.id,
    firstName: user.firstName,
    districtId: user.districtId,
    isAdmin: user.isAdmin,
  });
});

app.get("/api/seed-stats", async (c) => {
  const user = readStubSession(c.req.header("Cookie") ?? null);
  if (!user) {
    return c.json({ error: "unauthorized" }, 401);
  }
  try {
    const row = await c.env.DB.prepare(
      `SELECT
         (SELECT COUNT(*) FROM districts) AS districts,
         (SELECT COUNT(*) FROM users) AS users,
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
    return c.json({ seeded: false, counts: null, note: "run migrations + seed" });
  }
});

export default app;
