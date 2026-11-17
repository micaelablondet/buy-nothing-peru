/**
 * Capture 375px screenshots for M9 before/after.
 * Usage: node scripts/capture-m9.mjs before|after
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const phase = process.argv[2] === "after" ? "after" : "before";
const outDir = join("captures", "m9", phase);
mkdirSync(outDir, { recursive: true });

const BASE = process.env.M9_BASE_URL ?? "http://127.0.0.1:5173";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  baseURL: BASE,
});
const page = await context.newPage();

async function shot(name) {
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(outDir, `${name}.png`),
    fullPage: false,
  });
  console.log(`wrote ${phase}/${name}.png`);
}

await page.goto("/entrar", { waitUntil: "networkidle" });
await shot("entrar");

const session = await context.request.post("/api/dev/session", {
  data: {},
});
if (!session.ok()) {
  throw new Error(`stub session failed: ${session.status()} ${await session.text()}`);
}

await page.goto("/app", { waitUntil: "networkidle" });
await page.waitForSelector(".feed, .shell-loading, .feed__list", {
  timeout: 15_000,
});
await shot("feed");

await page.goto("/app/p/post-open-regalo", { waitUntil: "networkidle" });
await page.waitForSelector(".post-detail, .shell-loading", { timeout: 15_000 });
await shot("post-detail");

await page.goto("/app/publica", { waitUntil: "networkidle" });
await page.waitForSelector(".publish, form, .publish__title", { timeout: 15_000 });
await shot("create-post");

await page.goto("/app/perfil", { waitUntil: "networkidle" });
await page.waitForSelector(".profile, .profile__name, h1", { timeout: 15_000 });
await shot("profile");

await page.goto("/app/admin", { waitUntil: "networkidle" });
await page.waitForSelector(".admin, h1, .feed", { timeout: 15_000 });
await shot("admin");

await browser.close();
console.log(`done ${phase}`);
