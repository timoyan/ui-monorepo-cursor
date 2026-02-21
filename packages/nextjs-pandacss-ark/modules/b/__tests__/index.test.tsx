import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	ModuleB,
	ModuleBFullWidthDisabled,
	ModuleBVariantSize,
} from "@/modules/b";

describe("ModuleB", () => {
	it("renders ModuleBVariantSize and ModuleBFullWidthDisabled", () => {
		render(<ModuleB />);
		expect(
			screen.getByRole("button", { name: /primary sm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});
});

describe("ModuleBVariantSize", () => {
	it("renders primary size buttons (SM, MD, LG)", () => {
		render(<ModuleBVariantSize />);
		expect(
			screen.getByRole("button", { name: /primary sm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /primary md/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /primary lg/i }),
		).toBeInTheDocument();
	});

	it("renders secondary, danger, and ghost buttons", () => {
		render(<ModuleBVariantSize />);
		expect(
			screen.getByRole("button", { name: /secondary/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /danger/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /ghost/i })).toBeInTheDocument();
	});
});

describe("ModuleBFullWidthDisabled", () => {
	it("renders Full Width Primary button", () => {
		render(<ModuleBFullWidthDisabled />);
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});

	it("renders disabled Primary and Danger buttons", () => {
		render(<ModuleBFullWidthDisabled />);
		const disabledPrimary = screen.getByRole("button", {
			name: /disabled primary/i,
		});
		const disabledDanger = screen.getByRole("button", {
			name: /disabled danger/i,
		});
		expect(disabledPrimary).toBeDisabled();
		expect(disabledDanger).toBeDisabled();
	});
});
