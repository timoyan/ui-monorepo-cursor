import type { NextApiRequest, NextApiResponse } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
	if (process.env.NODE_ENV !== "development") {
		res.status(404).end();
		return;
	}

	try {
		const path = join(process.cwd(), "msw", "mockServiceWorker.js");
		const content = readFileSync(path, "utf-8");
		res
			.status(200)
			.setHeader("Content-Type", "application/javascript")
			.setHeader("Service-Worker-Allowed", "/")
			.send(content);
	} catch {
		res.status(404).end();
	}
}
