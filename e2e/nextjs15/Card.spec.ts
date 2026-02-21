import { expect, test } from "@playwright/test";

test.describe("Next.js 15 - Card Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3001");
	});

	test("should display card component", async ({ page }) => {
		await expect(page.getByText("Card Title")).toBeVisible();
		await expect(
			page.getByText("This is a card from the shared ui package."),
		).toBeVisible();
		// Check for the footer text in the card
		await expect(page.getByText("Footer")).toBeVisible();
	});
});
