import { expect, test, type Page } from "@playwright/test";
import { createPido, stubSession } from "./helpers";

/** DEC-34 — Donaciones / Pedido labels, status gender, empty Pedido icon. */

async function signIn(page: Page, userId = "user-mica") {
  await stubSession(page.request, userId);
  await page.goto("/app");
  await expect(
    page.getByRole("navigation", { name: "Principal" }),
  ).toBeVisible();
}

test.describe("DEC-34 Donación / Pedido UI", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Donaciones tab; donación detail shows Abierta; Pedido card has empty icon", async ({
    page,
  }) => {
    await signIn(page);

    await expect(page.getByRole("tab", { name: "Donaciones" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Pedidos" })).toBeVisible();

    const donacion = page
      .locator(".feed-card")
      .filter({ hasText: "Peluche Pikachu" });
    await expect(donacion).toBeVisible();
    await donacion.click();
    await expect(page.locator(".post-detail__eyebrow")).toContainText("Donación");
    await expect(page.locator(".post-detail__eyebrow")).toContainText("Abierta");

    await stubSession(page.request, "user-lucia");
    const pidoId = await createPido(
      page.request,
      `E2E pedido sin foto ${Date.now()}`,
    );
    await stubSession(page.request, "user-mica");
    await page.goto("/app");
    await page.getByRole("tab", { name: "Pedidos" }).click();

    const pedidoCard = page.locator(`a[href="/app/p/${pidoId}"]`);
    await expect(pedidoCard).toBeVisible();
    await expect(pedidoCard.getByTestId("pedido-empty-icon")).toBeVisible();
    await expect(
      pedidoCard.locator(".feed-card__empty-icon"),
    ).toBeVisible();
  });
});

