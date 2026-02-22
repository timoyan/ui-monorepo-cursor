#!/usr/bin/env node

/**
 * 簡單的測試服務器
 * 用於測試 module-library 組件
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

// 確保給定絕對路徑在 rootDir 之下（含 rootDir 本身）
function isWithinRoot(resolvedPath, rootDir) {
	const normalizedRoot = path.resolve(rootDir);
	const normalizedPath = path.resolve(resolvedPath);
	return (
		normalizedPath === normalizedRoot ||
		normalizedPath.startsWith(normalizedRoot + path.sep)
	);
}

const server = http.createServer((req, res) => {
	// 解析 URL，移除查詢字符串
	const urlPath = req.url.split("?")[0];

	// 處理 dist 目錄的請求（CSS、JS 等資源文件）
	if (urlPath.startsWith("/dist/")) {
		const relativeDistPath = urlPath.replace(/^\/dist\//, "");
		const resolvedDistPath = path.resolve(DIST_DIR, relativeDistPath);
		if (!isWithinRoot(resolvedDistPath, DIST_DIR)) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		let safeDistPath = resolvedDistPath;
		if (fs.existsSync(safeDistPath)) {
			try {
				const canonical = fs.realpathSync(safeDistPath);
				const realDistDir = fs.realpathSync(DIST_DIR);
				if (
					!(
						canonical === realDistDir ||
						canonical.startsWith(realDistDir + path.sep)
					)
				) {
					res.writeHead(403);
					res.end("Forbidden");
					return;
				}
				safeDistPath = canonical;
			} catch {
				// 無法解析 realpath 時沿用 resolved 路徑
			}
		}
		if (!fs.existsSync(safeDistPath)) {
			res.writeHead(404);
			res.end("File not found");
			return;
		}
		const ext = path.extname(safeDistPath);
		const contentType = MIME_TYPES[ext] || "application/octet-stream";
		const content = fs.readFileSync(safeDistPath);
		res.writeHead(200, { "Content-Type": contentType });
		res.end(content, "utf-8");
		return;
	}

	// 處理測試目錄的文件：先換成相對路徑再 resolve，避免把 url 當絕對路徑
	const requestedPath =
		urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
	let safePath = path.resolve(TEST_DIR, requestedPath);
	if (!isWithinRoot(safePath, TEST_DIR)) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}
	if (fs.existsSync(safePath)) {
		try {
			const canonical = fs.realpathSync(safePath);
			const realTestDir = fs.realpathSync(TEST_DIR);
			if (
				!(
					canonical === realTestDir ||
					canonical.startsWith(realTestDir + path.sep)
				)
			) {
				res.writeHead(403);
				res.end("Forbidden");
				return;
			}
			safePath = canonical;
		} catch {
			// 無法解析 realpath 時沿用 resolved 路徑
		}
	}

	// 如果請求的是目錄，嘗試載入 index.html
	if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
		safePath = path.resolve(safePath, "index.html");
		if (!isWithinRoot(safePath, TEST_DIR)) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
	}

	// 如果文件不存在，返回 404
	if (!fs.existsSync(safePath)) {
		res.writeHead(404);
		res.end("File not found");
		return;
	}

	fs.readFile(safePath, (err, content) => {
		if (err) {
			if (err.code === "ENOENT") {
				res.writeHead(404);
				res.end("File not found");
			} else {
				res.writeHead(500);
				res.end(`Server error: ${err.code}`);
			}
		} else {
			const ext = path.extname(safePath);
			const contentType = MIME_TYPES[ext] || "application/octet-stream";
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
});

server.listen(PORT, () => {
	console.log("\n🚀 測試服務器已啟動！");
	console.log("📦 測試 Module Library 組件");
	console.log(`\n📍 訪問地址: http://localhost:${PORT}`);
	console.log("\n按 Ctrl+C 停止服務器\n");
});
