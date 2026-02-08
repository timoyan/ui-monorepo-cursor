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

const server = http.createServer((req, res) => {
	// 解析 URL，移除查詢字符串
	const urlPath = req.url.split("?")[0];

	// 處理 dist 目錄的請求（CSS、JS 等資源文件）
	if (urlPath.startsWith("/dist/")) {
		const distPath = path.join(DIST_DIR, urlPath.replace(/^\/dist\//, ""));
		if (fs.existsSync(distPath)) {
			const ext = path.extname(distPath);
			const contentType = MIME_TYPES[ext] || "application/octet-stream";
			const content = fs.readFileSync(distPath);
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
			return;
		}
	}

	// 處理測試目錄的文件
	let filePath = path.join(TEST_DIR, urlPath === "/" ? "index.html" : urlPath);

	// 安全檢查：確保文件在測試目錄或 dist 目錄內
	const allowedDirs = [TEST_DIR, DIST_DIR];
	const isAllowed = allowedDirs.some((dir) => filePath.startsWith(dir));

	if (!isAllowed && !urlPath.startsWith("/dist/")) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}

	// 如果請求的是目錄，嘗試載入 index.html
	if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
		filePath = path.join(filePath, "index.html");
	}

	// 如果文件不存在，返回 404
	if (!fs.existsSync(filePath)) {
		res.writeHead(404);
		res.end(`File not found: ${urlPath}`);
		return;
	}

	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code === "ENOENT") {
				res.writeHead(404);
				res.end("File not found");
			} else {
				res.writeHead(500);
				res.end(`Server error: ${err.code}`);
			}
		} else {
			const ext = path.extname(filePath);
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
