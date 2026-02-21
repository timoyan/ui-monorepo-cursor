import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "."),
		},
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/styled-system/**",
			"**/.next/**",
			"**/test-result/**",
			"**/*.config.{js,mjs,ts}",
			"**/mockServiceWorker.js",
			"**/*.example.{ts,tsx}",
			"**/mocks/**",
			"**/pages/**",
		],
		coverage: {
			provider: "istanbul",
			reporter: ["lcov"],
			reportsDirectory: "test-result/coverage",
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/styled-system/**",
				"**/.next/**",
				"**/test-result/**",
				"**/*.config.{js,mjs,ts}",
				"**/mockServiceWorker.js",
				"**/*.example.{ts,tsx}",
				"**/mocks/**",
				"**/pages/**",
			],
		},
	},
});
