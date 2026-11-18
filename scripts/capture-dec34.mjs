/**
 * 375px screenshots for DEC-34 PR. Expects wrangler on :8787 with stub auth.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";

const PHOTO_A = readFileSync("scripts/seed-photos/pikachu.jpg");
const PHOTO_B = readFileSync("scripts/seed-photos/peluches.jpg");

const BASE = "http://127.0.0.1:8787";
const OUT = "captures/dec34";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

async function stub(userId = "user-mica") {
  const res = await page.request.post(`${BASE}/api/dev/session`, {
    data: { userId },
  });
  if (!res.ok()) throw new Error(`stub ${userId} ${res.status()}`);
}

await page.goto(`${BASE}/entrar`);
await page.screenshot({ path: `${OUT}/01-landing.png`, fullPage: true });

await stub();
await page.goto(`${BASE}/app`);
await page.getByRole("tab", { name: "Donaciones" }).click();
await page.screenshot({
  path: `${OUT}/02-inicio-donaciones.png`,
  fullPage: true,
});
await page.getByRole("tab", { name: "Pedidos" }).click();
await page.screenshot({ path: `${OUT}/03-inicio-pedidos.png`, fullPage: true });

await page.getByRole("tab", { name: "Donaciones" }).click();
await page.locator(".feed-card").filter({ hasText: "Peluche Pikachu" }).click();
await page.waitForURL(/\/app\/p\//);
await page.screenshot({ path: `${OUT}/04-donacion-detail.png`, fullPage: true });

await stub("user-lucia");
const pidoRes = await page.request.post(`${BASE}/api/posts`, {
  multipart: {
    type: "pido",
    title: `Capture pedido ${Date.now()}`,
    description: "Sin foto para el ícono.",
    formSessionId: crypto.randomUUID(),
  },
});
if (!pidoRes.ok()) throw new Error(`create pido ${pidoRes.status()}`);
const pidoId = (await pidoRes.json()).id;
await stub();
await page.goto(`${BASE}/app`);
await page.getByRole("tab", { name: "Pedidos" }).click();
await page.locator(`a[href="/app/p/${pidoId}"]`).scrollIntoViewIfNeeded();
await page.screenshot({
  path: `${OUT}/05-pedido-empty-card.png`,
  fullPage: true,
});

await page.goto(`${BASE}/app/perfil`);
await page.screenshot({ path: `${OUT}/06-perfil.png`, fullPage: true });

await page.goto(`${BASE}/app/publica`);
await page.getByRole("button", { name: "Donación" }).click();
await page.screenshot({ path: `${OUT}/07-publica-empty.png`, fullPage: true });

await page.getByLabel("Título").fill("Capture donación");
await page.getByLabel("Descripción").fill("Dos fotos de prueba.");
await page.locator(".file-picker__input").setInputFiles([
  { name: "a.jpg", mimeType: "image/jpeg", buffer: PHOTO_A },
  { name: "b.jpg", mimeType: "image/jpeg", buffer: PHOTO_B },
]);
await page.getByText("2 foto(s)").waitFor({ timeout: 15_000 });
await page.screenshot({
  path: `${OUT}/08-publica-two-photos.png`,
  fullPage: true,
});

await stub("user-carlos");
await page.goto(`${BASE}/app/p/post-open-pido`);
const yoTengo = page.getByRole("button", { name: "Yo tengo" });
if (await yoTengo.isVisible().catch(() => false)) {
  await yoTengo.click();
} else {
  // Already responded in seed — open a fresh pido as lucia and respond as carlos.
  await stub("user-lucia");
  const fresh = await page.request.post(`${BASE}/api/posts`, {
    multipart: {
      type: "pido",
      title: `Yo tengo capture ${Date.now()}`,
      description: "Para sheet",
      formSessionId: crypto.randomUUID(),
    },
  });
  const id = (await fresh.json()).id;
  await stub("user-carlos");
  await page.goto(`${BASE}/app/p/${id}`);
  await page.getByRole("button", { name: "Yo tengo" }).click();
}
await page.getByRole("dialog").waitFor();
await page.screenshot({ path: `${OUT}/09-yo-tengo-sheet.png`, fullPage: true });

await browser.close();
console.log(`Wrote screenshots under ${OUT}/`);
