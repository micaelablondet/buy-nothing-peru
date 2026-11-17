import { expect, test, type Page } from "@playwright/test";

/** POST-04 feed cards + ADMIN-05 (no Perfil → /admin link). */

async function signInAsMica(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-mica" },
  });
  expect(res.ok()).toBeTruthy();
  await page.goto("/app");
  await expect(page.getByRole("navigation", { name: "Principal" })).toBeVisible();
}

test.describe("POST-04 feed cards / ADMIN-05 perfil", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Regalo card shows title, barrio, first name, hace; no category chips", async ({
    page,
  }) => {
    await signInAsMica(page);

    await expect(page.getByRole("tab", { name: "Regalos" })).toBeVisible();
    await expect(page.locator(".feed__chips")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Todas" })).toHaveCount(0);

    const card = page.locator(".feed-card").filter({ hasText: "Peluche Pikachu" });
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { name: "Peluche Pikachu" })).toBeVisible();
    await expect(card).toContainText("Torres Paz");
    await expect(card).toContainText("de Mica");
    await expect(card).toContainText("hace");
    await expect(card).not.toContainText("Juguetes");
    await expect(card).not.toContainText("Categoría");
  });

  test("Perfil has no Ir a admin link", async ({ page }) => {
    await signInAsMica(page);
    await page.goto("/app/perfil");
    await expect(page.getByRole("heading", { name: "Mi perfil" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ir a admin" })).toHaveCount(0);
    await expect(page.locator('a[href="/admin"]')).toHaveCount(0);
  });
});
