import { createToaster as arkCreateToaster } from "@ark-ui/react/toast";

/**
 * Single app-wide toaster instance. Import this to show toasts from anywhere:
 * - Components (event handlers, useEffect)
 * - Hooks
 *
 * Show/hide is centralized: one Toaster is rendered in layout; all calls
 * use this instance (placement, duration, max are configured here).
 */
export const toaster = arkCreateToaster({
	placement: "top-end",
	overlap: false,
	gap: 12,
	max: 5,
});

export type ToasterInstance = typeof toaster;
