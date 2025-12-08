import { test, expect } from "@playwright/test";

test.describe("Next.js 14 - Card Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should display card component", async ({ page }) => {
		await expect(page.getByText("Card Title")).toBeVisible();
		await expect(
			page.getByText("This is a card from the shared ui package."),
		).toBeVisible();
		// Check for the Confirm button in the card footer (which indicates footer is rendered)
		const card = page
			.locator('text="This is a card from the shared ui package."')
			.locator("..")
			.locator("..");
		await expect(card.getByRole("button", { name: "Confirm" })).toBeVisible();
	});
});
