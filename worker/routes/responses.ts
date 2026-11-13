import type { Hono } from "hono";
import { recordEvent } from "../db/events";
import { notifyUser } from "../lib/notify";
import { assertUnderResponseLimit } from "../lib/rateLimit";
import {
  chooseResponse,
  countActiveResponses,
  createResponse,
  findResponseById,
  findViewerResponse,
  listActiveResponses,
  markDelivered,
  markReceived,
  publicResponderName,
  validateResponseNote,
  withdrawResponse,
  MAX_ACTIVE_RESPONSES,
} from "../db/responses";
import { findPostById, listPhotosForPost, publicAuthorName } from "../db/posts";
import { findUserById } from "../db/users";
import type { SessionUser, WorkerEnv } from "../env";
import {
  buildWhatsAppUrl,
  canRevealWhatsApp,
  handoffPrefill,
  isGiver,
  isReceiver,
} from "../lib/handoff";
import { readSession } from "../session";

type AppEnv = {
  Bindings: WorkerEnv;
  Variables: { user: SessionUser };
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 2_500_000;
const PIDO_NOTE_DEFAULT = "Hola, yo tengo esto y te lo regalo.";

export function registerResponseRoutes(app: Hono<AppEnv>) {
  app.get("/api/posts/:id/responses", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const post = await findPostById(c.env.DB, c.req.param("id"));
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }
    if (post.author_id !== session.id) {
      return c.json({ error: "forbidden" }, 403);
    }
    const responses = await listActiveResponses(c.env.DB, post.id);
    return c.json({
      responses: responses.map((r) => ({
        id: r.id,
        note: r.note,
        createdAt: r.created_at,
        name: publicResponderName(r),
        districtName: r.district_name,
        photoUrl: r.photo_r2_key ? `/api/photos/${r.photo_r2_key}` : null,
        // HAND-02: never include whatsapp here
      })),
    });
  });

  app.post("/api/posts/:id/responses", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    if (!session.profileComplete || !session.whatsapp) {
      return c.json(
        {
          error: "profile_incomplete",
          message: "Completa tu WhatsApp para responder.",
        },
        403,
      );
    }

    const rateNow = new Date().toISOString();
    const limit = await assertUnderResponseLimit(c.env.DB, session.id, rateNow);
    if (!limit.ok) {
      return c.json({ error: "rate_limited", message: limit.message }, 429);
    }

    const post = await findPostById(c.env.DB, c.req.param("id"));
    if (!post) {
      return c.json({ error: "not_found" }, 404);
    }

    const contentType = c.req.header("content-type") ?? "";
    let noteRaw = "";
    let photoFile: File | null = null;
    if (contentType.includes("multipart/form-data")) {
      const form = await c.req.formData();
      noteRaw = String(form.get("note") ?? "");
      const photoVal = form.get("photo");
      if (photoVal && typeof photoVal !== "string") {
        photoFile = photoVal as File;
      }
    } else {
      const json = (await c.req.json().catch(() => ({}))) as { note?: string };
      noteRaw = json.note ?? "";
    }

    if (post.type === "pido" && !noteRaw.trim()) {
      noteRaw = PIDO_NOTE_DEFAULT;
    }
    const noteCheck = validateResponseNote(noteRaw);
    if (!noteCheck.ok) {
      return c.json({ error: "validation", message: noteCheck.message }, 400);
    }
    if (post.type === "regalo" && photoFile) {
      return c.json(
        { error: "validation", message: "Solo un Pido admite foto en la respuesta." },
        400,
      );
    }

    let photoR2Key: string | null = null;
    if (photoFile && photoFile.size > 0) {
      if (!ALLOWED_TYPES.has(photoFile.type)) {
        return c.json({ error: "validation", message: "Solo JPG, PNG o WebP." }, 400);
      }
      if (photoFile.size > MAX_UPLOAD_BYTES) {
        return c.json(
          { error: "validation", message: "La foto debe pesar menos de 2.5 MB." },
          400,
        );
      }
      const ext =
        photoFile.type === "image/png"
          ? "png"
          : photoFile.type === "image/webp"
            ? "webp"
            : "jpg";
      const photoId = crypto.randomUUID();
      photoR2Key = `responses/${post.id}/${photoId}.${ext}`;
      await c.env.PHOTOS.put(photoR2Key, await photoFile.arrayBuffer(), {
        httpMetadata: { contentType: photoFile.type },
      });
    }

    const nowIso = new Date().toISOString();
    const result = await createResponse(c.env.DB, {
      id: crypto.randomUUID(),
      postId: post.id,
      responderId: session.id,
      note: noteCheck.note,
      photoR2Key,
      nowIso,
    });
    if (!result.ok) {
      if (result.error === "already_active") {
        return c.json(
          { error: "already_active", message: "Ya respondiste a esta publicación." },
          409,
        );
      }
      if (result.error === "capped") {
        return c.json(
          {
            error: "capped",
            message:
              post.type === "pido"
                ? "Ya hay 7 ofertas"
                : "Ya hay 7 interesados",
          },
          409,
        );
      }
      if (result.error === "forbidden") {
        return c.json({ error: "forbidden" }, 403);
      }
      return c.json({ error: result.error }, 400);
    }

    await notifyUser(c.env, {
      userId: post.author_id,
      type: post.type === "pido" ? "nueva_oferta" : "nuevo_interesado",
      postId: post.id,
      nowIso,
    });
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "response_created",
      props: { postId: post.id, responseId: result.response.id },
      nowIso,
    });

    return c.json(
      {
        response: {
          id: result.response.id,
          status: result.response.status,
          note: result.response.note,
          createdAt: result.response.created_at,
        },
      },
      201,
    );
  });

  app.post("/api/responses/:id/withdraw", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const result = await withdrawResponse(
      c.env.DB,
      c.req.param("id"),
      session.id,
      new Date().toISOString(),
    );
    if (!result.ok) {
      const status =
        result.error === "not_found"
          ? 404
          : result.error === "forbidden"
            ? 403
            : 409;
      return c.json({ error: result.error }, status);
    }
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "response_withdrawn",
      props: { responseId: result.response.id, postId: result.response.post_id },
      nowIso: new Date().toISOString(),
    });
    return c.json({
      response: {
        id: result.response.id,
        status: result.response.status,
      },
    });
  });

  app.post("/api/posts/:id/choose", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
    }
    const body = (await c.req.json().catch(() => ({}))) as { responseId?: string };
    if (!body.responseId) {
      return c.json({ error: "validation", message: "Elige una respuesta." }, 400);
    }
    const nowIso = new Date().toISOString();
    const result = await chooseResponse(c.env.DB, {
      postId: c.req.param("id"),
      responseId: body.responseId,
      actorId: session.id,
      nowIso,
    });
    if (!result.ok) {
      const status =
        result.error === "not_found"
          ? 404
          : result.error === "forbidden"
            ? 403
            : 409;
      return c.json({ error: result.error }, status);
    }
    const chosen = await findResponseById(c.env.DB, body.responseId);
    if (chosen) {
      await notifyUser(c.env, {
        userId: chosen.responder_id,
        type: "te_eligieron",
        postId: result.post.id,
        nowIso,
      });
    }
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "response_chosen",
      props: { postId: result.post.id, responseId: body.responseId },
      nowIso,
    });
    return c.json({ postId: result.post.id, status: result.post.status });
  });

  app.get("/api/posts/:id/handoff", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
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
      !canRevealWhatsApp({
        postStatus: post.status,
        viewerId: session.id,
        authorId: post.author_id,
        chosenResponderId,
      })
    ) {
      return c.json({ error: "forbidden" }, 403);
    }

    const otherId =
      session.id === post.author_id ? chosenResponderId! : post.author_id;
    const other = await findUserById(c.env.DB, otherId);
    if (!other?.whatsapp) {
      return c.json({ error: "missing_number" }, 409);
    }
    const otherName =
      other.display_name?.trim() || other.first_name;
    const text = handoffPrefill(otherName, post.title);
    const photos = await listPhotosForPost(c.env.DB, post.id);

    return c.json({
      postId: post.id,
      title: post.title,
      type: post.type,
      status: post.status,
      tip: "Coordina el recojo en un lugar público y de día.",
      otherParty: {
        name: otherName,
        whatsapp: other.whatsapp,
      },
      waUrl: buildWhatsAppUrl(other.whatsapp, text),
      prefilledText: text,
      canMarkDelivered: isGiver({
        postType: post.type,
        viewerId: session.id,
        authorId: post.author_id,
        chosenResponderId,
      }) && post.status === "chosen",
      canMarkReceived:
        isReceiver({
          postType: post.type,
          viewerId: session.id,
          authorId: post.author_id,
          chosenResponderId,
        }) &&
        (post.status === "chosen" || post.status === "delivered") &&
        !post.received_confirmed_at,
      receivedConfirmed: Boolean(post.received_confirmed_at),
      discAnswer: post.disc_answer,
      showDiscSurvey:
        isGiver({
          postType: post.type,
          viewerId: session.id,
          authorId: post.author_id,
          chosenResponderId,
        }) &&
        post.status === "delivered" &&
        !post.disc_answer,
      coverUrl: photos[0] ? `/api/photos/${photos[0].r2_key}` : null,
      authorName: publicAuthorName(post),
    });
  });

  app.post("/api/posts/:id/delivered", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
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
    const nowIso = new Date().toISOString();
    const updated = await markDelivered(c.env.DB, post.id, nowIso);
    if (!updated) {
      return c.json({ error: "illegal_transition" }, 409);
    }
    await recordEvent(c.env.DB, {
      id: crypto.randomUUID(),
      userId: session.id,
      name: "handoff_delivered",
      props: { postId: post.id },
      nowIso,
    });
    return c.json({ postId: updated.id, status: updated.status });
  });

  app.post("/api/posts/:id/received", async (c) => {
    const session = await requireSession(c);
    if (!session) {
      return c.json({ error: "unauthorized" }, 401);
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
      !isReceiver({
        postType: post.type,
        viewerId: session.id,
        authorId: post.author_id,
        chosenResponderId,
      })
    ) {
      return c.json({ error: "forbidden" }, 403);
    }
    const nowIso = new Date().toISOString();
    const updated = await markReceived(c.env.DB, post.id, nowIso);
    if (updated?.received_confirmed_at) {
      await recordEvent(c.env.DB, {
        id: crypto.randomUUID(),
        userId: session.id,
        name: "handoff_received_confirmed",
        props: { postId: post.id },
        nowIso,
      });
    }
    return c.json({
      postId: updated?.id ?? post.id,
      receivedConfirmed: Boolean(updated?.received_confirmed_at),
    });
  });
}

