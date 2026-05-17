import { afterEach, describe, expect, it, vi } from "vitest";
import { toaster } from "@/core/toast/createToaster";
import type { ToastMeta } from "@/core/toast/toastApi";
import { toast } from "../toastApi";

vi.mock("@/core/toast/createToaster", () => ({
	toaster: {
		create: vi.fn().mockReturnValue("create-id"),
		success: vi.fn().mockReturnValue("success-id"),
		error: vi.fn().mockReturnValue("error-id"),
		dismiss: vi.fn(),
	},
}));

const NO_AUTO_CLOSE_MS = 86400000; // 24h, from index
const SUCCESS_AUTO_DURATION_MS = 5000;

describe("core/toast", () => {
	afterEach(() => {
		vi.mocked(toaster.create).mockClear();
		vi.mocked(toaster.success).mockClear();
		vi.mocked(toaster.error).mockClear();
		vi.mocked(toaster.dismiss).mockClear();
	});

	describe("toast API", () => {
		it("toast.create forwards options and sets default duration when not provided", () => {
			toast.create({ title: "Info" });
			expect(toaster.create).toHaveBeenCalledTimes(1);
			expect(toaster.create).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Info",
					duration: NO_AUTO_CLOSE_MS,
				}),
			);
		});

		it("toast.create uses provided duration", () => {
			toast.create({ title: "Info", duration: 3000 });
			expect(toaster.create).toHaveBeenCalledWith(
				expect.objectContaining({ duration: 3000 }),
			);
		});

		it("toast.success forwards options and sets default duration when not provided", () => {
			toast.success({ title: "Saved", description: "Done." });
			expect(toaster.success).toHaveBeenCalledTimes(1);
			expect(toaster.success).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Saved",
					description: "Done.",
					duration: SUCCESS_AUTO_DURATION_MS,
				}),
			);
		});

		it("toast.success uses provided duration", () => {
			toast.success({ title: "Ok", duration: 2000 });
			expect(toaster.success).toHaveBeenCalledWith(
				expect.objectContaining({ duration: 2000 }),
			);
		});

		it("toast.error forwards options and sets default duration when not provided", () => {
			toast.error({ title: "Failed" });
			expect(toaster.error).toHaveBeenCalledTimes(1);
			expect(toaster.error).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Failed",
					duration: NO_AUTO_CLOSE_MS,
				}),
			);
		});

		it("toast.info calls create with type info and default duration", () => {
			toast.info({ title: "Note" });
			expect(toaster.create).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Note",
					type: "info",
					duration: NO_AUTO_CLOSE_MS,
				}),
			);
		});

		it("toast.warning calls create with type warning and default duration", () => {
			toast.warning({ title: "Careful" });
			expect(toaster.create).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "Careful",
					type: "warning",
					duration: NO_AUTO_CLOSE_MS,
				}),
			);
		});

		it("toast.dismiss calls toaster.dismiss with id", () => {
			toast.dismiss("toast-123");
			expect(toaster.dismiss).toHaveBeenCalledTimes(1);
			expect(toaster.dismiss).toHaveBeenCalledWith("toast-123");
		});
	});

	describe("ToastMeta type", () => {
		it("ToastMeta allows contentKey and unregisterOnDismiss", () => {
			const meta: ToastMeta = {
				contentKey: "my-key",
				unregisterOnDismiss: true,
			};
			expect(meta.contentKey).toBe("my-key");
			expect(meta.unregisterOnDismiss).toBe(true);
		});
	});
});
