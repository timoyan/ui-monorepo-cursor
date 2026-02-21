import { expect, test } from "@playwright/test";

test.describe("Next.js 15 App", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001");
	});

	test("should display the page title", async ({ page }) => {
		await expect(page).toHaveTitle(/Next.js/);
	});

	test("should display the main heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Next.js 15 App using ui package" }),
		).toBeVisible();
	});
});
