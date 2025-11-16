import { Button } from "./Button";

export default {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "secondary", "success", "danger"],
		},
		children: {
			control: { type: "text" },
		},
	},
};

export const Primary = {
	args: {
		variant: "primary",
		children: "Button",
	},
};

export const Secondary = {
	args: {
		variant: "secondary",
		children: "Button",
	},
};

export const Success = {
	args: {
		variant: "success",
		children: "Button",
	},
};

export const Danger = {
	args: {
		variant: "danger",
		children: "Button",
	},
};

export const Disabled = {
	args: {
		variant: "primary",
		children: "Disabled",
		disabled: true,
	},
};
