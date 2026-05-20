import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CookieConfirmDialog } from "@/features/dialogs/CookieConfirmDialog";
import { renderWithStore } from "@/test/renderWithRedux";

describe("CookieConfirmDialog", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it("renders nothing when showCookieConfirm is false (user already chose)", () => {
		const { container } = renderWithStore(<CookieConfirmDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: true },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(container.firstChild).toBeNull();
	});

	it("renders dialog with title and Accept/Decline when showCookieConfirm is true", () => {
		renderWithStore(<CookieConfirmDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(
			screen.getByRole("heading", { name: /cookie consent/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/we use cookies/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /decline/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
	});

	it("calls setCookieConfirm when Accept is clicked", async () => {
		const { store } = renderWithStore(<CookieConfirmDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		await userEvent.click(screen.getByRole("button", { name: /accept/i }));
		expect(store.getState().flow.cookieConfirmResult).toEqual({
			isAccept: true,
		});
	});

	it("calls setCookieConfirm when Decline is clicked", async () => {
		const { store } = renderWithStore(<CookieConfirmDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		const declineBtn = screen.getByRole("button", { name: /decline/i });
		await userEvent.click(declineBtn);
		expect(store.getState().flow.cookieConfirmResult).toEqual({
			isAccept: false,
		});
	});

	it("calls setCookieConfirm(false) when dialog is closed via Escape (onOpenChange with open: false)", async () => {
		const { store } = renderWithStore(<CookieConfirmDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		const dialog = screen.getByRole("dialog", { name: /cookie consent/i });
		dialog.focus();
		fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
		await waitFor(() => {
			expect(store.getState().flow.cookieConfirmResult).toEqual({
				isAccept: false,
			});
		});
	});
});
