import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
	title: "UI/Modal",
	component: Modal,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		open: {
			control: "boolean",
		},
		title: {
			control: "text",
		},
		closeOnEscape: {
			control: "boolean",
		},
		closeOnBackdropClick: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWrapper = ({
	children,
	...args
}: Story["args"] & { children?: ReactNode }) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="primary" onClick={() => setOpen(true)}>
				Open Modal
			</Button>
			<Modal {...args} open={open} onClose={() => setOpen(false)}>
				{children}
			</Modal>
		</>
	);
};

export const Basic: Story = {
	render: () => (
		<ModalWrapper title="Basic Modal">This is a basic modal.</ModalWrapper>
	),
};

export const WithFooter: Story = {
	render: () => (
		<ModalWrapper
			title="Modal with Footer"
			footer={
				<>
					<Button variant="secondary" onClick={() => {}}>
						Cancel
					</Button>
					<Button variant="primary" onClick={() => {}}>
						Confirm
					</Button>
				</>
			}
		>
			This modal has a footer with action buttons.
		</ModalWrapper>
	),
};

export const LongContent: Story = {
	render: () => (
		<ModalWrapper title="Modal with Long Content">
			<div>
				<p>
					This modal contains a lot of content to demonstrate scrolling
					behavior.
				</p>
				{Array.from({ length: 20 }, (_, i) => {
					const id = `long-content-para-${i + 1}`;
					return (
						<p key={id}>
							Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur
							adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</p>
					);
				})}
			</div>
		</ModalWrapper>
	),
};

export const NoEscapeClose: Story = {
	render: () => (
		<ModalWrapper title="Modal - No ESC Close" closeOnEscape={false}>
			This modal cannot be closed with the ESC key. You must use the close
			button or click the backdrop.
		</ModalWrapper>
	),
};

export const NoBackdropClose: Story = {
	render: () => (
		<ModalWrapper
			title="Modal - No Backdrop Close"
			closeOnBackdropClick={false}
		>
			This modal cannot be closed by clicking the backdrop. You must use the
			close button or ESC key.
		</ModalWrapper>
	),
};
