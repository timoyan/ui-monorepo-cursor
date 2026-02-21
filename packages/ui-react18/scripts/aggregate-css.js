const fs = require("node:fs");
const path = require("node:path");

function ensureDir(p) {
	if (!fs.existsSync(p)) {
		fs.mkdirSync(p, { recursive: true });
	}
}

function _readIfExists(p) {
	try {
		return fs.readFileSync(p, "utf8");
	} catch {
		return "";
	}
}

const buildDir = path.resolve(__dirname, "..", "build");
const outDir = path.join(buildDir, "main");
ensureDir(outDir);

function findCss(dir, base) {
	try {
		const files = fs.readdirSync(path.join(dir, base));
		// Prefer non-hashed output name
		if (files.includes("index.css")) {
			return fs.readFileSync(path.join(dir, base, "index.css"), "utf8");
		}
		const match = files.find(
			(f) => f.startsWith("index.") && f.endsWith(".css"),
		);
		return match ? fs.readFileSync(path.join(dir, base, match), "utf8") : "";
	} catch {
		return "";
	}
}

const combined = [findCss(buildDir, "Button"), findCss(buildDir, "Card")]
	.filter(Boolean)
	.join("\n\n");
fs.writeFileSync(path.join(outDir, "main.css"), combined, "utf8");
console.log("Wrote aggregate CSS to", path.join(outDir, "main.css"));
