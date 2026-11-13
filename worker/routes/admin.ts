import type { Context, Hono } from "hono";
import { createInvite, listInvites, setInviteActive } from "../db/invites";
import { removePost } from "../db/posts";
import { listOpenReports } from "../db/reports";
import type { SessionUser, WorkerEnv } from "../env";
import { computeMetrics } from "../lib/metrics";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

async function requireAdmin(
  c: Context<AppEnv>,
): Promise<SessionUser | null> {
  const session = await readSession(
    c.req.header("Cookie") ?? null,
    c.env.SESSION_SECRET,
  );
  if (!session || !session.isAdmin) {
    return null;
  }
  return session;
}

function deny(c: Context<AppEnv>, session: SessionUser | null) {
  if (!session) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return c.json({ error: "forbidden" }, 403);
}

/** ADMIN-01, ADMIN-02, ADMIN-03, SAFE-03 */
export function registerAdminRoutes(app: Hono<AppEnv>) {
  app.get("/api/admin/reports", async (c) => {
    const session = await readSession(
      c.req.header("Cookie") ?? null,
      c.env.SESSION_SECRET,
    );
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    if (!session.isAdmin) {
      return c.json({ error: "forbidden" }, 403);
    }
    const reports = await listOpenReports(c.env.DB);
    return c.json({
      reports: reports.map((r) => ({
        id: r.id,
        postId: r.post_id,
        postTitle: r.post_title,
        responseId: r.response_id,
        reason: r.reason,
        text: r.text,
        reporterName: r.reporter_name,
        createdAt: r.created_at,
        status: r.status,
      })),
    });
  });

  app.get("/api/admin/posts", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const rows = await c.env.DB.prepare(
      `SELECT p.id, p.type, p.status, p.title, p.created_at,
              u.first_name AS author_first_name, u.display_name AS author_display_name,
              d.name AS district_name
       FROM posts p
       JOIN users u ON u.id = p.author_id
       JOIN districts d ON d.id = p.district_id
       ORDER BY p.created_at DESC
       LIMIT 100`,
    ).all<{
      id: string;
      type: string;
      status: string;
      title: string;
      created_at: string;
      author_first_name: string;
      author_display_name: string | null;
      district_name: string;
    }>();
    return c.json({
      posts: (rows.results ?? []).map((p) => ({
        id: p.id,
        type: p.type,
        status: p.status,
        title: p.title,
        createdAt: p.created_at,
        districtName: p.district_name,
        authorName: (p.author_display_name?.trim() || p.author_first_name).trim(),
      })),
    });
  });

  app.post("/api/admin/posts/:id/remove", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const result = await removePost(c.env.DB, c.req.param("id"));
    if (!result.ok) {
      const status = result.error === "not_found" ? 404 : 409;
      return c.json({ error: result.error }, status);
    }
    return c.json({ id: result.post.id, status: result.post.status });
  });

  app.get("/api/admin/invites", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const invites = await listInvites(c.env.DB);
    return c.json({
      invites: invites.map((i) => ({
        id: i.id,
        code: i.code,
        active: i.active === 1,
        createdAt: i.created_at,
        deactivatedAt: i.deactivated_at,
      })),
    });
  });

  app.post("/api/admin/invites", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const body = (await c.req.json().catch(() => ({}))) as { code?: string };
    const code = body.code?.trim() ?? "";
    if (!code || code.length > 40) {
      return c.json(
        { error: "validation", message: "Escribe un código válido." },
        400,
      );
    }
    try {
      const invite = await createInvite(c.env.DB, {
        id: crypto.randomUUID(),
        code,
        nowIso: new Date().toISOString(),
      });
      return c.json(
        {
          invite: {
            id: invite.id,
            code: invite.code,
            active: true,
            createdAt: invite.created_at,
            deactivatedAt: null,
          },
        },
        201,
      );
    } catch {
      return c.json(
        { error: "conflict", message: "Ese código ya existe." },
        409,
      );
    }
  });

  app.patch("/api/admin/invites/:id", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const body = (await c.req.json().catch(() => ({}))) as { active?: boolean };
    if (typeof body.active !== "boolean") {
      return c.json({ error: "validation", message: "Falta active." }, 400);
    }
    const invite = await setInviteActive(
      c.env.DB,
      c.req.param("id"),
      body.active,
      new Date().toISOString(),
    );
    if (!invite) {
      return c.json({ error: "not_found" }, 404);
    }
    return c.json({
      invite: {
        id: invite.id,
        code: invite.code,
        active: invite.active === 1,
        createdAt: invite.created_at,
        deactivatedAt: invite.deactivated_at,
      },
    });
  });

  app.get("/api/admin/metrics", async (c) => {
    const admin = await requireAdmin(c);
    if (!admin) {
      const session = await readSession(
        c.req.header("Cookie") ?? null,
        c.env.SESSION_SECRET,
      );
      return deny(c, session);
    }
    const metrics = await computeMetrics(c.env.DB, new Date().toISOString());
    return c.json(metrics);
  });

  app.all("/api/admin/*", async (c) => {
    const session = await readSession(
      c.req.header("Cookie") ?? null,
      c.env.SESSION_SECRET,
    );
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    if (!session.isAdmin) {
      return c.json({ error: "forbidden" }, 403);
    }
    return c.json({ error: "not_found" }, 404);
  });
}
