import { test, expect } from "@playwright/test";

test.describe("Next.js 14 - Button Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should display all button variants", async ({ page }) => {
		await expect(
			page.getByRole("button", { name: "Primary", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Success", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Danger", exact: true }),
		).toBeVisible();
	});
});
