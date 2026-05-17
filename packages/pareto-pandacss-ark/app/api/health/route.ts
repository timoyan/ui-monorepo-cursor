import type { LoaderContext } from "@paretojs/core";

/** REST health check (same shape as the former app.ts route). */
export function loader(_ctx: LoaderContext) {
	return { status: "ok", uptime: process.uptime() };
}
