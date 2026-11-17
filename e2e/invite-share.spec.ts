import { expect, test, type Page } from "@playwright/test";

/** AUTH-05 — invite share from ☰ menu + /entrar?codigo= prefill. */

async function signInAsMica(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-mica" },
  });
  expect(res.ok()).toBeTruthy();
  await page.goto("/app");
  await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
}

test.describe("AUTH-05 invite share", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("menu Invitar a alguien links to wa.me with the active code", async ({
    page,
  }) => {
    await signInAsMica(page);

    await page.getByRole("button", { name: "Abrir menú" }).click();
    const invite = page.getByRole("link", { name: "Invitar a alguien" });
    await expect(invite).toBeVisible();
    const href = await invite.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href!).toMatch(/^https:\/\/wa\.me\/\?text=/);
    const text = decodeURIComponent(href!.split("text=")[1] ?? "");
    expect(text).toContain("¡Hola! Te invito a Barrio");
    expect(text).toContain("/entrar?codigo=BARRIO-PILOTO");
  });

  test("/entrar?codigo= pre-fills the invite code step", async ({ page }) => {
    await page.goto("/entrar?codigo=BARRIO-PILOTO");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/invitar");
    const input = page.getByLabel("Código");
    await expect(input).toHaveValue("BARRIO-PILOTO");
  });

  test("hides Invitar a alguien when there is no active code", async ({
    page,
  }) => {
    await signInAsMica(page);

    // Use page.request so the stub session cookie is included (admin auth).
    const list = await page.request.get("/api/admin/invites");
    expect(list.ok()).toBeTruthy();
    const body = (await list.json()) as {
      invites: { id: string; code: string; active: boolean }[];
    };
    const active = body.invites.filter((i) => i.active);
    expect(active.length).toBeGreaterThan(0);

    for (const invite of active) {
      const patch = await page.request.patch(`/api/admin/invites/${invite.id}`, {
        data: { active: false },
      });
      expect(patch.ok()).toBeTruthy();
    }

    await page.reload();
    await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(
      page.getByRole("link", { name: "Invitar a alguien" }),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Términos" })).toBeVisible();

    // Restore seed invite for later tests in the same worker.
    for (const invite of active) {
      const patch = await page.request.patch(`/api/admin/invites/${invite.id}`, {
        data: { active: true },
      });
      expect(patch.ok()).toBeTruthy();
    }
  });
});
