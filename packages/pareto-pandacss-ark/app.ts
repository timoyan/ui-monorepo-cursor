import { securityHeaders } from "@paretojs/core/node";
import express from "express";

const app = express();

app.use(securityHeaders());

app.use((_req, res, next) => {
	res.setHeader("X-Request-Id", crypto.randomUUID());
	next();
});

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok", uptime: process.uptime() });
});

export default app;
