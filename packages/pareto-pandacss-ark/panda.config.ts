import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	preflight: true,
	jsxFramework: "react",
	include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	outdir: "styled-system",
});
