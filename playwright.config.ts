import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./e2e",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Use 2 workers in CI (GitHub Actions runners have 2 cores), or all cores locally */
	/* Projects run in parallel, so this allows 2 test files per project to run concurrently */
	workers: process.env.CI ? 2 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		/* Next.js 14 Tests */
		{
			name: "nextjs14-chromium",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:3000",
			},
			testMatch: "**/nextjs14/**/*.spec.ts",
		},
		{
			name: "nextjs14-firefox",
			use: {
				...devices["Desktop Firefox"],
				baseURL: "http://localhost:3000",
			},
			testMatch: "**/nextjs14/**/*.spec.ts",
		},
		{
			name: "nextjs14-webkit",
			use: {
				...devices["Desktop Safari"],
				baseURL: "http://localhost:3000",
			},
			testMatch: "**/nextjs14/**/*.spec.ts",
		},

		/* Next.js 15 Tests */
		{
			name: "nextjs15-chromium",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:3001",
			},
			testMatch: "**/nextjs15/**/*.spec.ts",
		},
		{
			name: "nextjs15-firefox",
			use: {
				...devices["Desktop Firefox"],
				baseURL: "http://localhost:3001",
			},
			testMatch: "**/nextjs15/**/*.spec.ts",
		},
		{
			name: "nextjs15-webkit",
			use: {
				...devices["Desktop Safari"],
				baseURL: "http://localhost:3001",
			},
			testMatch: "**/nextjs15/**/*.spec.ts",
		},

		/* Vite React 18 Tests */
		{
			name: "vite-react18-chromium",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:5173",
			},
			testMatch: "**/vite-react18/**/*.spec.ts",
		},
		{
			name: "vite-react18-firefox",
			use: {
				...devices["Desktop Firefox"],
				baseURL: "http://localhost:5173",
			},
			testMatch: "**/vite-react18/**/*.spec.ts",
		},
		{
			name: "vite-react18-webkit",
			use: {
				...devices["Desktop Safari"],
				baseURL: "http://localhost:5173",
			},
			testMatch: "**/vite-react18/**/*.spec.ts",
		},

		/* Vite React 19 Tests */
		{
			name: "vite-react19-chromium",
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:5174",
			},
			testMatch: "**/vite-react19/**/*.spec.ts",
		},
		{
			name: "vite-react19-firefox",
			use: {
				...devices["Desktop Firefox"],
				baseURL: "http://localhost:5174",
			},
			testMatch: "**/vite-react19/**/*.spec.ts",
		},
		{
			name: "vite-react19-webkit",
			use: {
				...devices["Desktop Safari"],
				baseURL: "http://localhost:5174",
			},
			testMatch: "**/vite-react19/**/*.spec.ts",
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },
	],

	/* Run your local dev servers before starting the tests */
	webServer: [
		{
			command: "cd packages/nextjs14 && pnpm dev",
			url: "http://localhost:3000",
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000,
		},
		{
			command: "cd packages/nextjs15 && PORT=3001 pnpm dev",
			url: "http://localhost:3001",
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000,
		},
		{
			command: "cd packages/vite-react18 && pnpm dev",
			url: "http://localhost:5173",
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000,
		},
		{
			command: "cd packages/vite-react19 && pnpm dev -- --port 5174",
			url: "http://localhost:5174",
			reuseExistingServer: !process.env.CI,
			timeout: 120 * 1000,
		},
	],
});
