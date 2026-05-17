"use client";

import { Toaster as ArkToaster, Toast } from "@ark-ui/react/toast";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { toaster } from "./createToaster";
import {
	TOAST_CONTENT_REGISTRY,
	type ToastContentConfig,
	unregisterToastContent,
} from "./toastContentRegistry";

type ToastMeta = { contentKey?: string; unregisterOnDismiss?: boolean };

/** Ref-count and delayed unregister so we don't unregister during React Strict Mode's fake unmount. */
const unregisterRefCount: Record<string, number> = {};
const unregisterTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};
const UNREGISTER_DELAY_MS = 50;

function scheduleUnregister(contentKey: string): void {
	unregisterRefCount[contentKey] = (unregisterRefCount[contentKey] ?? 0) - 1;
	clearTimeout(unregisterTimeouts[contentKey]);
	unregisterTimeouts[contentKey] = setTimeout(() => {
		if (unregisterRefCount[contentKey] === 0) {
			unregisterToastContent(contentKey);
			delete unregisterRefCount[contentKey];
			delete unregisterTimeouts[contentKey];
		}
	}, UNREGISTER_DELAY_MS);
}

/**
 * Single toast item. Unregisters contentKey from the global registry only when
 * the toast is actually removed (not on React Strict Mode's fake unmount), so
 * one-time dynamic toasts show content correctly.
 */
function ToastItem({
	toast,
}: {
	toast: { title?: string; description?: string; meta?: ToastMeta };
}) {
	const meta = toast.meta as ToastMeta | undefined;
	const contentKey =
		typeof meta?.contentKey === "string" ? meta.contentKey : undefined;
	const unregisterOnDismiss = Boolean(meta?.unregisterOnDismiss);

	useEffect(() => {
		if (!unregisterOnDismiss || !contentKey) return;
		unregisterRefCount[contentKey] = (unregisterRefCount[contentKey] ?? 0) + 1;
		return () => {
			scheduleUnregister(contentKey);
		};
	}, [unregisterOnDismiss, contentKey]);

	const config: ToastContentConfig | undefined = contentKey
		? TOAST_CONTENT_REGISTRY[contentKey]
		: undefined;

	const titleFromConfig = config?.title;
	const descFromConfig = config?.description;
	const title: ReactNode =
		titleFromConfig !== undefined ? titleFromConfig : String(toast.title ?? "");
	const description: ReactNode =
		descFromConfig !== undefined
			? descFromConfig
			: String(toast.description ?? "");

	const hasDescription =
		descFromConfig !== undefined
			? typeof descFromConfig === "string"
				? descFromConfig !== ""
				: true
			: typeof description === "string" && description !== "";

	return (
		<Toast.Root>
			<Toast.Title>
				{/* biome-ignore lint/complexity/noUselessFragments: required for React 19 type compatibility with Ark UI Toast children */}
				<>
					{config?.icon != null ? config.icon : null}
					{title}
				</>
			</Toast.Title>
			{hasDescription ? (
				<Toast.Description>
					{/* biome-ignore lint/complexity/noUselessFragments: required for React 19 type compatibility with Ark UI Toast children */}
					<>{description}</>
				</Toast.Description>
			) : null}
			<Toast.CloseTrigger aria-label="Close toast">
				<span aria-hidden>×</span>
			</Toast.CloseTrigger>
		</Toast.Root>
	);
}

/**
 * Renders the app-wide toast container. Mount once in layout so that
 * toasts triggered via toast.* / toaster.* are displayed.
 *
 * Title and description from options are plain text. For icons, styles, or HTML,
 * use meta.contentKey and register content in the global registry (render HTML
 * in the registry entry yourself; the toast layer does not parse HTML strings).
 * Set meta.unregisterOnDismiss to true for dynamic content so the entry is removed when the toast is dismissed.
 */
export function AppToaster() {
	return (
		<ArkToaster toaster={toaster}>
			{(toast) => (
				<ToastItem
					toast={
						toast as { title?: string; description?: string; meta?: ToastMeta }
					}
				/>
			)}
		</ArkToaster>
	);
}
