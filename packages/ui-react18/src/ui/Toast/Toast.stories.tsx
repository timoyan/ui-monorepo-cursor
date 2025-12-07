import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import type { ReactNode } from "react";
import { ToastProvider, useToastContext } from "./ToastProvider";
import type { ToastProviderProps } from "./ToastProvider";
import { Button } from "../Button";

// Wrapper component for stories that need toast functionality
interface ToastDemoProps {
	children: ReactNode;
}

const ToastDemo: React.FC<ToastDemoProps> = ({ children }) => {
	return <ToastProvider>{children}</ToastProvider>;
};

const ToastButtons: React.FC = () => {
	const toast = useToastContext();

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
				<Button
					variant="success"
					onClick={() => toast.success("Operation completed successfully!")}
				>
					Success Toast
				</Button>
				<Button
					variant="danger"
					onClick={() => toast.error("Something went wrong!")}
				>
					Error Toast
				</Button>
				<Button
					variant="primary"
					onClick={() => toast.warning("Please review this action")}
				>
					Warning Toast
				</Button>
				<Button
					variant="secondary"
					onClick={() => toast.info("Here's some information")}
				>
					Info Toast
				</Button>
			</div>
		</div>
	);
};

const meta: Meta<typeof ToastProvider> = {
	title: "UI/Toast",
	component: ToastProvider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<ToastProvider>
				<Story />
			</ToastProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

export const Success: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="success"
					onClick={() => toast.success("Operation completed successfully!")}
				>
					Show Success Toast
				</Button>
			);
		};
		return <Demo />;
	},
};

export const ErrorToast: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="danger"
					onClick={() => toast.error("Something went wrong!")}
				>
					Show Error Toast
				</Button>
			);
		};
		return <Demo />;
	},
};

export const Warning: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="primary"
					onClick={() => toast.warning("Please review this action")}
				>
					Show Warning Toast
				</Button>
			);
		};
		return <Demo />;
	},
};

export const Info: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="secondary"
					onClick={() => toast.info("Here's some information")}
				>
					Show Info Toast
				</Button>
			);
		};
		return <Demo />;
	},
};

export const WithTitle: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="success"
					onClick={() =>
						toast.success("Your changes have been saved", {
							title: "Success",
						})
					}
				>
					Show Toast with Title
				</Button>
			);
		};
		return <Demo />;
	},
};

export const WithAction: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="primary"
					onClick={() =>
						toast.info("File deleted", {
							action: {
								label: "Undo",
								onClick: () => {
									console.log("Undo clicked");
									toast.success("File restored");
								},
							},
						})
					}
				>
					Show Toast with Action
				</Button>
			);
		};
		return <Demo />;
	},
};

export const MultipleToasts: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					<Button
						onClick={() => {
							toast.success("First toast");
							setTimeout(() => toast.info("Second toast"), 300);
							setTimeout(() => toast.warning("Third toast"), 600);
						}}
					>
						Show Multiple Toasts
					</Button>
				</div>
			);
		};
		return <Demo />;
	},
};

export const LongDuration: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="primary"
					onClick={() =>
						toast.info("This toast will stay for 10 seconds", {
							duration: 10000,
						})
					}
				>
					Show Long Duration Toast
				</Button>
			);
		};
		return <Demo />;
	},
};

export const NoAutoDismiss: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="secondary"
					onClick={() =>
						toast.warning("This toast won't auto-dismiss", {
							duration: 0,
						})
					}
				>
					Show Persistent Toast (duration: 0)
				</Button>
			);
		};
		return <Demo />;
	},
};

export const PreventAutoDismiss: Story = {
	render: () => {
		const Demo: React.FC = () => {
			const toast = useToastContext();
			return (
				<Button
					variant="primary"
					onClick={() =>
						toast.info(
							"This toast won't auto-dismiss (preventAutoDismiss: true)",
							{
								preventAutoDismiss: true,
							},
						)
					}
				>
					Show Persistent Toast (preventAutoDismiss)
				</Button>
			);
		};
		return <Demo />;
	},
};

export const AllVariants: Story = {
	render: () => {
		return (
			<ToastProvider>
				<ToastButtons />
			</ToastProvider>
		);
	},
};

interface PositionDemoProps {
	position: ToastProviderProps["position"];
}

export const DifferentPositions: Story = {
	render: () => {
		const PositionDemo: React.FC<PositionDemoProps> = ({ position }) => {
			const toast = useToastContext();
			return (
				<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
					<p style={{ margin: 0, fontWeight: 600 }}>
						Position: {position?.replace("-", " ").toUpperCase()}
					</p>
					<Button onClick={() => toast.success(`Toast from ${position}`)}>
						Show Toast
					</Button>
				</div>
			);
		};

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
				<ToastProvider position="top-left">
					<PositionDemo position="top-left" />
				</ToastProvider>
				<ToastProvider position="top-center">
					<PositionDemo position="top-center" />
				</ToastProvider>
				<ToastProvider position="top-right">
					<PositionDemo position="top-right" />
				</ToastProvider>
				<ToastProvider position="bottom-left">
					<PositionDemo position="bottom-left" />
				</ToastProvider>
				<ToastProvider position="bottom-center">
					<PositionDemo position="bottom-center" />
				</ToastProvider>
				<ToastProvider position="bottom-right">
					<PositionDemo position="bottom-right" />
				</ToastProvider>
			</div>
		);
	},
};
