import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ModuleContainer } from "@/components/layout/module-container";

describe("ModuleContainer", () => {
	describe("non-collapsible mode", () => {
		it("renders children", () => {
			render(
				<ModuleContainer>
					<span>Inner content</span>
				</ModuleContainer>,
			);
			expect(screen.getByText("Inner content")).toBeInTheDocument();
		});

		it("renders title as h2 when provided", () => {
			render(
				<ModuleContainer title="Section Title">
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(
				screen.getByRole("heading", { level: 2, name: /section title/i }),
			).toBeInTheDocument();
			expect(screen.getByText("Body")).toBeInTheDocument();
		});

		it("does not render heading when title is not provided", () => {
			render(
				<ModuleContainer>
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(screen.queryByRole("heading")).not.toBeInTheDocument();
			expect(screen.getByText("Body")).toBeInTheDocument();
		});

		it("renders section by default", () => {
			const { container } = render(
				<ModuleContainer>
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(container.querySelector("section")).toBeInTheDocument();
		});

		it("renders div when asWrapper is true", () => {
			const { container } = render(
				<ModuleContainer asWrapper>
					<div>Body</div>
				</ModuleContainer>,
			);
			const wrapper = container.firstChild;
			expect(wrapper?.nodeName).toBe("DIV");
			expect(screen.getByText("Body")).toBeInTheDocument();
		});

		it("sets data-module when moduleId is provided", () => {
			render(
				<ModuleContainer moduleId="my-module">
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(
				document.querySelector("[data-module='my-module']"),
			).toBeInTheDocument();
		});
	});

	describe("collapsible mode", () => {
		it("renders accordion trigger with title", () => {
			render(
				<ModuleContainer title="Collapse Me" collapsible>
					<div>Hidden body</div>
				</ModuleContainer>,
			);
			expect(
				screen.getByRole("button", { name: /collapse me/i }),
			).toBeInTheDocument();
			expect(screen.getByText("Hidden body")).toBeInTheDocument();
		});

		it("uses Content as trigger label when title is not provided", () => {
			render(
				<ModuleContainer collapsible>
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(
				screen.getByRole("button", { name: /content/i }),
			).toBeInTheDocument();
		});

		it("expands content by default when defaultOpen is true", () => {
			render(
				<ModuleContainer title="Toggle" collapsible defaultOpen>
					<div>Body</div>
				</ModuleContainer>,
			);
			const trigger = screen.getByRole("button", { name: /toggle/i });
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(screen.getByText("Body")).toBeInTheDocument();
		});

		it("starts collapsed when defaultOpen is false (uncontrolled)", () => {
			render(
				<ModuleContainer title="Toggle" collapsible defaultOpen={false}>
					<div>Body</div>
				</ModuleContainer>,
			);
			const trigger = screen.getByRole("button", { name: /toggle/i });
			expect(trigger).toHaveAttribute("aria-expanded", "false");
		});

		it("toggles content when trigger is clicked", async () => {
			render(
				<ModuleContainer title="Toggle" collapsible defaultOpen>
					<div>Body</div>
				</ModuleContainer>,
			);
			const trigger = screen.getByRole("button", { name: /toggle/i });
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			await act(async () => {
				await userEvent.click(trigger);
			});
			expect(trigger).toHaveAttribute("aria-expanded", "false");
		});

		it("calls onValueChange when controlled and trigger is clicked", async () => {
			const onValueChange = vi.fn();
			render(
				<ModuleContainer
					title="Toggle"
					collapsible
					value={[]}
					onValueChange={onValueChange}
				>
					<div>Body</div>
				</ModuleContainer>,
			);
			const trigger = screen.getByRole("button", { name: /toggle/i });
			await act(async () => {
				await userEvent.click(trigger);
			});
			expect(onValueChange).toHaveBeenCalledWith(
				expect.objectContaining({ value: ["module-content"] }),
			);
		});

		it("sets data-module when moduleId is provided in collapsible mode", () => {
			render(
				<ModuleContainer moduleId="accordion-module" title="Title" collapsible>
					<div>Body</div>
				</ModuleContainer>,
			);
			expect(
				document.querySelector("[data-module='accordion-module']"),
			).toBeInTheDocument();
		});
	});
});
