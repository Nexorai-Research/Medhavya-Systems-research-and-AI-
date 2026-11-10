import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * E2E runs against a production build (`npm run build` first). Leads are written to an
 * isolated .data-e2e directory and the rate limit is raised so tests do not throttle each other.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // Animated pages plus axe scans are heavy on slower machines; a longer timeout and fewer
  // workers avoided load-induced timeouts without hiding real assertion failures.
  timeout: 60_000,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { DATABASE_URL: "", LEAD_STORE_DIR: ".data-e2e", LEAD_RATE_LIMIT_PER_10_MIN: "1000", LEAD_NOTIFIER: "none" },
  },
});
