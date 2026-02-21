import { act, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";
import { ToastProvider, useToastContext } from "./ToastProvider";

describe("Toast", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("Rendering", () => {
		it("should render toast with message", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(screen.getByText("Test message")).toBeInTheDocument();
		});

		it("should render toast with title", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					title="Test Title"
					onClose={onClose}
					variant="info"
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(screen.getByText("Test Title")).toBeInTheDocument();
			expect(screen.getByText("Test message")).toBeInTheDocument();
		});

		it("should render different variants", async () => {
			const onClose = vi.fn();
			const variants = ["success", "error", "warning", "info"] as const;

			for (const variant of variants) {
				const { unmount } = render(
					<Toast
						id={`test-toast-${variant}`}
						message={`${variant} message`}
						onClose={onClose}
						variant={variant}
					/>,
				);

				await act(() => {
					vi.advanceTimersByTime(20);
				});

				expect(screen.getByText(`${variant} message`)).toBeInTheDocument();
				unmount();
			}
		});

		it("should render close button by default", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			const closeButton = screen.getByLabelText("Close toast");
			expect(closeButton).toBeInTheDocument();
		});

		it("should not render close button when showCloseButton is false", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					showCloseButton={false}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(screen.queryByLabelText("Close toast")).not.toBeInTheDocument();
		});

		it("should render action button when provided", async () => {
			const onClose = vi.fn();
			const actionClick = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					action={{ label: "Undo", onClick: actionClick }}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			const actionButton = screen.getByText("Undo");
			expect(actionButton).toBeInTheDocument();
		});
	});

	describe("Auto-dismiss", () => {
		it("should auto-dismiss after duration", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					duration={1000}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(onClose).not.toHaveBeenCalled();

			// Advance timers by duration (1000ms) + exit animation delay (300ms)
			await act(() => {
				vi.advanceTimersByTime(1300);
			});

			// Switch to real timers for waitFor since it doesn't work well with fake timers
			vi.useRealTimers();
			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
			vi.useFakeTimers();
		});

		it("should not auto-dismiss when duration is 0", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					duration={0}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			await act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(onClose).not.toHaveBeenCalled();
		});

		it("should not auto-dismiss when preventAutoDismiss is true", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					duration={5000}
					preventAutoDismiss={true}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(onClose).not.toHaveBeenCalled();

			// Advance timers well beyond the duration
			await act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(onClose).not.toHaveBeenCalled();
		});

		it("should auto-dismiss when preventAutoDismiss is false even with long duration", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					duration={1000}
					preventAutoDismiss={false}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			expect(onClose).not.toHaveBeenCalled();

			// Advance timers by duration (1000ms) + exit animation delay (300ms)
			await act(() => {
				vi.advanceTimersByTime(1300);
			});

			// Switch to real timers for waitFor since it doesn't work well with fake timers
			vi.useRealTimers();
			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
			vi.useFakeTimers();
		});
	});

	describe("Manual dismiss", () => {
		it("should call onClose when close button is clicked", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			const closeButton = screen.getByLabelText("Close toast");
			closeButton.click();

			// Advance timers for exit animation delay (300ms)
			await act(() => {
				vi.advanceTimersByTime(300);
			});

			// Switch to real timers for waitFor since it doesn't work well with fake timers
			vi.useRealTimers();
			await waitFor(() => {
				expect(onClose).toHaveBeenCalledTimes(1);
			});
			vi.useFakeTimers();
		});

		it("should call action onClick and close when action button is clicked", async () => {
			const onClose = vi.fn();
			const actionClick = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
					action={{ label: "Undo", onClick: actionClick }}
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			const actionButton = screen.getByText("Undo");
			actionButton.click();

			// Advance timers for exit animation delay (300ms)
			await act(() => {
				vi.advanceTimersByTime(300);
			});

			// Switch to real timers for waitFor since it doesn't work well with fake timers
			vi.useRealTimers();
			await waitFor(() => {
				expect(actionClick).toHaveBeenCalledTimes(1);
				expect(onClose).toHaveBeenCalledTimes(1);
			});
			vi.useFakeTimers();
		});
	});

	describe("Accessibility", () => {
		it("should have role alert", async () => {
			const onClose = vi.fn();
			render(
				<Toast
					id="test-toast"
					message="Test message"
					onClose={onClose}
					variant="info"
				/>,
			);

			await act(() => {
				vi.advanceTimersByTime(20);
			});

			const toast = screen.getByRole("alert");
			expect(toast).toBeInTheDocument();
			expect(toast).toHaveAttribute("aria-live", "polite");
		});
	});
});

