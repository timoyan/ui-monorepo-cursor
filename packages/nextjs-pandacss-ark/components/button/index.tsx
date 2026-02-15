import { styled } from "@/styled-system/jsx";

const StyledButton = styled(
	"button",
	{
		base: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			fontWeight: "medium",
			borderRadius: "md",
			cursor: "pointer",
			transition: "colors 0.2s",
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "blue.500",
				outlineOffset: "2px",
			},
			_disabled: { opacity: 0.5, cursor: "not-allowed" },
		},
		variants: {
			// Use isDisabled for styling so "disabled" is forwarded to the DOM
			isDisabled: {
				true: {},
				false: {},
			},
			variant: {
				primary: {
					bg: "blue.500",
					color: "white",
					_hover: { bg: "blue.600" },
					_active: { bg: "blue.700" },
				},
				secondary: {
					bg: "gray.200",
					color: "gray.800",
					border: "1px solid",
					borderColor: "gray.300",
					_hover: { bg: "gray.300" },
					_active: { bg: "gray.400" },
				},
				danger: {
					bg: "red.500",
					color: "white",
					_hover: { bg: "red.600" },
					_active: { bg: "red.700" },
				},
				ghost: {
					bg: "transparent",
					color: "gray.700",
					_hover: { bg: "gray.100" },
					_active: { bg: "gray.200" },
				},
			},
			size: {
				sm: { px: 3, py: 1.5, fontSize: "sm" },
				md: { px: 4, py: 2, fontSize: "md" },
				lg: { px: 6, py: 3, fontSize: "lg" },
			},
			fullWidth: {
				true: { w: "full" },
				false: { w: "auto" },
			},
		},
		compoundVariants: [
			{
				variant: "primary",
				isDisabled: true,
				css: { _hover: { bg: "blue.500" } },
			},
			{
				variant: "secondary",
				isDisabled: true,
				css: { _hover: { bg: "gray.200" } },
			},
			{
				variant: "danger",
				isDisabled: true,
				css: { _hover: { bg: "red.500" } },
			},
			{
				variant: "ghost",
				isDisabled: true,
				css: { _hover: { bg: "transparent" } },
			},
			{
				size: "lg",
				fullWidth: true,
				css: { py: 3 },
			},
		],
		defaultVariants: {
			variant: "primary",
			size: "md",
			fullWidth: false,
			isDisabled: false,
		},
	},
	{
		defaultProps: { type: "button" },
	},
);

export const Button = (props: React.ComponentProps<typeof StyledButton>) => (
	<StyledButton {...props} isDisabled={props.disabled ?? false} />
);
