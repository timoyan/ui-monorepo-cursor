"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	clearPersistedDemoStoreOnLogout,
	rehydratePersistedDemoStore,
	subscribePersistedDemoStoreStorageSync,
	usePersistedDemoStore,
} from "@/core/client-state/persistedDemoStore";
import { styled } from "@/styled-system/jsx";

const DemoRow = styled("div", {
	base: {
		display: "flex",
		flexWrap: "wrap",
		gap: "0.75rem",
		alignItems: "center",
	},
});

const DemoRowSpaced = styled("div", {
	base: {
		display: "flex",
		flexWrap: "wrap",
		gap: "0.75rem",
		alignItems: "center",
		mt: "0.75rem",
	},
});

const NoteInput = styled("input", {
	base: {
		minW: "12rem",
		flex: "1 1 10rem",
		borderWidth: "1px",
		borderColor: "gray.300",
		borderRadius: "md",
		px: "3",
		py: "2",
		fontSize: "sm",
	},
});

const Meta = styled("p", {
	base: {
		fontSize: "sm",
		color: "gray.600",
		mt: "3",
	},
});

export function PersistedStateDemo() {
	const [hydrated, setHydrated] = useState(false);
	const visitCount = usePersistedDemoStore((s) => s.visitCount);
	const sensitiveNoteDraft = usePersistedDemoStore((s) => s.sensitiveNoteDraft);
	const incrementVisits = usePersistedDemoStore((s) => s.incrementVisits);
	const setSensitiveNoteDraft = usePersistedDemoStore(
		(s) => s.setSensitiveNoteDraft,
	);
	const reset = usePersistedDemoStore((s) => s.reset);

	useEffect(() => {
		let unmounted = false;
		void rehydratePersistedDemoStore().finally(() => {
			if (!unmounted) {
				setHydrated(true);
			}
		});
		const unsubscribeStorageSync = subscribePersistedDemoStoreStorageSync();

		return () => {
			unmounted = true;
			unsubscribeStorageSync();
		};
	}, []);

	return (
		<div>
			<DemoRow>
				<Button
					variant="primary"
					size="sm"
					onClick={() => incrementVisits()}
					disabled={!hydrated}
				>
					Visit +1 (persisted)
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => reset()}
					disabled={!hydrated}
				>
					Reset store
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => void clearPersistedDemoStoreOnLogout()}
					disabled={!hydrated}
				>
					Clear on logout
				</Button>
			</DemoRow>
			<DemoRowSpaced>
				<NoteInput
					type="text"
					placeholder="Sensitive note (memory only, not persisted)"
					value={sensitiveNoteDraft}
					onChange={(e) => setSensitiveNoteDraft(e.target.value)}
					disabled={!hydrated}
					aria-label="Sensitive note draft"
				/>
			</DemoRowSpaced>
			<Meta>
				{hydrated
					? `visitCount=${visitCount} is persisted. Sensitive note is memory-only and clears on reload.`
					: "Loading persisted state…"}
			</Meta>
		</div>
	);
}
