import { test, expect } from "@playwright/test";

test.describe("Next.js 14 - Toast Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should show success toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Success Toast" }).click();

		// Wait for toast to appear
		await expect(
			page.getByText("Operation completed successfully!"),
		).toBeVisible({ timeout: 2000 });
	});

	test("should show error toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Error Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Something went wrong!")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show warning toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Warning Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Please review this action")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show info toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Info Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Here's some information")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show toast with action button", async ({ page }) => {
		await page.getByRole("button", { name: "Toast with Action" }).click();

		// Wait for toast to appear
		await expect(page.getByText("File saved successfully")).toBeVisible({
			timeout: 2000,
		});

		// Check for action button
		await expect(page.getByRole("button", { name: "Undo" })).toBeVisible({
			timeout: 2000,
		});

		// Click action button
		await page.getByRole("button", { name: "Undo" }).click();

		// Check for the info toast after clicking undo
		await expect(page.getByText("File restore initiated")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should close toast by clicking close button", async ({ page }) => {
		await page.getByRole("button", { name: "Show Success Toast" }).click();

		// Wait for toast to appear
		const toastMessage = page.getByText("Operation completed successfully!");
		await expect(toastMessage).toBeVisible({ timeout: 2000 });

		// Find the toast container and locate the close button
		// The close button is typically the last button in the toast
		const toastContainer = toastMessage.locator("..").locator("..");
		const closeButton = toastContainer.getByRole("button").last();
		await closeButton.click();

		// Wait for toast to disappear
		await expect(toastMessage).not.toBeVisible({ timeout: 3000 });
	});
});
