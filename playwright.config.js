import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    headless: true,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
  },
  projects: [
    { name: 'static-source', use: { baseURL: 'http://127.0.0.1:5173/' } },
    { name: 'github-pages-path', use: { baseURL: 'http://127.0.0.1:4174/FAD/' } },
  ],
  webServer: [
    { command: 'npm run dev -- --port 5173', url: 'http://127.0.0.1:5173/', reuseExistingServer: !process.env.CI },
    { command: 'npm run build && npm run preview -- --port 4174 --base /FAD', url: 'http://127.0.0.1:4174/FAD/', reuseExistingServer: !process.env.CI },
  ],
});
