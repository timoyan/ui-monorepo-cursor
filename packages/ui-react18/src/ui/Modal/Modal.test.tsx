import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
	beforeEach(() => {
		// Clear any existing modals
		document.body.innerHTML = "";
	});

	afterEach(() => {
		// Clean up
		document.body.innerHTML = "";
	});

	describe("Rendering", () => {
		it("should render modal when open is true", () => {
			render(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);
			expect(screen.getByText("Modal content")).toBeInTheDocument();
		});

		it("should not render modal when open is false", () => {
			const { container } = render(
				<Modal open={false} onClose={() => {}}>
					Modal content
				</Modal>,
			);
			// Dialog is in DOM but hidden (no open attribute), so not accessible via getByRole
			const dialog = container.querySelector("dialog") as HTMLDialogElement;
			expect(dialog).toBeInTheDocument();
			expect(dialog.open).toBe(false);
			expect(dialog.hasAttribute("open")).toBe(false);
		});

		it("should render title when provided", () => {
			render(
				<Modal open={true} onClose={() => {}} title="Test Title">
					Modal content
				</Modal>,
			);
			expect(screen.getByText("Test Title")).toBeInTheDocument();
		});

		it("should not render title when not provided", () => {
			render(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);
			expect(screen.queryByRole("heading")).not.toBeInTheDocument();
		});

		it("should render footer when provided", () => {
			render(
				<Modal
					open={true}
					onClose={() => {}}
					footer={<button type="button">Footer Button</button>}
				>
					Modal content
				</Modal>,
			);
			expect(screen.getByText("Footer Button")).toBeInTheDocument();
		});

		it("should not render footer when not provided", () => {
			render(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);
			// Footer should not be in the document
			const footer = document.querySelector('[class*="ModalFooter"]');
			expect(footer).not.toBeInTheDocument();
		});
	});

	describe("Closing behavior", () => {
		it("should call onClose when backdrop is clicked", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog");
			// Click on the dialog element itself (backdrop)
			fireEvent.click(dialog);

			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
		});

		it("should not call onClose when backdrop is clicked if closeOnBackdropClick is false", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose} closeOnBackdropClick={false}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog");
			fireEvent.click(dialog);

			await waitFor(() => {
				expect(onClose).not.toHaveBeenCalled();
			});
		});

		it("should not call onClose when clicking inside modal content", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose}>
					<div data-testid="modal-content">Modal content</div>
				</Modal>,
			);

			const content = screen.getByTestId("modal-content");
			fireEvent.click(content);

			await waitFor(() => {
				expect(onClose).not.toHaveBeenCalled();
			});
		});
	});

	describe("ESC key handling", () => {
		it("should call onClose when ESC is pressed and closeOnEscape is true (default)", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog") as HTMLDialogElement;

			// Simulate ESC key by dispatching cancel event (native dialog behavior)
			const cancelEvent = new Event("cancel", {
				bubbles: true,
				cancelable: true,
			});
			dialog.dispatchEvent(cancelEvent);

			// When closeOnEscape is true, cancel event is not prevented,
			// so the dialog should close naturally, which triggers close event
			// In test environment, manually trigger close to simulate native behavior
			if (!cancelEvent.defaultPrevented) {
				dialog.close();
			}

			// Wait for onClose to be called via the close event handler
			await waitFor(
				() => {
					expect(onClose).toHaveBeenCalled();
				},
				{ timeout: 1000 },
			);
		});

		it("should not call onClose when ESC is pressed and closeOnEscape is false", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose} closeOnEscape={false}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog") as HTMLDialogElement;

			// Simulate ESC key press by dispatching cancel event
			const cancelEvent = new Event("cancel", {
				bubbles: true,
				cancelable: true,
			});
			dialog.dispatchEvent(cancelEvent);

			// Wait a bit to ensure onClose is not called
			await waitFor(
				() => {
					expect(onClose).not.toHaveBeenCalled();
				},
				{ timeout: 500 },
			);
		});

		it("should keep modal open when ESC is pressed multiple times with closeOnEscape false", async () => {
			const onClose = vi.fn();
			render(
				<Modal open={true} onClose={onClose} closeOnEscape={false}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog") as HTMLDialogElement;

			// Simulate multiple ESC presses
			for (let i = 0; i < 3; i++) {
				const cancelEvent = new Event("cancel", {
					bubbles: true,
					cancelable: true,
				});
				dialog.dispatchEvent(cancelEvent);
				// Small delay between events
				await new Promise((resolve) => setTimeout(resolve, 10));
			}

			await waitFor(
				() => {
					expect(onClose).not.toHaveBeenCalled();
					expect(screen.getByText("Modal content")).toBeInTheDocument();
				},
				{ timeout: 500 },
			);
		});
	});

	describe("Dialog element behavior", () => {
		it("should have dialog role", () => {
			render(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("should show modal when open prop changes to true", () => {
			const { rerender, container } = render(
				<Modal open={false} onClose={() => {}}>
					Modal content
				</Modal>,
			);

			// When closed, dialog is hidden so not accessible via getByRole
			const dialog = container.querySelector("dialog") as HTMLDialogElement;
			expect(dialog).toBeInTheDocument();
			expect(dialog.open).toBe(false);

			rerender(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);

			// Now dialog should be accessible and open
			expect(screen.getByRole("dialog")).toBeInTheDocument();
			expect(dialog.open).toBe(true);
			expect(dialog.hasAttribute("open")).toBe(true);
			expect(screen.getByText("Modal content")).toBeInTheDocument();
		});

		it("should hide modal when open prop changes to false", () => {
			const { rerender } = render(
				<Modal open={true} onClose={() => {}}>
					Modal content
				</Modal>,
			);

			const dialog = screen.getByRole("dialog") as HTMLDialogElement;
			expect(dialog.open).toBe(true);
			expect(screen.getByText("Modal content")).toBeInTheDocument();

			rerender(
				<Modal open={false} onClose={() => {}}>
					Modal content
				</Modal>,
			);

			// Dialog is still in DOM but should not have open attribute
			expect(dialog.open).toBe(false);
			expect(dialog.hasAttribute("open")).toBe(false);
		});
	});

	describe("Props forwarding", () => {
		it("should forward className prop", () => {
			render(
				<Modal open={true} onClose={() => {}} className="custom-class">
					Modal content
				</Modal>,
			);
			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveClass("custom-class");
		});

		it("should forward other HTML attributes", () => {
			render(
				<Modal open={true} onClose={() => {}} data-testid="custom-modal">
					Modal content
				</Modal>,
			);
			expect(screen.getByTestId("custom-modal")).toBeInTheDocument();
		});
	});
});
