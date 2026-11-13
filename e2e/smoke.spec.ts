import { expect, test } from "@playwright/test";

test.describe("Phase 0 smoke", () => {
  test("health reports M7", async ({ request }) => {
    const health = await request.get("/api/health");
    expect(health.ok()).toBeTruthy();
    const json = await health.json();
    expect(json.slice).toBe("M7");
  });

  test("public post SSR has OG tags and no phone", async ({ request }) => {
    const res = await request.get("/p/post-open-regalo");
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('property="og:title"');
    expect(html).toContain("Microondas seed");
    expect(html).not.toContain("+51");
    expect(html).not.toContain("Removido");
  });

  test("stub session reaches /api/me with profile", async ({ request }) => {
    const session = await request.post("/api/dev/session");
    expect(session.ok()).toBeTruthy();
    const me = await request.get("/api/me");
    expect(me.ok()).toBeTruthy();
    const body = await me.json();
    expect(body.displayName).toBeTruthy();
    expect(body.profileComplete).toBe(true);
  });

});
