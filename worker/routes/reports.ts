import type { Hono } from "hono";
import { recordEvent } from "../db/events";
import { findPostById } from "../db/posts";
import { createReport, validateReportInput } from "../db/reports";
import { findResponseById } from "../db/responses";
import type { SessionUser, WorkerEnv } from "../env";
import { REPORT_REASONS } from "../lib/reportReasons";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

/** SAFE-01 */
export function registerReportRoutes(app: Hono<AppEnv>) {
  app.get("/api/report-reasons", (c) => c.json({ reasons: REPORT_REASONS }));

  app.post("/api/reports", async (c) => {
    const session = await readSession(
      c.req.header("Cookie") ?? null,
      c.env.SESSION_SECRET,
    );
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as {
      postId?: string;
      responseId?: string | null;
      reason?: string;
      text?: string;
    };
    const validated = validateReportInput({
      postId: body.postId ?? "",
      responseId: body.responseId,
      reason: body.reason ?? "",
      text: body.text,
    });
    if (!validated.ok) {
      return c.json({ error: "validation", message: validated.message }, 400);
    }
    const post = await findPostById(c.env.DB, body.postId!);
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }
    let responseId: string | null = body.responseId?.trim() || null;
    if (responseId) {
      const response = await findResponseById(c.env.DB, responseId);
      if (!response || response.post_id !== post.id) {
        return c.json({ error: "validation", message: "Respuesta inválida." }, 400);
      }
    }
    const nowIso = new Date().toISOString();
    const id = crypto.randomUUID();
    await createReport(c.env.DB, {
      id,
      reporterId: session.id,
      postId: post.id,
      responseId,
      reason: validated.reason,
      text: validated.text,
      nowIso,
    });
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "report_created",
      props: { postId: post.id, responseId, reason: validated.reason },
      nowIso,
    });
    return c.json({ ok: true, id }, 201);
  });
}
