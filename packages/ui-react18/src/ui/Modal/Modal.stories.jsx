import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button";

export default {
	title: "UI/Modal",
	component: Modal,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		open: {
			control: { type: "boolean" },
		},
		title: {
			control: { type: "text" },
		},
		closeOnEscape: {
			control: { type: "boolean" },
			description: "Allow closing modal with ESC key. Default: true",
		},
		closeOnBackdropClick: {
			control: { type: "boolean" },
			description: "Allow closing modal by clicking backdrop. Default: true",
		},
	},
};

export const Default = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal {...args} open={open} onClose={() => setOpen(false)}>
					This is a simple modal dialog with some content inside.
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal Title",
	},
};

export const WithFooter = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal
					{...args}
					open={open}
					onClose={() => setOpen(false)}
					footer={
						<>
							<Button variant="secondary" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</>
					}
				>
					This modal includes a footer section with action buttons.
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal with Footer",
	},
};

export const NoTitle = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal {...args} open={open} onClose={() => setOpen(false)}>
					This modal has no title, just content.
				</Modal>
			</>
		);
	},
};

export const LongContent = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal {...args} open={open} onClose={() => setOpen(false)}>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Duis aute irure dolor in reprehenderit in voluptate velit esse
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
						cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.
					</p>
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem
						accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
						quae ab illo inventore veritatis et quasi architecto beatae vitae
						dicta sunt explicabo.
					</p>
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal with Long Content",
	},
};

export const PreventEscape = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal
					{...args}
					open={open}
					onClose={() => setOpen(false)}
					closeOnEscape={false}
					footer={
						<>
							<Button variant="secondary" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</>
					}
				>
					<p>
						This modal cannot be closed with the ESC key. You must use the
						Cancel or Confirm button.
					</p>
					<p style={{ fontSize: "14px", color: "#6c757d", marginTop: "12px" }}>
						⚠️ Note: Disabling ESC may impact accessibility. Use with caution.
					</p>
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal - ESC Disabled",
	},
};

export const PreventBackdropClick = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal
					{...args}
					open={open}
					onClose={() => setOpen(false)}
					closeOnBackdropClick={false}
					footer={
						<>
							<Button variant="secondary" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</>
					}
				>
					<p>
						This modal cannot be closed by clicking the backdrop. You can still
						close it with ESC or the buttons.
					</p>
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal - Backdrop Click Disabled",
	},
};

export const PreventBoth = {
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Open Modal</Button>
				<Modal
					{...args}
					open={open}
					onClose={() => setOpen(false)}
					closeOnEscape={false}
					closeOnBackdropClick={false}
					footer={
						<>
							<Button variant="secondary" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button variant="primary" onClick={() => setOpen(false)}>
								Confirm
							</Button>
						</>
					}
				>
					<p>
						This modal can only be closed using the Cancel or Confirm buttons.
						Neither ESC nor backdrop click will close it.
					</p>
					<p style={{ fontSize: "14px", color: "#6c757d", marginTop: "12px" }}>
						⚠️ Note: Disabling ESC may impact accessibility. Use with caution.
					</p>
				</Modal>
			</>
		);
	},
	args: {
		title: "Modal - ESC & Backdrop Disabled",
	},
};
