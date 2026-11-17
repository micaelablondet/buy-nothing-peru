import { expect, test, type Page } from "@playwright/test";

/** Response card actions: Reportar left, Elegir right — no overlap at 375px. */

async function openCuisinartInteresados(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-mica" },
  });
  expect(res.ok()).toBeTruthy();
  await page.goto("/app/p/post-regalo-cuisinart/respuestas");
  await expect(
    page.getByRole("heading", { name: "Ver interesados" }),
  ).toBeVisible();
  await expect(page.locator(".response-card").first()).toBeVisible();
}

test.describe("response card actions", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Elegir hugs the card right edge; Reportar and Elegir do not overlap", async ({
    page,
  }) => {
    await openCuisinartInteresados(page);

    const card = page.locator(".response-card").first();
    const report = card.getByRole("button", { name: "Reportar" });
    const choose = card.getByRole("button", { name: "Elegir" });

    await expect(report).toBeVisible();
    await expect(choose).toBeVisible();

    const cardBox = await card.boundingBox();
    const reportBox = await report.boundingBox();
    const chooseBox = await choose.boundingBox();
    expect(cardBox).toBeTruthy();
    expect(reportBox).toBeTruthy();
    expect(chooseBox).toBeTruthy();

    expect(reportBox!.height).toBeGreaterThanOrEqual(44);
    expect(chooseBox!.height).toBeGreaterThanOrEqual(44);

    // Elegir's right edge near the card's right edge (padding allowance).
    const rightGap = cardBox!.x + cardBox!.width - (chooseBox!.x + chooseBox!.width);
    expect(rightGap).toBeGreaterThanOrEqual(0);
    expect(rightGap).toBeLessThanOrEqual(24);

    // Reportar is to the left of Elegir with a clear gap (no touch/overlap).
    expect(reportBox!.x).toBeLessThan(chooseBox!.x);
    const horizontalGap = chooseBox!.x - (reportBox!.x + reportBox!.width);
    expect(horizontalGap).toBeGreaterThanOrEqual(8);

    const verticalOverlap =
      reportBox!.y < chooseBox!.y + chooseBox!.height &&
      chooseBox!.y < reportBox!.y + reportBox!.height;
    if (verticalOverlap) {
      expect(horizontalGap).toBeGreaterThan(0);
    }
  });
});
