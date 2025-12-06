import "@testing-library/jest-dom";
import { expect, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";

// Polyfill for HTMLDialogElement methods (jsdom doesn't support them)
beforeAll(() => {
	// Define open property getter/setter if not already defined
	if (
		!Object.prototype.hasOwnProperty.call(HTMLDialogElement.prototype, "open")
	) {
		Object.defineProperty(HTMLDialogElement.prototype, "open", {
			get() {
				return this.hasAttribute("open");
			},
			set(value: boolean) {
				if (value) {
					this.setAttribute("open", "");
				} else {
					this.removeAttribute("open");
				}
			},
			configurable: true,
		});
	}

	// Mock showModal method
	HTMLDialogElement.prototype.showModal = function () {
		this.setAttribute("open", "");
		this.dispatchEvent(new Event("show", { bubbles: true }));
	};

	// Mock close method
	HTMLDialogElement.prototype.close = function (returnValue?: string) {
		this.removeAttribute("open");
		if (returnValue !== undefined) {
			this.returnValue = returnValue;
		}
		this.dispatchEvent(new Event("close", { bubbles: true }));
	};

	// Mock show method
	HTMLDialogElement.prototype.show = function () {
		this.setAttribute("open", "");
	};
});

// Cleanup after each test
afterEach(() => {
	cleanup();
});
