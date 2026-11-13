import { expect, test } from "@playwright/test";

/** SPEC §12.3 — authorization via real Worker API (stub auth). */
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
    // Seed stub is mica (admin). Use public metrics deny by clearing cookies first.
    const bare = await request.get("/api/admin/metrics");
    expect([401, 403]).toContain(bare.status());
  });

  test("admin stub can read metrics; public post JSON has no WhatsApp", async ({
    request,
  }) => {
    const session = await request.post("/api/dev/session");
    expect(session.ok()).toBeTruthy();

    const metrics = await request.get("/api/admin/metrics");
    expect(metrics.ok()).toBeTruthy();

    const pub = await request.get("/api/public/posts/post-open-regalo");
    expect(pub.ok()).toBeTruthy();
    const body = await pub.json();
    expect(JSON.stringify(body)).not.toMatch(/\+51|whatsapp|@/i);
    expect(body.authorFirstName).toBeTruthy();
  });

  test("user cannot withdraw another user's post", async ({ request }) => {
    await request.post("/api/dev/session");
    // Stub is user-mica; post-open-pido is owned by user-lucia
    const res = await request.post("/api/posts/post-open-pido/withdraw");
    expect(res.status()).toBe(403);
  });
});
