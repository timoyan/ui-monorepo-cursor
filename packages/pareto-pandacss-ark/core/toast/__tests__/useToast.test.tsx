import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast as mockToast } from "@/core/toast/toastApi";
import { useToast } from "../useToast";

vi.mock("@/core/toast/toastApi", () => ({
	toast: {
		create: vi.fn().mockReturnValue("create-id"),
		success: vi.fn().mockReturnValue("success-id"),
		error: vi.fn().mockReturnValue("error-id"),
		info: vi.fn().mockReturnValue("info-id"),
		warning: vi.fn().mockReturnValue("warning-id"),
		dismiss: vi.fn(),
	},
}));

describe("useToast", () => {
	afterEach(() => {
		mockToast.create.mockClear();
		mockToast.success.mockClear();
		mockToast.error.mockClear();
		mockToast.info.mockClear();
		mockToast.warning.mockClear();
	});

	it("returns toast API and registerAndToast", () => {
		const { result } = renderHook(() => useToast());
		expect(result.current.toast).toBe(mockToast);
		expect(typeof result.current.registerAndToast).toBe("function");
	});

	it("registerAndToast registers content and shows toast with unregisterOnDismiss true by default", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		const registerSpy = vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());
		const content = { title: "Dynamic", description: "One-off content" };

		let id: string | undefined;
		act(() => {
			id = result.current.registerAndToast(content);
		});

		expect(registerSpy).toHaveBeenCalledTimes(1);
		const [contentKey, registeredConfig] = registerSpy.mock.calls[0];
		expect(contentKey).toMatch(/^toast-\d+-[a-z0-9]+$/);
		expect(registeredConfig).toEqual(content);

		expect(mockToast.create).toHaveBeenCalledTimes(1);
		expect(mockToast.create).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: { contentKey, unregisterOnDismiss: true },
			}),
		);
		expect(id).toBe("create-id");
	});

	it("registerAndToast with type success calls toast.success", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.registerAndToast({ title: "Done" }, { type: "success" });
		});

		expect(mockToast.success).toHaveBeenCalledTimes(1);
		expect(mockToast.success).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: expect.objectContaining({ unregisterOnDismiss: true }),
			}),
		);
	});

	it("registerAndToast with type error calls toast.error", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.registerAndToast({ title: "Failed" }, { type: "error" });
		});

		expect(mockToast.error).toHaveBeenCalledTimes(1);
		expect(mockToast.error).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: expect.objectContaining({ unregisterOnDismiss: true }),
			}),
		);
	});

	it("registerAndToast with type info calls toast.info", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		let id: string | undefined;
		act(() => {
			id = result.current.registerAndToast({ title: "Note" }, { type: "info" });
		});

		expect(mockToast.info).toHaveBeenCalledTimes(1);
		expect(mockToast.info).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: expect.objectContaining({
					contentKey: expect.any(String),
					unregisterOnDismiss: true,
				}),
			}),
		);
		expect(id).toBe("info-id");
	});

	it("registerAndToast with type warning calls toast.warning", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		let id: string | undefined;
		act(() => {
			id = result.current.registerAndToast(
				{ title: "Careful" },
				{ type: "warning" },
			);
		});

		expect(mockToast.warning).toHaveBeenCalledTimes(1);
		expect(mockToast.warning).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: expect.objectContaining({
					contentKey: expect.any(String),
					unregisterOnDismiss: true,
				}),
			}),
		);
		expect(id).toBe("warning-id");
	});

	it("registerAndToast with duration passes duration to toast", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.registerAndToast(
				{ title: "Timed" },
				{ type: "success", duration: 3000 },
			);
		});

		expect(mockToast.success).toHaveBeenCalledWith(
			expect.objectContaining({ duration: 3000 }),
		);
	});

	it("registerAndToast returns id from the toast method", async () => {
		vi.spyOn(
			await import("@/core/toast/toastContentRegistry"),
			"registerToastContent",
		);
		const { result } = renderHook(() => useToast());

		let successId: string | undefined;
		let errorId: string | undefined;
		act(() => {
			successId = result.current.registerAndToast(
				{ title: "S" },
				{ type: "success" },
			);
			errorId = result.current.registerAndToast(
				{ title: "E" },
				{ type: "error" },
			);
		});

		expect(successId).toBe("success-id");
		expect(errorId).toBe("error-id");
	});

	it("registerAndToast with unregisterOnDismiss false passes it in meta", async () => {
		const registry = await import("@/core/toast/toastContentRegistry");
		vi.spyOn(registry, "registerToastContent");
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.registerAndToast(
				{ title: "Static-like" },
				{ unregisterOnDismiss: false },
			);
		});

		expect(mockToast.create).toHaveBeenCalledWith(
			expect.objectContaining({
				meta: expect.objectContaining({ unregisterOnDismiss: false }),
			}),
		);
	});
});
