import { useEffect, useState } from "react";
import { devOptions } from "@/mocks/config";

/**
 * Starts the MSW worker in development and returns whether it is ready.
 * In dev, wait for this before rendering so the first API requests are mocked.
 * Initial state is false in dev (server and client) to avoid hydration mismatch;
 * production (and server) use true so the app renders immediately.
 */
export function useMSWReady(): boolean {
	const [ready, setReady] = useState(
		() => process.env.NODE_ENV !== "development",
	);

	useEffect(() => {
		if (
			process.env.NODE_ENV !== "development" ||
			typeof window === "undefined"
		) {
			return;
		}
		import("@/mocks/browser").then(({ worker }) =>
			worker
				.start({
					serviceWorker: {
						url: "/api/msw/worker",
						options: { scope: "/" },
					},
					...devOptions,
				})
				.then(() => setReady(true)),
		);
	}, []);

	return ready;
}
