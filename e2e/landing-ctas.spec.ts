import { expect, test } from "@playwright/test";

/** LAND-01 — dual Google CTAs on /entrar when Google is configured. */

test.describe("LAND-01 landing CTAs", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("shows Regístrate con Google and Inicia sesión with the same start URL", async ({
    page,
  }) => {
    await page.goto("/entrar?codigo=BARRIO-PILOTO&next=/app/busca");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Lo que sobra en una casa o depa, le falta a otro",
      }),
    ).toBeVisible();

    const register = page.getByRole("link", { name: "Regístrate con Google" });
    const signIn = page.getByRole("link", {
      name: "¿Ya tienes cuenta? Inicia sesión",
    });
    await expect(register).toBeVisible();
    await expect(signIn).toBeVisible();

    const registerHref = await register.getAttribute("href");
    const signInHref = await signIn.getAttribute("href");
    expect(registerHref).toBeTruthy();
    expect(signInHref).toBe(registerHref);
    expect(registerHref!).toMatch(/^\/api\/auth\/google/);
    expect(registerHref!).toContain("next=");
    expect(decodeURIComponent(registerHref!)).toContain("/app/busca");

    // Stub stays available for local/e2e, distinct from the Google CTAs.
    await expect(
      page.getByRole("button", { name: "Continuar (prueba local)" }),
    ).toBeVisible();
  });
});
