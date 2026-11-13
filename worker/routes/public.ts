import type { Hono } from "hono";
import { recordEvent } from "../db/events";
import { findPostById, listPhotosForPost } from "../db/posts";
import type { SessionUser, WorkerEnv } from "../env";
import {
  buildWhatsAppShareUrl,
  publicFirstName,
  renderPublicNotFoundHtml,
  renderPublicPostHtml,
} from "../lib/publicPage";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

/** PUB-01, PUB-02, PUB-03 — public SSR page + share redirect. */
export function registerPublicRoutes(app: Hono<AppEnv>) {
  app.get("/p/:id", async (c) => {
    const id = c.req.param("id");
    const post = await findPostById(c.env.DB, id);
    const baseUrl = c.env.APP_BASE_URL.replace(/\/$/, "");
    const session = await readSession(
      c.req.header("Cookie") ?? null,
      c.env.SESSION_SECRET,
    );

    if (!post) {
      return c.html(renderPublicNotFoundHtml(baseUrl), 404);
    }

    const photos = await listPhotosForPost(c.env.DB, post.id);
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session?.id ?? null,
      name: "public_page_viewed",
      props: { postId: post.id },
      nowIso: new Date().toISOString(),
    });

    const html = renderPublicPostHtml({
      post,
      photos,
      baseUrl,
      signedIn: Boolean(session),
    });
    return c.html(html);
  });

  /** JSON mirror for tests / clients — never includes WhatsApp or email. */
  app.get("/api/public/posts/:id", async (c) => {
    const post = await findPostById(c.env.DB, c.req.param("id"));
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }
    if (post.status === "removed") {
      return c.json({ error: "unavailable", message: "Esta publicación ya no está disponible" }, 410);
    }
    const photos = await listPhotosForPost(c.env.DB, post.id);
    return c.json({
      id: post.id,
      type: post.type,
      status: post.status,
      title: post.title,
      description: post.description,
      category: post.category,
      districtName: post.district_name,
      authorFirstName: publicFirstName(post),
      photos: photos.map((p) => ({
        id: p.id,
        position: p.position,
        url: `/api/photos/${p.r2_key}`,
      })),
    });
  });

  app.post("/api/posts/:id/share", async (c) => {
    const id = c.req.param("id");
    const post = await findPostById(c.env.DB, id);
    if (!post || post.status === "removed") {
      return c.json({ error: "not_found" }, 404);
    }
    const session = await readSession(
      c.req.header("Cookie") ?? null,
      c.env.SESSION_SECRET,
    );
    const pageUrl = `${c.env.APP_BASE_URL.replace(/\/$/, "")}/p/${post.id}`;
    const waUrl = buildWhatsAppShareUrl(post.title, pageUrl);
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session?.id ?? null,
      name: "share_clicked",
      props: { postId: post.id },
      nowIso: new Date().toISOString(),
    });

    const accept = c.req.header("Accept") ?? "";
    const wantsJson =
      accept.includes("application/json") ||
      c.req.header("X-Requested-With") === "fetch";
    if (wantsJson) {
      return c.json({ url: waUrl });
    }
    return c.redirect(waUrl, 302);
  });
}
