import { expect, test, type Page } from "@playwright/test";

/** NOTIF-02 soft-ask: after first post only; Perfil enable path. */

async function signInAsLucia(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-lucia" },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe("NOTIF-02 push soft-ask", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("soft-ask after first post; Ahora no; Perfil shows Activar avisos", async ({
    page,
  }) => {
    // Headless Chromium reports Notification.permission === "denied"; soft-ask needs default.
    await page.addInitScript(() => {
      try {
        Object.defineProperty(Notification, "permission", {
          configurable: true,
          get: () => "default",
        });
      } catch {
        // Ignore if Notification is missing.
      }
    });

    await signInAsLucia(page);
    await page.goto("/app");
    await page.evaluate(() => {
      localStorage.removeItem("barrio_push_offered");
      sessionStorage.removeItem("barrio_push_armed");
      sessionStorage.removeItem("barrio_install_armed");
    });
    await page.reload();
    await expect(
      page.getByRole("navigation", { name: "Principal" }),
    ).toBeVisible();

    await expect(page.getByTestId("push-soft-ask")).toHaveCount(0);

    await page.getByRole("link", { name: "Publica" }).click();
    await expect(
      page.getByRole("heading", { name: "Publica" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Pido" }).click();

    const title = `E2E push soft-ask ${Date.now()}`;
    await page.getByLabel("Título").fill(title);
    await page.getByLabel("Descripción").fill("Pedido para probar avisos.");
    await page.getByRole("button", { name: "Publicar" }).click();

    await expect(page).toHaveURL(/\/app\/p\//);

    const softAsk = page.getByTestId("push-soft-ask");
    await expect(softAsk).toBeVisible({ timeout: 15_000 });
    await expect(softAsk.getByText("¿Te avisamos?")).toBeVisible();
    await expect(
      softAsk.getByRole("button", { name: "Activar avisos" }),
    ).toBeVisible();

    await softAsk.getByRole("button", { name: "Ahora no" }).click();
    await expect(page.getByTestId("push-soft-ask")).toHaveCount(0);

    await page.getByRole("link", { name: "Perfil" }).click();
    await expect(
      page.getByRole("heading", { name: "Mi perfil" }),
    ).toBeVisible();
    await expect(page.getByText("Avisos en el celular")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Activar avisos" }),
    ).toBeVisible();
  });
});
