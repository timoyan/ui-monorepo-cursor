import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { NextApiRequest, NextApiResponse } from "next";

/** Resolve path to mockServiceWorker.js: try __dirname-relative first, then process.cwd() (for Vercel/Docker). */
function getWorkerPath(): string | null {
	const candidates = [
		// 從 pages/api/msw/ 往上升三層到 package 根目錄
		resolve(__dirname, "..", "..", "..", "msw", "mockServiceWorker.js"),
		join(process.cwd(), "msw", "mockServiceWorker.js"),
	];
	for (const p of candidates) {
		if (existsSync(p)) return p;
	}
	return null;
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
	if (process.env.NODE_ENV !== "development") {
		res.status(404).end();
		return;
	}

	const workerPath = getWorkerPath();
	if (!workerPath) {
		res.status(404).end();
		return;
	}

	try {
		const content = readFileSync(workerPath, "utf-8");
		res
			.status(200)
			.setHeader("Content-Type", "application/javascript")
			.setHeader("Service-Worker-Allowed", "/")
			.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")
			.send(content);
	} catch {
		res.status(404).end();
	}
}
