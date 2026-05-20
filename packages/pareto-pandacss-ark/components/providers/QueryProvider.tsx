"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { createAppQueryClient } from "@/core/query/queryClient";

const QUERY_PERSIST_KEY = "pareto-pandacss-ark:query-cache";
const QUERY_MAX_AGE_MS = 5 * 60_000;

const noopStorage = {
	getItem: async (_key: string) => null,
	setItem: async (_key: string, _value: string) => undefined,
	removeItem: async (_key: string) => undefined,
};

function createLocalStorageAsyncAdapter() {
	if (typeof window === "undefined") {
		return noopStorage;
	}

	return {
		getItem: async (key: string) => window.localStorage.getItem(key),
		setItem: async (key: string, value: string) =>
			window.localStorage.setItem(key, value),
		removeItem: async (key: string) => window.localStorage.removeItem(key),
	};
}

export function AppQueryProvider({ children }: PropsWithChildren) {
	const [queryClient] = useState(() => createAppQueryClient());
	const [persister] = useState(() =>
		createAsyncStoragePersister({
			key: QUERY_PERSIST_KEY,
			storage: createLocalStorageAsyncAdapter(),
		}),
	);

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister,
				maxAge: QUERY_MAX_AGE_MS,
			}}
		>
			{/* @ts-expect-error React 18/19 type mismatch from transitive deps */}
			{children}
		</PersistQueryClientProvider>
	);
}
