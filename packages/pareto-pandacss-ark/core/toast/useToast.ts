"use client";

import { useCallback } from "react";
import { toast as coreToast, type ToastMeta } from "./toastApi";
import {
	registerToastContent,
	type ToastContentConfig,
} from "./toastContentRegistry";

const NO_AUTO_CLOSE_MS = 86400000;
const SUCCESS_AUTO_DURATION_MS = 5000;

/** Options for registerAndToast: variant and duration; unregisterOnDismiss defaults to true. */
export interface RegisterAndToastOptions {
	type?: "default" | "success" | "error" | "info" | "warning";
	duration?: number;
	/** If true, contentKey is removed from registry when toast is dismissed. Default: true. */
	unregisterOnDismiss?: boolean;
}

function generateContentKey(): string {
	return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Hook that provides:
 * - **toast**: same as core toast API (create, success, error, info, warning, dismiss) for direct toasts.
 * - **registerAndToast**: register content in the global registry, show toast with that content, and by default
 *   unregister when the toast is dismissed (so dynamic one-off content does not leak).
 *
 * Use in components that need either plain toasts or registry-backed toasts with automatic cleanup.
 */
export function useToast() {
	const registerAndToast = useCallback(
		(
			content: ToastContentConfig,
			options?: RegisterAndToastOptions,
		): string => {
			const contentKey = generateContentKey();
			registerToastContent(contentKey, content);

			const unregisterOnDismiss = options?.unregisterOnDismiss ?? true;
			const meta: ToastMeta = { contentKey, unregisterOnDismiss };

			const base = { title: "", meta, duration: options?.duration };

			switch (options?.type) {
				case "success":
					return (
						coreToast.success({
							...base,
							duration: options?.duration ?? SUCCESS_AUTO_DURATION_MS,
						}) ?? ""
					);
				case "error":
					return (
						coreToast.error({
							...base,
							duration: options?.duration ?? NO_AUTO_CLOSE_MS,
						}) ?? ""
					);
				case "info":
					return (
						coreToast.info({
							...base,
							duration: options?.duration ?? NO_AUTO_CLOSE_MS,
						}) ?? ""
					);
				case "warning":
					return (
						coreToast.warning({
							...base,
							duration: options?.duration ?? NO_AUTO_CLOSE_MS,
						}) ?? ""
					);
				default:
					return (
						coreToast.create({
							...base,
							duration: options?.duration ?? NO_AUTO_CLOSE_MS,
						}) ?? ""
					);
			}
		},
		[],
	);

	return {
		/** Direct toast API (create, success, error, info, warning, dismiss). */
		toast: coreToast,
		/** Register content, show toast, and by default unregister when dismissed. */
		registerAndToast,
	};
}
