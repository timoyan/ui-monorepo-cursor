import { styled } from "@linaria/react";
import type React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ToastItem } from "./useToast";

const Container = styled.div<{
	position:
		| "top-left"
		| "top-right"
		| "top-center"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center";
}>`
	position: fixed;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px;
	pointer-events: none;
	max-width: 100vw;
	box-sizing: border-box;
	top: ${(props) => (props.position.startsWith("top") ? "0" : "auto")};
	bottom: ${(props) => (props.position.startsWith("bottom") ? "0" : "auto")};
	left: ${(props) => {
		if (props.position.endsWith("left")) return "0";
		if (props.position.endsWith("center")) return "50%";
		return "auto";
	}};
	right: ${(props) => (props.position.endsWith("right") ? "0" : "auto")};
	transform: ${(props) =>
		props.position.endsWith("center") ? "translateX(-50%)" : "none"};
	align-items: ${(props) => {
		if (props.position.endsWith("left")) return "flex-start";
		if (props.position.endsWith("right")) return "flex-end";
		if (props.position.endsWith("center")) return "center";
		return "flex-start";
	}};
`;

export interface ToastContainerProps {
	toasts: ToastItem[];
	position?:
		| "top-left"
		| "top-right"
		| "top-center"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center";
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	position = "top-right",
}) => {
	const [isMounted, setIsMounted] = useState(false);

	// Only render portal on client after hydration to avoid SSR mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		// Return empty container during SSR and initial render to match hydration
		return null;
	}

	// Use portal to render toasts at document body level for proper positioning
	return createPortal(
		<Container position={position}>
			{toasts.map((toast) => (
				<div key={toast.id} style={{ pointerEvents: "auto" }}>
					{toast.component}
				</div>
			))}
		</Container>,
		document.body,
	);
};
