import { styled } from "@linaria/react";
import type React from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const variantColors = {
	success: {
		bg: "#28a745",
		border: "#218838",
		icon: "✓",
	},
	error: {
		bg: "#dc3545",
		border: "#c82333",
		icon: "✕",
	},
	warning: {
		bg: "#ffc107",
		border: "#e0a800",
		icon: "⚠",
	},
	info: {
		bg: "#17a2b8",
		border: "#138496",
		icon: "ℹ",
	},
} as const;

const StyledToast = styled.div<{
	variant: "success" | "error" | "warning" | "info";
	isVisible: boolean;
	isExiting: boolean;
}>`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px 20px;
	background-color: ${(props) => variantColors[props.variant].bg};
	color: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	min-width: 300px;
	max-width: 500px;
	position: relative;
	opacity: ${(props) => (props.isVisible && !props.isExiting ? 1 : 0)};
	transform: ${(props) =>
		props.isVisible && !props.isExiting
			? "translateY(0)"
			: "translateY(-10px)"};
	transition: opacity 0.3s ease, transform 0.3s ease;
	pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};
	z-index: 10000;
`;

const ToastIcon = styled.div`
	font-size: 20px;
	font-weight: bold;
	flex-shrink: 0;
	line-height: 1;
	margin-top: 2px;
`;

const ToastContent = styled.div`
	flex: 1;
	min-width: 0;
`;

const ToastTitle = styled.div`
	font-weight: 600;
	font-size: 16px;
	margin-bottom: 4px;
	line-height: 1.4;
`;

const ToastMessage = styled.div`
	font-size: 14px;
	line-height: 1.5;
	opacity: 0.95;
`;

const ToastCloseButton = styled.button`
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	font-size: 20px;
	line-height: 1;
	padding: 0;
	margin-left: 8px;
	opacity: 0.8;
	transition: opacity 0.2s ease;
	flex-shrink: 0;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		opacity: 1;
	}

	&:focus {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
		border-radius: 2px;
	}
`;

const ToastAction = styled.button`
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: white;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	padding: 6px 12px;
	border-radius: 4px;
	margin-top: 8px;
	transition: background 0.2s ease, border-color 0.2s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.3);
		border-color: rgba(255, 255, 255, 0.4);
	}

	&:focus {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}
`;

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	id: string;
	variant?: ToastVariant;
	message: ReactNode;
	title?: ReactNode;
	duration?: number;
	preventAutoDismiss?: boolean;
	onClose: () => void;
	action?: {
		label: string;
		onClick: () => void;
	};
	showCloseButton?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
	id,
	variant = "info",
	message,
	title,
	duration = 5000,
	preventAutoDismiss = false,
	onClose,
	action,
	showCloseButton = true,
	className,
	...props
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pauseRef = useRef(false);

	const handleClose = useCallback(() => {
		if (isExiting) return;

		setIsExiting(true);
		// Wait for exit animation before calling onClose
		setTimeout(() => {
			onClose();
		}, 300);
	}, [onClose, isExiting]);

	// Show animation on mount
	useEffect(() => {
		// Small delay to trigger animation
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 10);

		return () => clearTimeout(timer);
	}, []);

	// Auto-dismiss timer
	useEffect(() => {
		if (preventAutoDismiss || duration === 0 || pauseRef.current) return;

		timeoutRef.current = setTimeout(() => {
			handleClose();
		}, duration);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [duration, preventAutoDismiss, handleClose]);

	const handlePause = () => {
		pauseRef.current = true;
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	const handleResume = () => {
		pauseRef.current = false;
		if (preventAutoDismiss || duration === 0) return;
		timeoutRef.current = setTimeout(() => {
			handleClose();
		}, duration);
	};

	return (
		<StyledToast
			variant={variant}
			isVisible={isVisible}
			isExiting={isExiting}
			className={className}
			onMouseEnter={handlePause}
			onMouseLeave={handleResume}
			role="alert"
			aria-live="polite"
			{...props}
		>
			<ToastIcon>{variantColors[variant].icon}</ToastIcon>
			<ToastContent>
				{title && <ToastTitle>{title}</ToastTitle>}
				<ToastMessage>{message}</ToastMessage>
				{action && (
					<ToastAction
						type="button"
						onClick={() => {
							action.onClick();
							handleClose();
						}}
					>
						{action.label}
					</ToastAction>
				)}
			</ToastContent>
			{showCloseButton && (
				<ToastCloseButton
					type="button"
					onClick={handleClose}
					aria-label="Close toast"
				>
					×
				</ToastCloseButton>
			)}
		</StyledToast>
	);
};
