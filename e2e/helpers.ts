import type { APIRequestContext } from "@playwright/test";

/** Tiny 1x1 JPEG for Regalo photo uploads in e2e. */
export const TINY_JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGfAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//Z",
  "base64",
);

export async function stubSession(
  request: APIRequestContext,
  userId: string = "user-mica",
) {
  const res = await request.post("/api/dev/session", {
    data: { userId },
  });
  if (!res.ok()) {
    throw new Error(`stub session failed for ${userId}: ${res.status()}`);
  }
  return res;
}

export async function createRegalo(
  request: APIRequestContext,
  title: string,
): Promise<string> {
  const res = await request.post("/api/posts", {
    multipart: {
      type: "regalo",
      title,
      description: "E2E regalo description",
      formSessionId: crypto.randomUUID(),
      photos: {
        name: "photo.jpg",
        mimeType: "image/jpeg",
        buffer: TINY_JPEG,
      },
    },
  });
  if (!res.ok()) {
    throw new Error(`create regalo failed: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { id: string };
  return body.id;
}

export async function createPido(
  request: APIRequestContext,
  title: string,
): Promise<string> {
  const res = await request.post("/api/posts", {
    multipart: {
      type: "pido",
      title,
      description: "E2E pido description",
      formSessionId: crypto.randomUUID(),
    },
  });
  if (!res.ok()) {
    throw new Error(`create pido failed: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { id: string };
  return body.id;
}

export async function respondToPost(
  request: APIRequestContext,
  postId: string,
  note: string,
): Promise<string> {
  const res = await request.post(`/api/posts/${postId}/responses`, {
    multipart: {
      note,
    },
  });
  if (!res.ok()) {
    throw new Error(`respond failed: ${res.status()} ${await res.text()}`);
  }
  const body = (await res.json()) as { response: { id: string } };
  return body.response.id;
}
