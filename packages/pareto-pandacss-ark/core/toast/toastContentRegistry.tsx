"use client";

import type { ReactNode } from "react";

/**
 * Config for a registry entry. Components live here in React scope, not in Zag.js state,
 * so we avoid Proxy-wrapped React elements and "run called with illegal receiver".
 * Use the registry for icons, custom styles, or HTML: set title/description to a ReactNode
 * (e.g. <span dangerouslySetInnerHTML={{ __html: "..." }} /> or a small component).
 * The toast layer does not parse HTML strings; render HTML in the registry entry yourself.
 */
export interface ToastContentConfig {
	title?: string | ReactNode;
	description?: string | ReactNode;
	icon?: ReactNode;
}

const registry: Record<string, ToastContentConfig> = {
	"success-with-icon": {
		title: "Success",
		description: "Done with custom icon from registry.",
		icon: (
			<span aria-hidden style={{ marginRight: "0.5rem" }}>
				✓
			</span>
		),
	},
	"warning-with-icon": {
		title: "Warning",
		description: "Check your input.",
		icon: (
			<span aria-hidden style={{ marginRight: "0.5rem" }}>
				⚠️
			</span>
		),
	},
};

/**
 * Global registry of toast content by string key. Toaster looks up by meta.contentKey at render time.
 * Register entries before showing toasts (e.g. in module init or layout) via registerToastContent.
 */
export const TOAST_CONTENT_REGISTRY: Record<string, ToastContentConfig> =
	registry;

/**
 * Register a toast content entry in the global registry. Call before showing toasts that use this contentKey.
 * Safe to call at module load (e.g. when a feature module is imported) so entries are ready when the user triggers a toast.
 */
export function registerToastContent(
	key: string,
	config: ToastContentConfig,
): void {
	registry[key] = config;
}

/**
 * Remove a toast content entry from the global registry. Use for **dynamic** content (e.g. one-off keys per toast)
 * so entries do not accumulate and cause memory leaks. After the toast is dismissed, call this with the same
 * contentKey you used when registering. For static/named keys (e.g. "success-save"), unregister is optional.
 */
export function unregisterToastContent(key: string): void {
	delete registry[key];
}

export type ToastContentKey = string;
