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
    // Test-only VAPID keys so soft-ask UI appears after first post (NOTIF-02). Not production secrets.
    command: `npx wrangler dev --port ${PORT} --ip 127.0.0.1 --var DEV_STUB_AUTH:true --var GOOGLE_CLIENT_ID:e2e-test-client --var GOOGLE_CLIENT_SECRET:e2e-test-secret --var SESSION_SECRET:ci-test-secret-min-16 --var VAPID_PUBLIC_KEY:BN6IUD9Hogh604Kh_X6zOPP4XfG6QMtRBVcgLAR-tn7BpNGrzjdtTKnPtI7qj2-izavCrk185CyLAxyeGKqJOGY --var VAPID_PRIVATE_KEY:IcFvzq8OljMa4BfJzRC_675ooayujX1tJ2vuXQmwpHI`,
    url: `${BASE}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
