import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { ToastProvider, useToastContext } from "./ToastProvider";

const meta: Meta<typeof ToastProvider> = {
	title: "UI/Toast",
	component: ToastProvider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		position: {
			control: "select",
			options: [
				"top-left",
				"top-right",
				"top-center",
				"bottom-left",
				"bottom-right",
				"bottom-center",
			],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

const ToastDemo = () => {
	const toast = useToastContext();

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<Button
				variant="success"
				onClick={() => toast.success("Operation completed successfully!")}
			>
				Show Success Toast
			</Button>
			<Button
				variant="danger"
				onClick={() => toast.error("An error occurred!")}
			>
				Show Error Toast
			</Button>
			<Button
				variant="secondary"
				onClick={() => toast.warning("Please check your input.")}
			>
				Show Warning Toast
			</Button>
			<Button
				variant="primary"
				onClick={() => toast.info("Here's some information.")}
			>
				Show Info Toast
			</Button>
			<Button
				variant="primary"
				onClick={() =>
					toast.show("Custom toast message", {
						variant: "info",
						title: "Custom Title",
					})
				}
			>
				Show Toast with Title
			</Button>
			<Button
				variant="primary"
				onClick={() =>
					toast.show("This toast has an action button", {
						variant: "info",
						action: {
							label: "Undo",
							onClick: () => {
								console.log("Action clicked!");
							},
						},
					})
				}
			>
				Show Toast with Action
			</Button>
			<Button variant="secondary" onClick={() => toast.dismissAll()}>
				Dismiss All
			</Button>
		</div>
	);
};

export const Default: Story = {
	render: (args) => (
		<ToastProvider {...args}>
			<ToastDemo />
		</ToastProvider>
	),
	args: {
		position: "top-right",
	},
};

export const TopLeft: Story = {
	render: (args) => (
		<ToastProvider {...args}>
			<ToastDemo />
		</ToastProvider>
	),
	args: {
		position: "top-left",
	},
};

export const BottomRight: Story = {
	render: (args) => (
		<ToastProvider {...args}>
			<ToastDemo />
		</ToastProvider>
	),
	args: {
		position: "bottom-right",
	},
};

export const AllVariants: Story = {
	render: () => {
		const AllVariantsDemo = () => {
			const toast = useToastContext();
			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					<Button
						variant="success"
						onClick={() => {
							toast.success("Success message");
							setTimeout(() => toast.error("Error message"), 200);
							setTimeout(() => toast.warning("Warning message"), 400);
							setTimeout(() => toast.info("Info message"), 600);
						}}
					>
						Show All Variants
					</Button>
				</div>
			);
		};

		return (
			<ToastProvider position="top-right">
				<AllVariantsDemo />
			</ToastProvider>
		);
	},
};
