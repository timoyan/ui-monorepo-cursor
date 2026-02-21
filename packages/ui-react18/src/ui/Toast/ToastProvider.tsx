import type React from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { ToastContainer } from "./ToastContainer";
import { type ToastContextValue, useToast } from "./useToast";

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
	children: ReactNode;
	position?:
		| "top-left"
		| "top-right"
		| "top-center"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
	children,
	position = "top-right",
}) => {
	const toast = useToast();

	return (
		<ToastContext.Provider value={toast}>
			{children}
			<ToastContainer toasts={toast.toasts} position={position} />
		</ToastContext.Provider>
	);
};

export const useToastContext = (): ToastContextValue => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
