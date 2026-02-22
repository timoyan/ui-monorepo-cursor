#!/usr/bin/env node

/**
 * 驗證 test-server.js 路徑安全：正常請求回 200/404，路徑遍歷回 403。
 * 用法：在 module-library 目錄下先建好 dist（可選）並執行
 *   node scripts/verify-test-server.js
 * 腳本會自動啟動 server、發請求、結束 server。
 */

const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");

const PORT = 8000;
const _BASE = `http://localhost:${PORT}`;
const ROOT = path.join(__dirname, "..");

// 使用 path 選項發送，避免 Node 的 URL 正規化路徑（否則 /dist/../x 會變成 /x）
function request(urlPath) {
	return new Promise((resolve) => {
		const req = http.get(
			{ hostname: "localhost", port: PORT, path: urlPath, timeout: 5000 },
			(res) => resolve(res.statusCode),
		);
		req.on("error", () => resolve(null));
		req.on("timeout", () => {
			req.destroy();
			resolve(null);
		});
	});
}

function waitForServer(retries = 20) {
	return new Promise((resolve) => {
		let n = 0;
		const go = () => {
			request("/").then((code) => {
				if (code !== null) {
					resolve(true);
					return;
				}
				n++;
				if (n >= retries) {
					resolve(false);
					return;
				}
				setTimeout(go, 250);
			});
		};
		go();
	});
}

async function main() {
	const serverPath = path.join(ROOT, "test-server.js");
	const child = spawn(process.execPath, [serverPath], {
		cwd: ROOT,
		stdio: ["ignore", "pipe", "pipe"],
	});
	let _stderr = "";
	child.stderr.on("data", (c) => {
		_stderr += c;
	});
	child.stdout.on("data", () => {});

	await new Promise((r) => setTimeout(r, 500));
	const ready = await waitForServer();
	if (!ready) {
		console.error("無法在時間內連上測試伺服器 (port %d)", PORT);
		child.kill();
		process.exit(1);
	}

	// (路徑, 預期狀態碼)。路徑經 resolve 後仍在根目錄內則允許，逃出則 403。
	const cases = [
		["/", 200],
		["/index.html", 200],
		["/dist/../test/index.html", 403], // 從 dist 逃出
		["/dist/../../package.json", 403],
		["/../test/index.html", 200], // resolve 後為 test/index.html，仍在 TEST_DIR 內
		["/test/../../package.json", 403], // 逃出 TEST_DIR
	];

	let failed = 0;
	for (const [urlPath, expected] of cases) {
		const code = await request(urlPath);
		const allowed = Array.isArray(expected)
			? expected.includes(code)
			: code === expected;
		if (!allowed) {
			console.log("FAIL %s => %s (expected %s)", urlPath, code, expected);
			failed++;
		} else {
			console.log("OK   %s => %s", urlPath, code);
		}
	}

	child.kill();
	if (failed > 0) {
		console.error("\n%d 個檢查未通過", failed);
		process.exit(1);
	}
	console.log("\n全部檢查通過");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
