import { expect, test, type Page } from "@playwright/test";
import { stubSession } from "./helpers";

/** SRCH-01 — Busca result cards show Donación / Pedido type tags. */

async function signInAsMica(page: Page) {
  await stubSession(page.request, "user-mica");
  await page.goto("/app/busca");
  await expect(page.getByRole("heading", { name: "Busca" })).toBeVisible();
}

async function search(page: Page, query: string) {
  const input = page.getByPlaceholder("Ej. disfraz, bici, peluche…");
  await input.fill(query);
  await page.getByRole("button", { name: "Buscar" }).click();
}

test.describe("SRCH-01 Busca type tags", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("search results tag Pedido and Donación cards", async ({ page }) => {
    await signInAsMica(page);

    await search(page, "macetas");
    const pidoCard = page.locator(".feed-card", {
      has: page.getByRole("heading", { name: "Macetas de barro" }),
    });
    await expect(pidoCard).toBeVisible();
    await expect(pidoCard.getByText("Pedido", { exact: true })).toBeVisible();

    await search(page, "microondas");
    const regaloCard = page.locator(".feed-card", {
      has: page.getByRole("heading", { name: "Microondas" }),
    });
    await expect(regaloCard).toBeVisible();
    await expect(regaloCard.getByText("Donación", { exact: true })).toBeVisible();
  });
});
