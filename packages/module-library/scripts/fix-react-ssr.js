#!/usr/bin/env node

/**
 * 修復 React Output Target 生成的組件以支持 SSR
 *
 * 問題：className 在 render 時沒有被轉換為 class，導致 SSR 和客戶端不一致
 * 解決：在 render 方法中將 className 轉換為 class 並添加到 newProps
 */

const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const createComponentPath = join(
	__dirname,
	"..",
	"react",
	"react-component-lib",
	"react-component-lib",
	"createComponent.tsx",
);

try {
	let content = readFileSync(createComponentPath, "utf-8");

	// 檢查是否已經修復過
	if (
		content.includes("// 將 className 轉換為 class 以確保 SSR 和客戶端一致")
	) {
		console.log("✅ React SSR 修復已應用");
		process.exit(0);
	}

	// 查找 newProps 定義的位置（更靈活的正則表達式）
	// 匹配：const newProps: ... = { ... style, ... };
	const newPropsPattern = /const newProps[^=]*= \{[\s\S]*?style,([\s\S]*?)\};/;

	if (!newPropsPattern.test(content)) {
		console.warn("⚠️  無法找到 newProps 定義，跳過修復");
		process.exit(0);
	}

	// 檢查是否已經包含 class 屬性
	if (content.includes("...(className ? { class: className } : {})")) {
		console.log("✅ React SSR 修復已應用");
		process.exit(0);
	}

	// 替換 newProps 定義，在 style 後面添加 className 轉換和 suppressHydrationWarning
	content = content.replace(
		/(const newProps[^=]*= \{[\s\S]*?style,)([\s\S]*?\};)/,
		`$1
        // 將 className 轉換為 class 以確保 SSR 和客戶端一致
        // 這樣可以避免 hydration 警告
        ...(className ? { class: className } : {}),
        // 添加 suppressHydrationWarning 來處理 Stencil Scoped CSS 的類名差異
        // Scoped CSS 會在客戶端自動添加 scoped 類名（如 sc-my-button-h），
        // 但 SSR 時不會，導致 hydration 警告
        suppressHydrationWarning: true,$2`,
	);

	writeFileSync(createComponentPath, content, "utf-8");
	console.log("✅ React SSR 修復已應用");
} catch (error) {
	console.error("❌ 修復 React SSR 時出錯:", error.message);
	process.exit(1);
}
