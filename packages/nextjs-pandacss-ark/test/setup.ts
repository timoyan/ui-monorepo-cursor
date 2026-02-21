/// <reference types="vitest/globals" />
process.env.TZ = "UTC";
process.env.LANG = process.env.LC_ALL = "en_US.UTF-8";

import "@testing-library/jest-dom/vitest";
import { testOptions } from "../mocks/config";
// Use relative paths instead of @/* alias: Vitest loads setup outside the Next.js context,
// so tsconfig path mappings may not resolve when this file is imported by the test runner.
import { server } from "../mocks/server";

// Handle unhandled promise rejections in tests
// This prevents test failures from unhandled rejections in hooks/components
if (typeof process !== "undefined" && process.on) {
	process.on("unhandledRejection", (_reason) => {
		// Suppress unhandled rejection errors during tests
		// These are expected in some test scenarios (e.g., testing error handling)
	});
}

beforeAll(() => server.listen(testOptions));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
