import { test, expect } from "@playwright/test";

test.describe("Next.js 14 - Modal Component", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should open and close modal", async ({ page }) => {
		// Open modal
		await page.getByRole("button", { name: "Open Modal" }).click();

		// Check modal is visible by checking for the title
		await expect(
			page.getByRole("heading", { name: "Example Modal" }),
		).toBeVisible();

		// Check modal content
		await expect(
			page.getByText("This is a modal dialog using the HTML dialog element."),
		).toBeVisible();

		// Close modal using Cancel button
		await page.getByRole("button", { name: "Cancel" }).click();

		// Check modal is closed
		await expect(
			page.getByRole("heading", { name: "Example Modal" }),
		).not.toBeVisible();
	});

	test("should close modal by clicking backdrop", async ({ page }) => {
		// Open modal
		await page.getByRole("button", { name: "Open Modal" }).click();

		// Wait for modal to be visible
		const modalHeading = page.getByRole("heading", { name: "Example Modal" });
		await expect(modalHeading).toBeVisible();

		// Click backdrop - the backdrop click handler checks if e.target === dialogRef.current
		// Use evaluate to directly trigger a click event on the dialog element itself
		await page.evaluate(() => {
			const dialog = document.querySelector(
				"dialog[open]",
			) as HTMLDialogElement;
			if (dialog) {
				// Create a click event that targets the dialog element directly
				const clickEvent = new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					view: window,
				});
				// Set the target to the dialog element
				Object.defineProperty(clickEvent, "target", {
					writable: false,
					value: dialog,
				});
				dialog.dispatchEvent(clickEvent);
			}
		});

		// Wait for modal to close
		await expect(modalHeading).not.toBeVisible({ timeout: 2000 });
	});
});
