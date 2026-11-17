import { expect, test, type Page } from "@playwright/test";

/** NAV-01 / NAV-02 — browser e2e (real page, not API-only). */

async function signInAsMica(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-mica" },
  });
  expect(res.ok()).toBeTruthy();
  await page.goto("/app");
  await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
}

test.describe("NAV-01 header menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens with Términos, Privacidad, Salir; closes on Escape and outside tap", async ({
    page,
  }) => {
    await signInAsMica(page);

    const menuBtn = page.getByRole("button", { name: "Abrir menú" });
    await expect(menuBtn).toBeVisible();
    const box = await menuBtn.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);

    await menuBtn.click();
    const menu = page.getByRole("navigation", { name: "Menú" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Términos" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Privacidad" })).toBeVisible();
    await expect(menu.getByRole("button", { name: "Salir" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);

    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(page.getByRole("navigation", { name: "Menú" })).toBeVisible();
    // Tap outside the menu (feed heading area).
    await page.getByRole("tab", { name: "Regalos" }).click({ force: true });
    await expect(page.getByRole("navigation", { name: "Menú" })).toHaveCount(0);
  });
});

test.describe("NAV-02 responsive shell", () => {
  for (const width of [375, 768, 1280] as const) {
    test(`layout at ${width}px — four destinations, no horizontal scroll`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await signInAsMica(page);

      const nav = page.getByRole("navigation", { name: "Principal" });
      await expect(nav.getByRole("link", { name: "Inicio" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Busca" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Publica" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Perfil" })).toBeVisible();

      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      const navBox = await nav.boundingBox();
      expect(navBox).toBeTruthy();
      if (width < 768) {
        // Bottom tab bar
        expect(navBox!.y).toBeGreaterThan(600);
        expect(navBox!.x).toBeLessThan(40);
      } else {
        // Left sidebar
        expect(navBox!.x).toBeLessThan(40);
        expect(navBox!.y).toBeLessThan(80);
        expect(navBox!.width).toBeGreaterThan(120);
      }
    });
  }
});
