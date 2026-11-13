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
    command: `npx wrangler dev --port ${PORT} --ip 127.0.0.1 --var DEV_STUB_AUTH:true`,
    url: `${BASE}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
