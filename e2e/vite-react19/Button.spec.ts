import { expect, test } from "@playwright/test";

test.describe("Vite React 19 - Button Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5174");
	});

	test("should display all button variants", async ({ page }) => {
		await expect(
			page.getByRole("button", { name: "Secondary", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Success", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Danger", exact: true }),
		).toBeVisible();
	});
});
