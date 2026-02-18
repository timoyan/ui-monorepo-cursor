import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	Accordion,
	AccordionItem,
	AccordionItemTrigger,
	AccordionItemContent,
} from "..";

describe("Accordion", () => {
	it("renders trigger and content", () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionItemTrigger>Section 1</AccordionItemTrigger>
					<AccordionItemContent>Content 1</AccordionItemContent>
				</AccordionItem>
			</Accordion>,
		);
		expect(screen.getByText("Section 1")).toBeInTheDocument();
		expect(screen.getByText("Content 1")).toBeInTheDocument();
	});

	it("renders multiple items", () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionItemTrigger>Item 1</AccordionItemTrigger>
					<AccordionItemContent>Content 1</AccordionItemContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionItemTrigger>Item 2</AccordionItemTrigger>
					<AccordionItemContent>Content 2</AccordionItemContent>
				</AccordionItem>
			</Accordion>,
		);
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
		expect(screen.getByText("Content 1")).toBeInTheDocument();
		expect(screen.getByText("Content 2")).toBeInTheDocument();
	});

	it("expands content when trigger is clicked", async () => {
		render(
			<Accordion>
				<AccordionItem value="item-1">
					<AccordionItemTrigger>Expand me</AccordionItemTrigger>
					<AccordionItemContent>Hidden content</AccordionItemContent>
				</AccordionItem>
			</Accordion>,
		);
		const trigger = screen.getByRole("button", { name: /expand me/i });
		const content = screen.getByText("Hidden content");
		expect(content).toHaveAttribute("data-state");
		await act(async () => {
			await userEvent.click(trigger);
		});
		expect(trigger).toHaveAttribute("aria-expanded", "true");
	});
});
