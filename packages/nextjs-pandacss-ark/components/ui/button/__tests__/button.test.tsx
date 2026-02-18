import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "..";

describe("Button", () => {
	describe("Rendering", () => {
		it("renders with label", () => {
			render(<Button>Click me</Button>);
			expect(
				screen.getByRole("button", { name: /click me/i }),
			).toBeInTheDocument();
		});

		it("renders as button type by default", () => {
			render(<Button>Submit</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("type", "button");
		});

		it("renders all variants", () => {
			const variants = ["primary", "secondary", "danger", "ghost"] as const;
			for (const variant of variants) {
				const { unmount } = render(
					<Button variant={variant}>{variant}</Button>,
				);
				expect(
					screen.getByRole("button", { name: variant }),
				).toBeInTheDocument();
				unmount();
			}
		});

		it("renders all sizes", () => {
			const sizes = ["sm", "md", "lg"] as const;
			for (const size of sizes) {
				const { unmount } = render(<Button size={size}>{size}</Button>);
				expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
				unmount();
			}
		});

		it("renders disabled state", () => {
			render(<Button disabled>Disabled</Button>);
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("renders with fullWidth prop", () => {
			render(<Button fullWidth>Full width</Button>);
			expect(
				screen.getByRole("button", { name: /full width/i }),
			).toBeInTheDocument();
		});
	});

	describe("Interactions", () => {
		it("calls onClick when clicked", async () => {
			const handleClick = vi.fn();
			render(<Button onClick={handleClick}>Click</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("does not call onClick when disabled", async () => {
			const handleClick = vi.fn();
			render(
				<Button disabled onClick={handleClick}>
					Click
				</Button>,
			);
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});
});
