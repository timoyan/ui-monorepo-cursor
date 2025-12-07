import { useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { Toast } from "./Toast";
import type { ToastVariant } from "./Toast";

export interface ToastItem {
	id: string;
	component: ReactNode;
}

export interface ToastOptions {
	variant?: ToastVariant;
	title?: ReactNode;
	duration?: number;
	preventAutoDismiss?: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
	showCloseButton?: boolean;
}

export interface ToastContextValue {
	toasts: ToastItem[];
	show: (message: ReactNode, options?: ToastOptions) => string;
	success: (
		message: ReactNode,
		options?: Omit<ToastOptions, "variant">,
	) => string;
	error: (
		message: ReactNode,
		options?: Omit<ToastOptions, "variant">,
	) => string;
	warning: (
		message: ReactNode,
		options?: Omit<ToastOptions, "variant">,
	) => string;
	info: (message: ReactNode, options?: Omit<ToastOptions, "variant">) => string;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

export const useToast = (): ToastContextValue => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const idCounterRef = useRef(0);

	const generateId = useCallback(() => {
		idCounterRef.current += 1;
		return `toast-${idCounterRef.current}-${Date.now()}`;
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const dismissAll = useCallback(() => {
		setToasts([]);
	}, []);

	const show = useCallback(
		(message: ReactNode, options?: ToastOptions): string => {
			const id = generateId();
			const {
				variant = "info",
				title,
				duration = 5000,
				preventAutoDismiss = false,
				action,
				showCloseButton = true,
			} = options || {};

			const toastComponent = (
				<Toast
					id={id}
					variant={variant}
					message={message}
					title={title}
					duration={duration}
					preventAutoDismiss={preventAutoDismiss}
					onClose={() => dismiss(id)}
					action={action}
					showCloseButton={showCloseButton}
				/>
			);

			setToasts((prev) => [...prev, { id, component: toastComponent }]);

			return id;
		},
		[generateId, dismiss],
	);

	const success = useCallback(
		(message: ReactNode, options?: Omit<ToastOptions, "variant">): string => {
			return show(message, { ...options, variant: "success" });
		},
		[show],
	);

	const error = useCallback(
		(message: ReactNode, options?: Omit<ToastOptions, "variant">): string => {
			return show(message, { ...options, variant: "error" });
		},
		[show],
	);

	const warning = useCallback(
		(message: ReactNode, options?: Omit<ToastOptions, "variant">): string => {
			return show(message, { ...options, variant: "warning" });
		},
		[show],
	);

	const info = useCallback(
		(message: ReactNode, options?: Omit<ToastOptions, "variant">): string => {
			return show(message, { ...options, variant: "info" });
		},
		[show],
	);

	return {
		toasts,
		show,
		success,
		error,
		warning,
		info,
		dismiss,
		dismissAll,
	};
};
