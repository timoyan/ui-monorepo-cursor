#!/usr/bin/env node

/**
 * Simple test server for module-library components.
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 8000;
const TEST_DIR = path.join(__dirname, "test");
const DIST_DIR = path.join(__dirname, "dist");

const MIME_TYPES = {
	".html": "text/html",
	".js": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".map": "application/json",
};

// Ensure the resolved path is under rootDir (including rootDir itself).
function isWithinRoot(resolvedPath, rootDir) {
	const normalizedRoot = path.resolve(rootDir);
	const normalizedPath = path.resolve(resolvedPath);
	return (
		normalizedPath === normalizedRoot ||
		normalizedPath.startsWith(normalizedRoot + path.sep)
	);
}

// Return a safe path for fs (root + relative) only when path is under rootDir; avoids CodeQL path-injection.
function pathUnderRoot(resolvedPath, rootDir) {
	if (!isWithinRoot(resolvedPath, rootDir)) return null;
	const root = path.resolve(rootDir);
	const rel = path.relative(root, path.resolve(resolvedPath));
	// path.relative does not produce ".." when path is under root.
	if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return path.join(root, rel);
}

const server = http.createServer((req, res) => {
	// Parse URL and strip query string.
	const urlPath = req.url.split("?")[0];

	// Serve dist assets (CSS, JS, etc.).
	if (urlPath.startsWith("/dist/")) {
		const relativeDistPath = urlPath.replace(/^\/dist\//, "");
		const resolvedDistPath = path.resolve(DIST_DIR, relativeDistPath);
		const safeDistPath = pathUnderRoot(resolvedDistPath, DIST_DIR);
		if (safeDistPath === null) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		let pathToRead = safeDistPath;
		if (fs.existsSync(safeDistPath)) {
			try {
				const canonical = fs.realpathSync(safeDistPath);
				const realDistDir = fs.realpathSync(DIST_DIR);
				if (
					canonical !== realDistDir &&
					!canonical.startsWith(realDistDir + path.sep)
				) {
					res.writeHead(403);
					res.end("Forbidden");
					return;
				}
				pathToRead = canonical;
			} catch {
				// Keep pathUnderRoot result when realpath fails.
			}
		}
		if (!fs.existsSync(pathToRead)) {
			res.writeHead(404);
			res.end("File not found");
			return;
		}
		const ext = path.extname(pathToRead);
		const contentType = MIME_TYPES[ext] || "application/octet-stream";
		const content = fs.readFileSync(pathToRead);
		res.writeHead(200, { "Content-Type": contentType });
		res.end(content, "utf-8");
		return;
	}

	// Serve test dir: treat url as relative (strip leading slashes) then resolve.
	const requestedPath =
		urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
	const resolvedTestPath = path.resolve(TEST_DIR, requestedPath);
	const safePath = pathUnderRoot(resolvedTestPath, TEST_DIR);
	if (safePath === null) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}
	let pathToRead = safePath;
	if (fs.existsSync(safePath)) {
		try {
			const canonical = fs.realpathSync(safePath);
			const realTestDir = fs.realpathSync(TEST_DIR);
			if (
				canonical !== realTestDir &&
				!canonical.startsWith(realTestDir + path.sep)
			) {
				res.writeHead(403);
				res.end("Forbidden");
				return;
			}
			pathToRead = canonical;
		} catch {
			// Keep pathUnderRoot result when realpath fails.
		}
	}

	// If the request is for a directory, serve index.html inside it.
	if (fs.existsSync(pathToRead) && fs.statSync(pathToRead).isDirectory()) {
		const indexResolved = path.resolve(pathToRead, "index.html");
		const indexSafe = pathUnderRoot(indexResolved, TEST_DIR);
		if (indexSafe === null) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		pathToRead = indexSafe;
	}

	// Return 404 if file does not exist.
	if (!fs.existsSync(pathToRead)) {
		res.writeHead(404);
		res.end("File not found");
		return;
	}

	fs.readFile(pathToRead, (err, content) => {
		if (err) {
			if (err.code === "ENOENT") {
				res.writeHead(404);
				res.end("File not found");
			} else {
				res.writeHead(500);
				res.end(`Server error: ${err.code}`);
			}
		} else {
			const ext = path.extname(pathToRead);
			const contentType = MIME_TYPES[ext] || "application/octet-stream";
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
});

server.listen(PORT, () => {
	console.log("\n🚀 Test server running");
	console.log("📦 Serving module-library components");
	console.log(`\n📍 http://localhost:${PORT}`);
	console.log("\nPress Ctrl+C to stop\n");
});
