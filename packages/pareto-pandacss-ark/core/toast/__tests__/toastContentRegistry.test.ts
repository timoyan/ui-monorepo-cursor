import { afterEach, describe, expect, it } from "vitest";
import {
	registerToastContent,
	TOAST_CONTENT_REGISTRY,
	unregisterToastContent,
} from "../toastContentRegistry";

describe("toastContentRegistry", () => {
	afterEach(() => {
		unregisterToastContent("test-key");
		unregisterToastContent("test-another");
	});

	describe("TOAST_CONTENT_REGISTRY", () => {
		it("has initial entries for success-with-icon and warning-with-icon", () => {
			expect(TOAST_CONTENT_REGISTRY["success-with-icon"]).toBeDefined();
			expect(TOAST_CONTENT_REGISTRY["success-with-icon"].title).toBe("Success");
			expect(TOAST_CONTENT_REGISTRY["success-with-icon"].description).toBe(
				"Done with custom icon from registry.",
			);

			expect(TOAST_CONTENT_REGISTRY["warning-with-icon"]).toBeDefined();
			expect(TOAST_CONTENT_REGISTRY["warning-with-icon"].title).toBe("Warning");
			expect(TOAST_CONTENT_REGISTRY["warning-with-icon"].description).toBe(
				"Check your input.",
			);
		});
	});

	describe("registerToastContent", () => {
		it("adds an entry to the registry", () => {
			registerToastContent("test-key", {
				title: "Test Title",
				description: "Test description.",
			});
			expect(TOAST_CONTENT_REGISTRY["test-key"]).toEqual({
				title: "Test Title",
				description: "Test description.",
			});
		});

		it("overwrites existing entry when same key is registered again", () => {
			registerToastContent("test-key", { title: "First" });
			registerToastContent("test-key", { title: "Second" });
			expect(TOAST_CONTENT_REGISTRY["test-key"].title).toBe("Second");
		});
	});

	describe("unregisterToastContent", () => {
		it("removes an entry from the registry", () => {
			registerToastContent("test-key", { title: "To remove" });
			expect(TOAST_CONTENT_REGISTRY["test-key"]).toBeDefined();

			unregisterToastContent("test-key");
			expect(TOAST_CONTENT_REGISTRY["test-key"]).toBeUndefined();
		});

		it("is safe to call for non-existent key", () => {
			expect(TOAST_CONTENT_REGISTRY["non-existent"]).toBeUndefined();
			unregisterToastContent("non-existent");
			expect(TOAST_CONTENT_REGISTRY["non-existent"]).toBeUndefined();
		});
	});
});
