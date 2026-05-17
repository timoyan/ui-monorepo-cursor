import { toaster } from "./createToaster";

type CreateOptions = Parameters<typeof toaster.create>[0];
type SuccessOptions = Parameters<typeof toaster.success>[0];
type ErrorOptions = Parameters<typeof toaster.error>[0];

/**
 * Meta for toast: only pass string keys (e.g. contentKey) so Zag.js state stays serializable.
 * Use contentKey to look up custom icon/title in TOAST_CONTENT_REGISTRY (see Toaster).
 */
export interface ToastMeta {
	/** String key for toastContentRegistry; Toaster renders config.icon and config.title/description. */
	contentKey?: string;
	/** If true, the Toaster will call unregisterToastContent(contentKey) when this toast is dismissed. Use for dynamic content to avoid registry growth. */
	unregisterOnDismiss?: boolean;
}

const SUCCESS_AUTO_DURATION_MS = 5000;
const NO_AUTO_CLOSE_MS = 86400000; // 24 hours

/**
 * Centralized toast API. Use in components via useToast(), or import from toastApi in non-React code.
 *
 * - Success toasts auto-dismiss after 5s; error/info/warning/create do not auto-close
 *   (pass duration in options to override).
 * - In React effects (useEffect/useLayoutEffect): wrap in queueMicrotask to avoid
 *   flushSync warnings, e.g. queueMicrotask(() => toast.success({ title: "Done" })).
 * - In event handlers: call directly, e.g. toast.error({ title: "Failed" }).
 */
export const toast = {
	create: (options: CreateOptions) =>
		toaster.create({
			...options,
			duration: options.duration ?? NO_AUTO_CLOSE_MS,
		}),
	success: (options: SuccessOptions) =>
		toaster.success({
			...options,
			duration:
				(options as { duration?: number }).duration ?? SUCCESS_AUTO_DURATION_MS,
		}),
	error: (options: ErrorOptions) =>
		toaster.error({
			...options,
			duration: (options as { duration?: number }).duration ?? NO_AUTO_CLOSE_MS,
		}),
	info: (options: CreateOptions) =>
		toaster.create({
			...options,
			type: "info",
			duration: options.duration ?? NO_AUTO_CLOSE_MS,
		}),
	warning: (options: CreateOptions) =>
		toaster.create({
			...options,
			type: "warning",
			duration: options.duration ?? NO_AUTO_CLOSE_MS,
		}),
	dismiss: (id: string) => toaster.dismiss(id),
};
