import type { Hono } from "hono";
import { POST_CATEGORIES } from "../domain/categories";
import { recordEvent } from "../db/events";
import {
  createPost,
  findPostById,
  listCoverPhotos,
  listFeed,
  listMyPosts,
  listPhotosForPost,
  publicAuthorName,
  setDiscAnswer,
  validatePostInput,
  withdrawPost,
  type PostRow,
} from "../db/posts";
import { findResponseById } from "../db/responses";
import type { SessionUser, WorkerEnv } from "../env";
import { isDiscAnswer } from "../lib/disc";
import { isGiver } from "../lib/handoff";
import { PROHIBITED_ITEMS } from "../lib/prohibited";
import { assertUnderPostLimit } from "../lib/rateLimit";
import { enrichPostActions } from "./responses";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

const MAX_UPLOAD_BYTES = 2_500_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function registerPostRoutes(app: Hono<AppEnv>) {
  app.get("/api/categories", (c) => c.json({ categories: POST_CATEGORIES }));

  app.get("/api/prohibited-items", (c) =>
    c.json({ items: PROHIBITED_ITEMS }),
  );

  /** ANLY-01: post_form_opened */
  app.post("/api/events/post-form-opened", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as {
      type?: string;
      formSessionId?: string;
    };
    const type = body.type === "pido" ? "pido" : body.type === "regalo" ? "regalo" : null;
    const formSessionId = body.formSessionId?.trim();
    if (!type || !formSessionId) {
      return c.json({ error: "validation" }, 400);
    }
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "post_form_opened",
      props: { type, formSessionId },
      nowIso: new Date().toISOString(),
    });
    return c.json({ ok: true });
  });

  app.get("/api/feed", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const type = c.req.query("type") === "pido" ? "pido" : "regalo";
    const districtId =
      c.req.query("districtId")?.trim() || session.districtId || "dist-barranco";
    const category = c.req.query("category")?.trim() || null;
    const posts = await listFeed(c.env.DB, {
      type,
      districtId,
      category,
      limit: 50,
    });
    const covers = await listCoverPhotos(
      c.env.DB,
      posts.map((p) => p.id),
    );
    const serialized = [];
    for (const p of posts) {
      serialized.push(
        await serializePost(
          c.env.DB,
          p,
          covers.get(p.id) ? [covers.get(p.id)!] : [],
          session,
        ),
      );
    }
    return c.json({ posts: serialized });
  });

  app.get("/api/me/posts", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const posts = await listMyPosts(c.env.DB, session.id);
    const covers = await listCoverPhotos(
      c.env.DB,
      posts.map((p) => p.id),
    );
    const serialized = [];
    for (const p of posts) {
      serialized.push(
        await serializePost(
          c.env.DB,
          p,
          covers.get(p.id) ? [covers.get(p.id)!] : [],
          session,
        ),
      );
    }
    return c.json({ posts: serialized });
  });

  app.get("/api/posts/:id", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const post = await findPostById(c.env.DB, c.req.param("id"));
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }
    const photos = await listPhotosForPost(c.env.DB, post.id);
    return c.json(await serializePost(c.env.DB, post, photos, session));
  });

  app.post("/api/posts", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    if (!session.profileComplete || !session.districtId || !session.whatsapp) {
      return c.json(
        { error: "profile_incomplete", message: "Completa tu perfil para publicar." },
        403,
      );
    }

    const nowIso = new Date().toISOString();
    const limit = await assertUnderPostLimit(c.env.DB, session.id, nowIso);
    if (!limit.ok) {
      return c.json({ error: "rate_limited", message: limit.message }, 429);
    }

    const form = await c.req.formData();
    const typeRaw = String(form.get("type") ?? "");
    const title = String(form.get("title") ?? "");
    const description = String(form.get("description") ?? "");
    const category = String(form.get("category") ?? "");
    const formSessionId = String(form.get("formSessionId") ?? "").trim() || null;
    const files: File[] = [];
    for (const item of form.getAll("photos")) {
      if (typeof item === "string") {
        continue;
      }
      const file = item as File;
      if (file.size > 0) {
        files.push(file);
      }
    }

    const validated = validatePostInput({
      type: typeRaw,
      title,
      description,
      category,
      photoCount: files.length,
    });
    if (!validated.ok) {
      return c.json({ error: "validation", message: validated.message }, 400);
    }
    const type = typeRaw as "regalo" | "pido";

    const postId = crypto.randomUUID();
    const photos: { id: string; r2Key: string; position: number }[] = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i]!;
      if (!ALLOWED_TYPES.has(file.type)) {
        return c.json(
          { error: "validation", message: "Solo JPG, PNG o WebP." },
          400,
        );
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return c.json(
          { error: "validation", message: "Cada foto debe pesar menos de 2.5 MB." },
          400,
        );
      }
      const photoId = crypto.randomUUID();
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const r2Key = `posts/${postId}/${i + 1}-${photoId}.${ext}`;
      await c.env.PHOTOS.put(r2Key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });
      photos.push({ id: photoId, r2Key, position: i + 1 });
    }

    const created = await createPost(c.env.DB, {
      id: postId,
      authorId: session.id,
      type,
      title,
      description,
      category,
      districtId: session.districtId,
      photos,
      nowIso,
    });
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "post_created",
      props: { type, postId: created.id, formSessionId },
      nowIso,
    });
    const photoRows = await listPhotosForPost(c.env.DB, created.id);
    return c.json(await serializePost(c.env.DB, created, photoRows, session), 201);
  });

  /** DISC-01 — giver only after Entregado */
  app.post("/api/posts/:id/disc", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as { answer?: string };
    const answer = body.answer?.trim() ?? "";
    if (!isDiscAnswer(answer)) {
      return c.json({ error: "validation", message: "Elige una opción." }, 400);
    }
    const post = await findPostById(c.env.DB, c.req.param("id"));
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }
    let chosenResponderId: string | null = null;
    if (post.chosen_response_id) {
      const chosen = await findResponseById(c.env.DB, post.chosen_response_id);
      chosenResponderId = chosen?.responder_id ?? null;
    }
    if (
      !isGiver({
        postType: post.type,
        viewerId: session.id,
        authorId: post.author_id,
        chosenResponderId,
      })
    ) {
      return c.json({ error: "forbidden" }, 403);
    }
    const result = await setDiscAnswer(c.env.DB, post.id, answer);
    if (!result.ok) {
      const status = result.error === "not_found" ? 404 : 409;
      return c.json({ error: result.error }, status);
    }
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "disc_answered",
      props: { postId: result.post.id, answer },
      nowIso: new Date().toISOString(),
    });
    return c.json({ ok: true, discAnswer: answer });
  });

  app.post("/api/posts/:id/withdraw", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const result = await withdrawPost(
      c.env.DB,
      c.req.param("id"),
      session.id,
      new Date().toISOString(),
    );
    if (!result.ok) {
      if (result.error === "not_found") {
        return c.json({ error: "not_found" }, 404);
      }
      if (result.error === "forbidden") {
        return c.json({ error: "forbidden" }, 403);
      }
      return c.json(
        { error: "illegal_transition", message: "Ya no puedes retirar esta publicación." },
        409,
      );
    }
    const photos = await listPhotosForPost(c.env.DB, result.post.id);
    return c.json(await serializePost(c.env.DB, result.post, photos, session));
  });

  app.get("/api/photos/*", async (c) => {
    const key = c.req.path.replace(/^\/api\/photos\//, "");
    if (!key || key.includes("..")) {
      return c.json({ error: "not_found" }, 404);
    }
    const object = await c.env.PHOTOS.get(key);
    if (!object) {
      return c.json({ error: "not_found" }, 404);
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=86400");
    return new Response(object.body, { headers });
  });
}

async function requireSession(
  c: {
    req: { header: (name: string) => string | undefined };
    env: WorkerEnv;
  },
): Promise<SessionUser | null> {
  return readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
}

async function serializePost(
  db: D1Database,
  post: PostRow,
  photos: { id: string; r2_key: string; position: number }[],
  viewer: SessionUser,
) {
  const actions = await enrichPostActions(db, post, viewer);
  return {
    id: post.id,
    type: post.type,
    status: post.status,
    title: post.title,
    description: post.description,
    category: post.category,
    districtId: post.district_id,
    districtName: post.district_name,
    authorName: publicAuthorName(post),
    createdAt: post.created_at,
    expiresAt: post.expires_at,
    isOwner: post.author_id === viewer.id,
    photos: photos.map((p) => ({
      id: p.id,
      position: p.position,
      url: `/api/photos/${p.r2_key}`,
    })),
    actions,
  };
}
