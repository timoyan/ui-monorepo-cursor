import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

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
			],
		},
	},
});
