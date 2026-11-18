import { expect, test, type Page } from "@playwright/test";

/** DEC-32 — post photos use object-fit: contain (never cropped). */

async function signInAsMica(page: Page) {
  const res = await page.request.post("/api/dev/session", {
    data: { userId: "user-mica" },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe("DEC-32 photo contain", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("feed thumbnail and detail photo have object-fit contain", async ({
    page,
  }) => {
    await signInAsMica(page);
    await page.goto("/app");

    const feedImg = page
      .locator(".feed-card", {
        has: page.getByRole("heading", { name: "Disfraz de esqueleto" }),
      })
      .locator("img.feed-card__img");
    await expect(feedImg).toBeVisible();
    await expect
      .poll(async () => feedImg.evaluate((el) => getComputedStyle(el).objectFit))
      .toBe("contain");

    await page.goto("/app/p/post-regalo-esqueleto");
    const detailImg = page.locator(".post-detail__photos img").first();
    await expect(detailImg).toBeVisible();
    await expect
      .poll(async () =>
        detailImg.evaluate((el) => getComputedStyle(el).objectFit),
      )
      .toBe("contain");
  });
});
