import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { ModuleA } from "@/modules/a";

describe("ModuleA", () => {
	it("renders accordion triggers for PandaCSS and Ark UI", () => {
		render(<ModuleA />);
		expect(
			screen.getByRole("button", { name: /what is pandacss\?/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /what is ark ui\?/i }),
		).toBeInTheDocument();
	});

	it("renders PandaCSS content when first item is expanded by default", () => {
		render(<ModuleA />);
		expect(
			screen.getByText(/PandaCSS is a build-time CSS-in-JS framework/i),
		).toBeInTheDocument();
	});

	it("renders Ark UI content when second trigger is clicked", async () => {
		render(<ModuleA />);
		const arkTrigger = screen.getByRole("button", {
			name: /what is ark ui\?/i,
		});
		await act(async () => {
			await userEvent.click(arkTrigger);
		});
		expect(
			screen.getByText(/Ark UI is a headless, accessible component library/i),
		).toBeInTheDocument();
	});

	it("has exactly two accordion items", () => {
		render(<ModuleA />);
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(2);
	});
});
