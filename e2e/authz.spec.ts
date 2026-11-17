import { expect, test } from "@playwright/test";
import { createRegalo, respondToPost, stubSession } from "./helpers";

const BASE = "http://127.0.0.1:8787";

/** docs/SRD.md §12.3 — authorization via real Worker API (stub auth). */
test.describe("authorization API", () => {
  test("signed-out user cannot write", async ({ request }) => {
    const res = await request.post("/api/posts");
    expect(res.status()).toBe(401);
    const report = await request.post("/api/reports", {
      data: { postId: "post-open-regalo", reason: "Otro" },
    });
    expect(report.status()).toBe(401);
  });

  test("non-admin gets 403 on admin routes", async ({ request }) => {
    await stubSession(request, "user-lucia");
    const metrics = await request.get("/api/admin/metrics");
    expect(metrics.status()).toBe(403);
  });

  test("admin stub can read metrics; public post JSON has no WhatsApp", async ({
    request,
  }) => {
    await stubSession(request, "user-mica");

    const metrics = await request.get("/api/admin/metrics");
    expect(metrics.ok()).toBeTruthy();

    const pub = await request.get("/api/public/posts/post-open-regalo");
    expect(pub.ok()).toBeTruthy();
    const body = await pub.json();
    expect(JSON.stringify(body)).not.toMatch(/\+51|whatsapp|@/i);
    expect(body.authorFirstName).toBeTruthy();
  });

  test("user cannot withdraw another user's post", async ({ request }) => {
    await stubSession(request, "user-mica");
    // Stub is user-mica; post-open-pido is owned by user-lucia
    const res = await request.post("/api/posts/post-open-pido/withdraw");
    expect(res.status()).toBe(403);
  });

  test("user A cannot choose on user B's post", async ({ playwright }) => {
    const owner = await playwright.request.newContext({ baseURL: BASE });
    const stranger = await playwright.request.newContext({ baseURL: BASE });

    await stubSession(owner, "user-mica");
    const postId = await createRegalo(owner, `Authz choose ${Date.now()}`);

    await stubSession(stranger, "user-lucia");
    const responseId = await respondToPost(stranger, postId, "Quiero este");

    // Carlos is neither owner nor allowed to choose.
    await stubSession(stranger, "user-carlos");
    const choose = await stranger.post(`/api/posts/${postId}/choose`, {
      data: { responseId },
    });
    expect(choose.status()).toBe(403);

    await owner.dispose();
    await stranger.dispose();
  });

  test("non-party cannot get the WhatsApp number", async ({ playwright }) => {
    const owner = await playwright.request.newContext({ baseURL: BASE });
    const responder = await playwright.request.newContext({ baseURL: BASE });
    const stranger = await playwright.request.newContext({ baseURL: BASE });

    await stubSession(owner, "user-mica");
    const postId = await createRegalo(owner, `Authz handoff ${Date.now()}`);

    await stubSession(responder, "user-lucia");
    const responseId = await respondToPost(responder, postId, "Me interesa");

    await stubSession(owner, "user-mica");
    const choose = await owner.post(`/api/posts/${postId}/choose`, {
      data: { responseId },
    });
    expect(choose.ok()).toBeTruthy();

    await stubSession(stranger, "user-carlos");
    const handoff = await stranger.get(`/api/posts/${postId}/handoff`);
    expect(handoff.status()).toBe(403);

    await owner.dispose();
    await responder.dispose();
    await stranger.dispose();
  });

  test("AUTH-04: /api/me computes isAdmin fresh from ADMIN_EMAILS", async ({
    request,
  }) => {
    await stubSession(request, "user-mica");
    const me = await request.get("/api/me");
    expect(me.ok()).toBeTruthy();
    expect((await me.json()).isAdmin).toBe(true);

    await stubSession(request, "user-lucia");
    const luciaMe = await request.get("/api/me");
    expect(luciaMe.ok()).toBeTruthy();
    expect((await luciaMe.json()).isAdmin).toBe(false);
  });

  test("SAFE-05: foreign Origin gets no ACAO; APP_BASE_URL is allowed", async ({
    request,
  }) => {
    const evil = await request.get("/api/health", {
      headers: { Origin: "https://evil.example" },
    });
    expect(evil.ok()).toBeTruthy();
    expect(evil.headers()["access-control-allow-origin"]).toBeFalsy();

    const ok = await request.get("/api/health", {
      headers: { Origin: "http://127.0.0.1:8787" },
    });
    expect(ok.ok()).toBeTruthy();
    expect(ok.headers()["access-control-allow-origin"]).toBe(
      "http://127.0.0.1:8787",
    );
    expect(ok.headers()["access-control-allow-credentials"]).toBe("true");
  });
});
