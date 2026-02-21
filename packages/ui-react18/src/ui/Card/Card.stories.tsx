import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
	title: "UI/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
		},
		children: {
			control: "text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
	args: {
		children: "This is a basic card with some content.",
	},
};

export const WithTitle: Story = {
	args: {
		title: "Card Title",
		children: "This card has a title and some content.",
	},
};

export const WithFooter: Story = {
	args: {
		title: "Card with Footer",
		children: "This card has both a title and a footer.",
		footer: <Button variant="primary">Action</Button>,
	},
};

export const FullExample: Story = {
	args: {
		title: "Complete Card Example",
		children:
			"This is a complete card example with title, body content, and footer. The card component provides a clean and modern container for displaying information.",
		footer: (
			<div style={{ display: "flex", gap: "8px" }}>
				<Button variant="secondary">Cancel</Button>
				<Button variant="primary">Confirm</Button>
			</div>
		),
	},
};

export const WithoutTitle: Story = {
	args: {
		children: "This card doesn't have a title, just content.",
	},
};
