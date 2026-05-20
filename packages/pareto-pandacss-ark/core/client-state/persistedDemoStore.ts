"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "pareto-pandacss-ark:demo-client-state";
const STORE_VERSION = 2;
const PERSIST_TTL_MS = 24 * 60 * 60 * 1000;

type PersistedSnapshot = {
	visitCount: number;
	lastPersistedAt: number;
};

export type PersistedDemoState = {
	visitCount: number;
	lastPersistedAt: number;
	sensitiveNoteDraft: string;
	incrementVisits: () => void;
	setSensitiveNoteDraft: (note: string) => void;
	reset: () => void;
};

const INITIAL_STATE: Pick<
	PersistedDemoState,
	"visitCount" | "lastPersistedAt" | "sensitiveNoteDraft"
> = {
	visitCount: 0,
	lastPersistedAt: 0,
	sensitiveNoteDraft: "",
};

/**
 * Example Zustand store with localStorage persistence.
 * `skipHydration` avoids SSR/client mismatch; call `rehydratePersistedDemoStore()` once on the client.
 */
export const usePersistedDemoStore = create<PersistedDemoState>()(
	persist(
		(set) => ({
			...INITIAL_STATE,
			incrementVisits: () => set((s) => ({ visitCount: s.visitCount + 1 })),
			setSensitiveNoteDraft: (note) => set({ sensitiveNoteDraft: note }),
			reset: () => set(INITIAL_STATE),
		}),
		{
			name: STORAGE_KEY,
			version: STORE_VERSION,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				visitCount: state.visitCount,
				lastPersistedAt: Date.now(),
			}),
			migrate: (persistedState, version) => {
				const parsed = persistedState as Partial<PersistedSnapshot> | undefined;
				if (version < STORE_VERSION) {
					return {
						visitCount:
							typeof parsed?.visitCount === "number" ? parsed.visitCount : 0,
						lastPersistedAt:
							typeof parsed?.lastPersistedAt === "number"
								? parsed.lastPersistedAt
								: 0,
					} satisfies PersistedSnapshot;
				}

				return {
					visitCount:
						typeof parsed?.visitCount === "number" ? parsed.visitCount : 0,
					lastPersistedAt:
						typeof parsed?.lastPersistedAt === "number"
							? parsed.lastPersistedAt
							: 0,
				} satisfies PersistedSnapshot;
			},
			onRehydrateStorage: () => (state, error) => {
				if (error || !state) return;
				const isExpired = Date.now() - state.lastPersistedAt > PERSIST_TTL_MS;
				if (!isExpired) return;
				usePersistedDemoStore.setState(INITIAL_STATE);
				void usePersistedDemoStore.persist.clearStorage();
			},
			skipHydration: true,
		},
	),
);

export async function rehydratePersistedDemoStore() {
	await usePersistedDemoStore.persist.rehydrate();
}

export async function clearPersistedDemoStoreOnLogout() {
	usePersistedDemoStore.setState(INITIAL_STATE);
	await usePersistedDemoStore.persist.clearStorage();
}

/**
 * Listen for localStorage updates from other tabs and rehydrate this tab.
 * Browser `storage` events only fire in other documents, so this does not loop.
 */
export function subscribePersistedDemoStoreStorageSync() {
	if (typeof window === "undefined") {
		return () => undefined;
	}

	let scheduled = false;
	let timerId: ReturnType<typeof setTimeout> | undefined;

	const scheduleRehydrate = () => {
		if (scheduled) return;
		scheduled = true;
		timerId = setTimeout(() => {
			scheduled = false;
			void usePersistedDemoStore.persist.rehydrate();
		}, 0);
	};

	const onStorage = (event: StorageEvent) => {
		if (event.storageArea !== localStorage) return;
		if (event.key !== STORAGE_KEY) return;
		scheduleRehydrate();
	};

	// Fallbacks for tabs restored from freeze/sleep where storage events can be delayed or missed.
	const onVisibilityChange = () => {
		if (document.visibilityState !== "visible") return;
		scheduleRehydrate();
	};

	const onPageShow = () => {
		scheduleRehydrate();
	};

	const onFocus = () => {
		scheduleRehydrate();
	};

	window.addEventListener("storage", onStorage);
	window.addEventListener("visibilitychange", onVisibilityChange);
	window.addEventListener("pageshow", onPageShow);
	window.addEventListener("focus", onFocus);

	return () => {
		if (timerId !== undefined) {
			clearTimeout(timerId);
		}
		window.removeEventListener("storage", onStorage);
		window.removeEventListener("visibilitychange", onVisibilityChange);
		window.removeEventListener("pageshow", onPageShow);
		window.removeEventListener("focus", onFocus);
	};
}
