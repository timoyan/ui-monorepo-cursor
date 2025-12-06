#!/usr/bin/env node

/**
 * Script to verify that pnpm overrides are correctly applied and no stale versions exist.
 *
 * Usage:
 *   node scripts/verify-overrides.js [package-name]
 *
 * If package-name is provided, only that package is checked.
 * Otherwise, all packages in pnpm.overrides are checked.
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const rootPackageJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
);

const overrides = rootPackageJson.pnpm?.overrides || {};

if (Object.keys(overrides).length === 0) {
	console.log("ℹ️  No pnpm overrides found in package.json");
	process.exit(0);
}

const packageToCheck = process.argv[2];

// Get packages to check
const packagesToCheck = packageToCheck
	? [packageToCheck]
	: Object.keys(overrides);

let hasErrors = false;
const results = [];

console.log("🔍 Verifying pnpm overrides...\n");

for (const pkg of packagesToCheck) {
	if (!overrides[pkg]) {
		console.log(`⚠️  ${pkg} is not in pnpm.overrides`);
		hasErrors = true;
		continue;
	}

	const expectedVersion = overrides[pkg];
	console.log(`Checking ${pkg} (expected: ${expectedVersion})...`);

	// Handle npm: aliases - extract the actual package name
	// Format: npm:package-name@version or npm:@scope/package@version
	let actualPackageName = pkg;
	if (expectedVersion.startsWith("npm:")) {
		// Match: npm: followed by package name (can include @ for scoped), then @version
		const aliasMatch = expectedVersion.match(/^npm:(.+)@/);
		if (aliasMatch) {
			actualPackageName = aliasMatch[1];
		}
	}

	try {
		// Method 1: Parse lockfile directly (most reliable)
		const lockfilePath = path.join(__dirname, "..", "pnpm-lock.yaml");
		let versions = [];
		let whyOutput = "";

		if (fs.existsSync(lockfilePath)) {
			const lockfileContent = fs.readFileSync(lockfilePath, "utf8");
			// Find all package entries like "package-name@version:" or "package-name@version("
			// For npm aliases, check the actual package name instead
			const packageNameToSearch = actualPackageName;
			// Simple approach: search for package@version pattern
			// Escape special regex chars but keep / as-is (it's not special in regex)
			const packageNameEscaped = packageNameToSearch
				.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
				.replace(/\\\//g, "/"); // Unescape forward slashes

			// Match: optional quote, package name (with word boundary to avoid substring matches),
			// @, version (digits.digits.digits), then : or ( or space or quote
			// For scoped packages, we need to match the @scope/ part, so use a more specific pattern
			const isScoped = packageNameToSearch.startsWith("@");
			const boundaryPattern = isScoped
				? `(^|\\s|['"])` // Start of line, whitespace, or quote for scoped packages
				: `(^|\\s|['"]|[^-])`; // For non-scoped, ensure it's not part of another package name
			const versionRegex = new RegExp(
				`${boundaryPattern}${packageNameEscaped}@(\\d+\\.\\d+\\.\\d+[\\d.]*)`,
				"g",
			);
			const matches = [...lockfileContent.matchAll(versionRegex)];
			// Filter out matches that are part of other package names (e.g., "dir-glob" shouldn't match "glob")
			const validMatches = matches.filter((match) => {
				const beforeMatch = match[0].substring(
					0,
					match[0].indexOf(packageNameToSearch),
				);
				// If there's a character before the package name that's not a boundary, it's invalid
				if (!isScoped && beforeMatch.length > 0) {
					const lastChar = beforeMatch[beforeMatch.length - 1];
					if (/[a-zA-Z0-9]/.test(lastChar)) {
						return false; // Part of another package name
					}
				}
				return true;
			});
			versions = [...new Set(validMatches.map((m) => m[isScoped ? 2 : 2]))]; // Version is in group 2
		}

		// Method 2: Try pnpm why as fallback (use actual package name for aliases)
		if (versions.length === 0) {
			try {
				whyOutput = execSync(`pnpm why ${actualPackageName}`, {
					encoding: "utf8",
					stdio: "pipe",
				});
				// Parse the output to find version numbers
				const versionMatches = whyOutput.match(/(\d+\.\d+\.\d+[^\s]*)/g);
				versions = versionMatches ? [...new Set(versionMatches)] : [];
			} catch {
				// pnpm why might fail if package isn't installed, that's ok
			}
		} else {
			// Still get why output for dependency tree display
			try {
				whyOutput = execSync(`pnpm why ${actualPackageName}`, {
					encoding: "utf8",
					stdio: "pipe",
				});
			} catch {
				// Ignore errors
			}
		}

		if (versions.length === 0) {
			console.log(`  ⚠️  Could not determine version for ${pkg}`);
			console.log(
				"     Package may not be installed or override may not be needed",
			);
			results.push({ package: pkg, status: "unknown", versions: [] });
			continue;
		}

		// Clean versions - remove any trailing characters that might have been captured
		versions = versions.map((v) => v.split(/[^0-9.]/)[0]);

		// Check if all versions match the override
		const allMatch = versions.every((version) => {
			// Handle npm: aliases (e.g., "npm:@babel/plugin-transform-private-property-in-object@^7.23.0")
			if (expectedVersion.startsWith("npm:")) {
				// For npm aliases, check if the version matches the specified range
				const aliasMatch = expectedVersion.match(/@([^@]+)$/);
				if (aliasMatch) {
					const versionSpec = aliasMatch[1];
					// Simple check - if it starts with ^, check major version matches
					if (versionSpec.startsWith("^")) {
						const majorVersion = versionSpec.replace("^", "").split(".")[0];
						return version.startsWith(`${majorVersion}.`);
					}
				}
				return true; // For aliases, we mainly care that it exists
			}
			// For npm aliases, if we found the alias target, consider it valid
			if (expectedVersion.startsWith("npm:")) {
				return true;
			}
			// For range overrides like ">=20.0.2", we need to check if version satisfies
			if (expectedVersion.startsWith(">=")) {
				const minVersion = expectedVersion.replace(">=", "").trim();
				return compareVersions(version, minVersion) >= 0;
			}
			// For range overrides like ">=10.5.0 <11.0.0"
			if (expectedVersion.includes(">=") && expectedVersion.includes("<")) {
				const minMatch = expectedVersion.match(/>=([^\s<]+)/);
				const maxMatch = expectedVersion.match(/<([^\s]+)/);
				if (minMatch && maxMatch) {
					const minVersion = minMatch[1].trim();
					const maxVersion = maxMatch[1].trim();
					return (
						compareVersions(version, minVersion) >= 0 &&
						compareVersions(version, maxVersion) < 0
					);
				}
			}
			// For exact versions or other patterns, do simple string matching
			return version.includes(expectedVersion.replace(/[^0-9.]/g, ""));
		});

		if (allMatch) {
			console.log(
				`  ✅ All instances use compliant version(s): ${versions.join(", ")}`,
			);
			results.push({ package: pkg, status: "ok", versions });
		} else {
			console.log(
				`  ❌ Found non-compliant version(s): ${versions.join(", ")}`,
			);
			console.log(`     Expected: ${expectedVersion}`);
			results.push({ package: pkg, status: "error", versions });
			hasErrors = true;
		}

		// Show dependency tree if available
		if (whyOutput) {
			console.log("  📦 Dependency tree:");
			const lines = whyOutput.split("\n").filter((line) => line.trim());
			let shown = 0;
			for (const line of lines) {
				if (line.includes(pkg) && shown < 10) {
					console.log(`     ${line.trim()}`);
					shown++;
				}
			}
			if (lines.length > 10 && shown === 10) {
				console.log(`     ... (${lines.length - 10} more lines)`);
			}
		}
		console.log("");
	} catch (error) {
		console.log(`  ❌ Error checking ${pkg}: ${error.message}`);
		hasErrors = true;
		results.push({ package: pkg, status: "error", versions: [] });
	}
}

// Summary
console.log("\n📊 Summary:");
for (const { package: pkg, status, versions } of results) {
	const icon = status === "ok" ? "✅" : status === "error" ? "❌" : "⚠️";
	console.log(
		`  ${icon} ${pkg}: ${status} ${versions.length > 0 ? `(${versions.join(", ")})` : ""}`,
	);
}

if (hasErrors) {
	console.log("\n❌ Some overrides are not correctly applied!");
	console.log("\n💡 To fix this:");
	console.log(
		"   1. Remove node_modules: rm -rf node_modules packages/*/node_modules",
	);
	console.log("   2. Remove lockfile: rm pnpm-lock.yaml");
	console.log("   3. Reinstall: pnpm install");
	console.log("   4. Verify again: node scripts/verify-overrides.js");
	process.exit(1);
} else {
	console.log("\n✅ All overrides are correctly applied!");
	process.exit(0);
}

/**
 * Simple version comparison (handles basic cases)
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
	const parts1 = v1.split(".").map(Number);
	const parts2 = v2.split(".").map(Number);

	for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
		const part1 = parts1[i] || 0;
		const part2 = parts2[i] || 0;

		if (part1 < part2) return -1;
		if (part1 > part2) return 1;
	}

	return 0;
}
