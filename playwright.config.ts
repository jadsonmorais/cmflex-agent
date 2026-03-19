import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: 'html',
  timeout: 120000, // timeout por teste (warmup pode demorar)

  use: {
    baseURL: process.env.CMFLEX_URL,
    headless: false,
    actionTimeout: 15000,
    navigationTimeout: 60000,
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
    storageState: 'auth/session.json',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { storageState: undefined },
    },
    {
      name: 'cmflex',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
