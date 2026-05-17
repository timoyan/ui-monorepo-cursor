import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { AppToaster } from "@/core/toast";
import { toast } from "../toastApi";
import {
	registerToastContent,
	TOAST_CONTENT_REGISTRY,
	unregisterToastContent,
} from "../toastContentRegistry";

describe("AppToaster", () => {
	it("renders without crashing", () => {
		render(<AppToaster />);
		expect(document.body).toBeInTheDocument();
	});

	it("shows toast title when a toast is created", async () => {
		render(<AppToaster />);
		const title = "Test toast title";

		await act(async () => {
			toast.success({ title, description: "Description" });
		});

		await waitFor(() => {
			expect(screen.getByText(title)).toBeInTheDocument();
		});
	});

	it("shows toast from registry when contentKey is set", async () => {
		const contentKey = "toaster-test-registry";
		registerToastContent(contentKey, {
			title: "Registry title",
			description: "Registry description",
		});
		render(<AppToaster />);

		await act(async () => {
			toast.success({
				title: "Fallback",
				meta: { contentKey },
			});
		});

		await waitFor(() => {
			expect(screen.getByText("Registry title")).toBeInTheDocument();
			expect(screen.getByText("Registry description")).toBeInTheDocument();
		});

		unregisterToastContent(contentKey);
	});

	it("renders close button for toast", async () => {
		render(<AppToaster />);
		await act(async () => {
			toast.success({ title: "Close me" });
		});

		await waitFor(() => {
			expect(screen.getByText("Close me")).toBeInTheDocument();
		});

		const closeButton = screen.getByRole("button", { name: /close toast/i });
		expect(closeButton).toBeInTheDocument();
	});

	it("unregisters contentKey when toast with unregisterOnDismiss is dismissed", async () => {
		const contentKey = "toaster-test-unregister";
		registerToastContent(contentKey, {
			title: "Will unregister",
			description: "After close",
		});
		render(<AppToaster />);

		await act(async () => {
			toast.success({
				title: "Will unregister",
				meta: { contentKey, unregisterOnDismiss: true },
			});
		});

		await waitFor(() => {
			expect(screen.getByText("Will unregister")).toBeInTheDocument();
		});

		const closeButton = screen.getByRole("button", { name: /close toast/i });
		await act(async () => {
			await userEvent.click(closeButton);
		});

		await waitFor(() => {
			expect(screen.queryByText("Will unregister")).not.toBeInTheDocument();
		});

		await waitFor(
			() => {
				expect(TOAST_CONTENT_REGISTRY[contentKey]).toBeUndefined();
			},
			{ timeout: 200 },
		);
	});
});
