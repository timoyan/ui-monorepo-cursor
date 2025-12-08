import { test, expect } from "@playwright/test";

test.describe("Vite React 19 App", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5174");
	});

	test("should display the page title", async ({ page }) => {
		await expect(page).toHaveTitle(/vite-react19/);
	});

	test("should display the main heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Vite React App using ui package" }),
		).toBeVisible();
	});
});
