import { useEffect } from "react";
import { devOptions } from "@/mocks/config";

export function MSWProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if (
			process.env.NODE_ENV === "development" &&
			typeof window !== "undefined"
		) {
			import("@/mocks/browser").then(({ worker }) => {
				worker.start({
					serviceWorker: { url: "/api/msw/worker" },
					...devOptions,
				});
			});
		}
	}, []);

	return <>{children}</>;
}
