import type { Hono } from "hono";
import { POST_CATEGORIES } from "../domain/categories";
import {
  createPost,
  findPostById,
  listCoverPhotos,
  listFeed,
  listMyPosts,
  listPhotosForPost,
  publicAuthorName,
  validatePostInput,
  withdrawPost,
  type PostRow,
} from "../db/posts";
import type { SessionUser, WorkerEnv } from "../env";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

const MAX_UPLOAD_BYTES = 2_500_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function registerPostRoutes(app: Hono<AppEnv>) {
  app.get("/api/categories", (c) => c.json({ categories: POST_CATEGORIES }));

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
    return c.json({
      posts: posts.map((p) =>
        serializePost(p, covers.get(p.id) ? [covers.get(p.id)!] : [], session.id),
      ),
    });
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
    return c.json({
      posts: posts.map((p) =>
        serializePost(p, covers.get(p.id) ? [covers.get(p.id)!] : [], session.id),
      ),
    });
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
    return c.json(serializePost(post, photos, session.id));
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

    const form = await c.req.formData();
    const typeRaw = String(form.get("type") ?? "");
    const title = String(form.get("title") ?? "");
    const description = String(form.get("description") ?? "");
    const category = String(form.get("category") ?? "");
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

    const nowIso = new Date().toISOString();
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
    const photoRows = await listPhotosForPost(c.env.DB, created.id);
    return c.json(serializePost(created, photoRows, session.id), 201);
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
    return c.json(serializePost(result.post, photos, session.id));
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

function serializePost(
  post: PostRow,
  photos: { id: string; r2_key: string; position: number }[],
  viewerId: string,
) {
  const isOwner = post.author_id === viewerId;
  const closed = !["open", "chosen"].includes(post.status);
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
    isOwner,
    photos: photos.map((p) => ({
      id: p.id,
      position: p.position,
      url: `/api/photos/${p.r2_key}`,
    })),
    actions: {
      canWithdraw: isOwner && (post.status === "open" || post.status === "chosen"),
      showOwnerResponses: isOwner && post.status === "open",
      showRespond: !isOwner && post.status === "open",
      statusOnly: closed || post.status === "chosen",
    },
  };
}