describe("ToastProvider and useToastContext", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("should throw error when useToastContext is used outside provider", () => {
		const TestComponent = () => {
			useToastContext();
			return null;
		};

		expect(() => {
			render(<TestComponent />);
		}).toThrow("useToast must be used within a ToastProvider");
	});

	it("should provide toast context", () => {
		const TestComponent = () => {
			const toast = useToastContext();
			return (
				<button
					type="button"
					onClick={() => toast.success("Test")}
					data-testid="toast-button"
				>
					Show Toast
				</button>
			);
		};

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		expect(screen.getByTestId("toast-button")).toBeInTheDocument();
	});

	it("should show toast when success is called", async () => {
		const TestComponent = () => {
			const toast = useToastContext();
			return (
				<button
					type="button"
					onClick={() => toast.success("Success message")}
					data-testid="toast-button"
				>
					Show Toast
				</button>
			);
		};

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		const button = screen.getByTestId("toast-button");
		button.click();

		await act(() => {
			vi.advanceTimersByTime(20);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText("Success message")).toBeInTheDocument();
		});
		vi.useFakeTimers();
	});

	it("should show multiple toasts", async () => {
		const TestComponent = () => {
			const toast = useToastContext();
			return (
				<button
					type="button"
					onClick={() => {
						toast.success("First");
						toast.error("Second");
						toast.info("Third");
					}}
					data-testid="toast-button"
				>
					Show Multiple Toasts
				</button>
			);
		};

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		const button = screen.getByTestId("toast-button");
		button.click();

		await act(() => {
			vi.advanceTimersByTime(20);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText("First")).toBeInTheDocument();
			expect(screen.getByText("Second")).toBeInTheDocument();
			expect(screen.getByText("Third")).toBeInTheDocument();
		});
		vi.useFakeTimers();
	});

	it("should dismiss toast by id", async () => {
		const TestComponent = () => {
			const toast = useToastContext();
			const [toastId, setToastId] = useState<string | null>(null);

			return (
				<div>
					<button
						type="button"
						onClick={() => {
							const id = toast.success("Test message");
							setToastId(id);
						}}
						data-testid="show-toast"
					>
						Show Toast
					</button>
					<button
						type="button"
						onClick={() => {
							if (toastId) toast.dismiss(toastId);
						}}
						data-testid="dismiss-toast"
					>
						Dismiss Toast
					</button>
				</div>
			);
		};

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		const showButton = screen.getByTestId("show-toast");
		showButton.click();

		await act(() => {
			vi.advanceTimersByTime(20);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText("Test message")).toBeInTheDocument();
		});
		vi.useFakeTimers();

		const dismissButton = screen.getByTestId("dismiss-toast");

		await act(() => {
			dismissButton.click();
			// Advance timers to allow React to process state updates
			vi.advanceTimersByTime(100);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.queryByText("Test message")).not.toBeInTheDocument();
		});
		vi.useFakeTimers();
	});

	it("should dismiss all toasts", async () => {
		const TestComponent = () => {
			const toast = useToastContext();
			return (
				<div>
					<button
						type="button"
						onClick={() => {
							toast.success("First");
							toast.error("Second");
							toast.info("Third");
						}}
						data-testid="show-toasts"
					>
						Show Toasts
					</button>
					<button
						type="button"
						onClick={() => toast.dismissAll()}
						data-testid="dismiss-all"
					>
						Dismiss All
					</button>
				</div>
			);
		};

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		const showButton = screen.getByTestId("show-toasts");
		showButton.click();

		await act(() => {
			vi.advanceTimersByTime(20);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.getByText("First")).toBeInTheDocument();
			expect(screen.getByText("Second")).toBeInTheDocument();
			expect(screen.getByText("Third")).toBeInTheDocument();
		});
		vi.useFakeTimers();

		const dismissAllButton = screen.getByTestId("dismiss-all");

		await act(() => {
			dismissAllButton.click();
			// Advance timers to allow React to process state updates
			vi.advanceTimersByTime(100);
		});

		// Switch to real timers for waitFor since it doesn't work well with fake timers
		vi.useRealTimers();
		await waitFor(() => {
			expect(screen.queryByText("First")).not.toBeInTheDocument();
			expect(screen.queryByText("Second")).not.toBeInTheDocument();
			expect(screen.queryByText("Third")).not.toBeInTheDocument();
		});
		vi.useFakeTimers();
	});
});
