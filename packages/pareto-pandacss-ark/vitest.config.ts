/// <reference types="vitest/config" />
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "."),
		},
		dedupe: ["graphql"],
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/styled-system/**",
			"**/.pareto/**",
			"**/*.config.{js,mjs,ts}",
		],
	},
});
