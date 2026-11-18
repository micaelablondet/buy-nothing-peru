import { defineConfig, devices } from "@playwright/test";

const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Dummy Google + session vars so LAND-01 CTAs render; stub auth stays for e2e sign-in.
    // Do not reuse a stray `wrangler dev` — it may lack Google and hide the CTAs.
    // VAPID comes from .dev.vars (fresh keys via scripts/ensure-e2e-vapid.mjs before this starts).
    command: `npx wrangler dev --port ${PORT} --ip 127.0.0.1 --var DEV_STUB_AUTH:true --var GOOGLE_CLIENT_ID:e2e-test-client --var GOOGLE_CLIENT_SECRET:e2e-test-secret --var SESSION_SECRET:ci-test-secret-min-16`,
    url: `${BASE}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