export async function enrichPostActions(
  db: D1Database,
  post: Awaited<ReturnType<typeof findPostById>>,
  viewer: SessionUser,
) {
  if (!post) {
    return null;
  }
  const isOwner = post.author_id === viewer.id;
  const activeCount = await countActiveResponses(db, post.id);
  const mine = await findViewerResponse(db, post.id, viewer.id);
  const capped = activeCount >= MAX_ACTIVE_RESPONSES;
  const myActive = mine?.status === "active";

  let chosenResponderId: string | null = null;
  if (post.chosen_response_id) {
    const chosen = await findResponseById(db, post.chosen_response_id);
    chosenResponderId = chosen?.responder_id ?? null;
  }
  const handoffParty = canRevealWhatsApp({
    postStatus: post.status,
    viewerId: viewer.id,
    authorId: post.author_id,
    chosenResponderId,
  });

  return {
    canWithdraw: isOwner && (post.status === "open" || post.status === "chosen"),
    showOwnerResponses: isOwner && post.status === "open",
    showRespond: !isOwner && post.status === "open" && !myActive && !capped,
    alreadyResponded: !isOwner && post.status === "open" && myActive,
    myResponseId: myActive ? mine!.id : null,
    capped: !isOwner && post.status === "open" && capped && !myActive,
    activeResponseCount: activeCount,
    showHandoff: handoffParty,
    statusOnly:
      post.status === "expired" ||
      post.status === "withdrawn" ||
      post.status === "removed" ||
      post.status === "closed" ||
      post.status === "delivered" ||
      (post.status === "chosen" && !handoffParty),
  };
}

async function requireSession(c: {
  req: { header: (name: string) => string | undefined };
  env: WorkerEnv;
}): Promise<SessionUser | null> {
  return readSession(c.req.header("Cookie") ?? null, c.env.SESSION_SECRET);
}
