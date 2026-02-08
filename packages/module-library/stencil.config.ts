import type { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
import { join } from "node:path";

export const config: Config = {
	namespace: "module-library",

	// 構建優化
	buildEs5: false, // 現代瀏覽器不需要 ES5
	minifyJs: true,
	minifyCss: true,
	sourceMap: true,

	// 注意：@adyen/adyen-web 使用動態 import() 載入，不會被打包
	// 已設置為 peerDependency，由使用方提供

	// 使用 Scoped CSS（而非 Shadow DOM）
	// 這將在每個組件中自動添加 scoped 類名

	outputTargets: [
		// 1. 標準分佈式輸出（推薦用於生產）
		// 注意：類型定義會自動生成到 dist/types/ 目錄
		{
			type: "dist",
			esmLoaderPath: "../loader",
			// 支援代碼分割和懶加載
			// CSS 自動包含在組件中
		},

		// 2. 自定義元素輸出（用於直接使用 Web Components）
		{
			type: "dist-custom-elements",
			customElementsExportBehavior: "auto-define-custom-elements",
			// 單一 bundle，適合簡單場景
			// 注意：CSS 需要手動載入或通過 loader
		},

		// 3. React 包裝器（用於 React/NextJS）
		reactOutputTarget({
			componentCorePackage: "module-library",
			proxiesFile: join(
				__dirname,
				"react",
				"react-component-lib",
				"components.tsx",
			),
			includeDefineCustomElements: true,
			includePolyfills: false,
		}),

		// 4. 可選：文檔輸出
		{
			type: "docs-readme",
		},
	],
};
