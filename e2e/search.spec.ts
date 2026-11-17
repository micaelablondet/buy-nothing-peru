import { expect, test } from "@playwright/test";
import { stubSession } from "./helpers";

/** SRCH-01 — API e2e for keyword search. */

test.describe("SRCH-01 search API", () => {
  test("signed out returns 401", async ({ request }) => {
    const res = await request.get("/api/search?q=microondas");
    expect(res.status()).toBe(401);
  });

  test("signed in returns matches without WhatsApp numbers", async ({
    request,
  }) => {
    await stubSession(request, "user-mica");
    const res = await request.get("/api/search?q=Microondas");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as {
      posts: Array<Record<string, unknown>>;
    };
    expect(body.posts.length).toBeGreaterThan(0);
    const blob = JSON.stringify(body);
    expect(blob).not.toMatch(/\+51/);
    expect(blob.toLowerCase()).not.toContain("whatsapp");
    for (const post of body.posts) {
      expect(post).not.toHaveProperty("whatsapp");
      expect(post).not.toHaveProperty("email");
    }
  });

  test("empty query returns empty list", async ({ request }) => {
    await stubSession(request, "user-mica");
    const res = await request.get("/api/search?q=%20");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { posts: unknown[] };
    expect(body.posts).toEqual([]);
  });
});
