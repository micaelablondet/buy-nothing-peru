import type { Hono } from "hono";
import {
  countUnread,
  listNotifications,
  markNotificationRead,
} from "../db/notifications";
import { NOTIFICATION_TITLES } from "../lib/notify";
import { deletePushByEndpoint, upsertPushSubscription } from "../db/push";
import type { SessionUser, WorkerEnv } from "../env";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

export function registerNotificationRoutes(app: Hono<AppEnv>) {
  app.get("/api/notifications", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const rows = await listNotifications(c.env.DB, session.id);
    return c.json({
      notifications: rows.map((n) => ({
        id: n.id,
        type: n.type,
        title: NOTIFICATION_TITLES[n.type],
        postId: n.post_id,
        postTitle: n.post_title,
        readAt: n.read_at,
        createdAt: n.created_at,
        href: n.post_id ? `/app/p/${n.post_id}` : "/app",
      })),
      unread: await countUnread(c.env.DB, session.id),
    });
  });

  app.get("/api/notifications/unread-count", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    return c.json({ unread: await countUnread(c.env.DB, session.id) });
  });

  app.post("/api/notifications/:id/read", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    await markNotificationRead(c.env.DB, {
      id: c.req.param("id"),
      userId: session.id,
      nowIso: new Date().toISOString(),
    });
    return c.json({ ok: true });
  });

  app.get("/api/push/config", (c) =>
    c.json({
      vapidPublicKey: c.env.VAPID_PUBLIC_KEY || null,
      pushConfigured: Boolean(c.env.VAPID_PUBLIC_KEY),
    }),
  );

  app.post("/api/push/subscribe", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return c.json({ error: "validation", message: "Suscripción inválida." }, 400);
    }
    await upsertPushSubscription(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      nowIso: new Date().toISOString(),
    });
    return c.json({ ok: true });
  });

  app.post("/api/push/unsubscribe", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as { endpoint?: string };
    if (body.endpoint) {
      await deletePushByEndpoint(c.env.DB, body.endpoint);
    }
    return c.json({ ok: true });
  });
}

async function requireSession(c: {
  req: { header: (name: string) => string | undefined };
  env: WorkerEnv;
}): Promise<SessionUser | null> {
  return readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
}
