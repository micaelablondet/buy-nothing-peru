import { expect, test } from "@playwright/test";

/**
 * Launch blocker: assets must not SPA-fallback /api/* or /p/* navigations.
 * Spec path `/api/auth/google/start` proves /api/auth/google/* hits the Worker
 * (404 from catch-all). Also cover the real OAuth start `/api/auth/google`.
 */

function isSpaShell(html: string): boolean {
  return /id=["']root["']/.test(html) && /\/assets\/index-/.test(html);
}

test.describe("assets routing (Worker vs SPA)", () => {
  test("page.goto /api/auth/google/start is handled by the Worker, not the SPA", async ({
    page,
  }) => {
    const response = await page.goto("/api/auth/google/start", {
      waitUntil: "domcontentloaded",
    });
    const html = await page.content();
    expect(isSpaShell(html)).toBe(false);
    // No such route — Worker catch-all returns 404 for /api/* (not index.html).
    expect(response?.status()).toBe(404);
    expect(page.url()).toContain("/api/auth/google/start");
  });

  test("page.goto /api/auth/google is handled by the Worker, not the SPA", async ({
    page,
  }) => {
    const startResponsePromise = page.waitForResponse(
      (res) => {
        const url = new URL(res.url());
        return url.pathname === "/api/auth/google";
      },
      { timeout: 15_000 },
    );

    await page.goto("/api/auth/google", { waitUntil: "commit" }).catch(() => {
      // Cross-origin redirect can throw; response check is enough.
    });

    const startResponse = await startResponsePromise;
    const status = startResponse.status();
    const location = startResponse.headers().location ?? "";
    const body = await startResponse.text().catch(() => "");

    expect(isSpaShell(body)).toBe(false);
    expect([302, 503, 429]).toContain(status);
    if (status === 302) {
      expect(location).toMatch(/accounts\.google\.com|google\.com/);
    }
    if (status === 503) {
      expect(body).toContain("google_not_configured");
    }
  });

  test("page.goto /p/<seed> is Worker SSR with og:title", async ({ page }) => {
    const response = await page.goto("/p/post-regalo-cuisinart", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBeTruthy();
    const html = await page.content();
    expect(isSpaShell(html)).toBe(false);
    expect(html).toContain('property="og:title"');
    expect(html).toContain("Accesorios Cuisinart");
  });

  test("page.goto /app and /entrar still load the SPA", async ({ page }) => {
    await page.goto("/entrar", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#root")).toBeAttached();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Lo que sobra en una casa o depa/,
      }),
    ).toBeVisible();

    const session = await page.request.post("/api/dev/session", {
      data: { userId: "user-mica" },
    });
    expect(session.ok()).toBeTruthy();

    await page.goto("/app", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#root")).toBeAttached();
    await expect(
      page.getByRole("navigation", { name: "Principal" }),
    ).toBeVisible();
  });
});
