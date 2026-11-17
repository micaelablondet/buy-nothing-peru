import { expect, test } from "@playwright/test";
import { createRegalo, respondToPost, stubSession } from "./helpers";

/** docs/SRD.md §12.2 rule tests (API e2e). */
test.describe("12.2 rules", () => {
  test("cap of 7 blocks a new response; withdraw reopens a slot", async ({
    request,
  }) => {
    await stubSession(request, "user-lucia");
    const capped = await request.post("/api/posts/post-at-cap/responses", {
      data: { note: "Octavo intento" },
    });
    expect(capped.status()).toBe(409);
    expect((await capped.json()).error).toBe("capped");

    await stubSession(request, "user-cap-1");
    const withdraw = await request.post("/api/responses/resp-cap-1/withdraw");
    expect(withdraw.ok()).toBeTruthy();

    await stubSession(request, "user-lucia");
    const reopen = await request.post("/api/posts/post-at-cap/responses", {
      data: { note: "Entré al liberarse un cupo" },
    });
    expect(reopen.status()).toBe(201);
  });

  test("owner can withdraw an open post", async ({ request }) => {
    await stubSession(request, "user-mica");
    const postId = await createRegalo(request, `Withdraw ${Date.now()}`);
    const res = await request.post(`/api/posts/${postId}/withdraw`);
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).status).toBe("withdrawn");

    const detail = await request.get(`/api/posts/${postId}`);
    expect(detail.ok()).toBeTruthy();
    expect((await detail.json()).status).toBe("withdrawn");
  });

  test("expiry job expires open posts past expires_at", async ({ request }) => {
    await stubSession(request, "user-mica");
    const before = await request.get("/api/posts/post-to-expire");
    expect(before.ok()).toBeTruthy();
    expect((await before.json()).status).toBe("open");

    const job = await request.post("/api/jobs/expire-posts");
    expect(job.ok()).toBeTruthy();
    const result = await job.json();
    expect(result.expired).toBeGreaterThanOrEqual(1);

    const after = await request.get("/api/posts/post-to-expire");
    expect(after.ok()).toBeTruthy();
    expect((await after.json()).status).toBe("expired");
  });

  test("48h nudge fires once", async ({ request }) => {
    await stubSession(request, "user-mica");
    const first = await request.post("/api/jobs/nudge");
    expect(first.ok()).toBeTruthy();
    const firstBody = await first.json();
    expect(firstBody.nudged).toBeGreaterThanOrEqual(1);

    const second = await request.post("/api/jobs/nudge");
    expect(second.ok()).toBeTruthy();
    expect((await second.json()).nudged).toBe(0);
  });

  test("public page shows no WhatsApp number", async ({ request }) => {
    const res = await request.get("/p/post-open-regalo");
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).not.toContain("+51");
    expect(html).not.toContain("wa.me");
    expect(html).toContain('property="og:title"');
  });
});
