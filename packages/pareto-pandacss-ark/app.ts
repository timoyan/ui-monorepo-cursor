import { securityHeaders } from "@paretojs/core/node";
import express from "express";

/**
 * Optional custom Express app for shared middleware.
 * GraphQL (/graphql) and REST health (/api/health) are implemented as Pareto
 * resource routes so they work in dev (Vite SSR) and production without Node
 * needing to import TypeScript app.ts directly.
 */
const app = express();

app.use(securityHeaders());

app.use((_req, res, next) => {
	res.setHeader("X-Request-Id", crypto.randomUUID());
	next();
});

export default app;
