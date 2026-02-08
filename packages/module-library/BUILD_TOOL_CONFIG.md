# Bundle Tool 配置說明

## 概述

**Stencil.js 內建完整的構建系統，使用 Rollup 作為底層 bundler，無需額外配置 webpack 或其他 bundle 工具。**

## Stencil.js 內建構建系統

### 核心特性

✅ **無需額外配置**
- Stencil.js 內建 Rollup 作為 bundler
- 自動處理 TypeScript、JSX、CSS
- 內建代碼分割和優化
- 支援多種輸出目標

✅ **開箱即用**
- 只需配置 `stencil.config.ts`
- 無需 webpack.config.js
- 無需 babel.config.json（Stencil 內建處理）

### 與現有方案的對比

| 項目 | ui-react18/ui-react19 | module-library (Stencil) |
|------|----------------------|--------------------------|
| Bundle 工具 | webpack 5 | Rollup (內建) |
| 配置文件 | webpack.config.js | stencil.config.ts |
| CSS 處理 | MiniCssExtractPlugin | 內建處理 |
| TypeScript | tsc + webpack | 內建處理 |
| Babel | babel.config.json | 內建處理 |
| 額外配置 | AggregateCssPlugin | 可選：構建後腳本 |

## 基本配置

### 1. stencil.config.ts（唯一必需的配置文件）

```typescript
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'module-library',
  
  // 構建選項
  buildEs5: false,        // 現代瀏覽器不需要 ES5
  minifyJs: true,         // 生產環境壓縮 JS
  minifyCss: true,        // 生產環境壓縮 CSS
  sourceMap: true,        // 生成 source map
  
  // 輸出目標
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
    },
    {
      type: 'dist-types',
    },
    reactOutputTarget({
      componentCorePackage: 'module-library',
      proxiesFile: '../react/react-component-lib/components.tsx',
      includeDefineCustomElements: true,
      includePolyfills: false,
    }),
  ],
};
```

**這就是全部！** 不需要其他 bundle 工具配置。

## 可選的額外配置

### 1. CSS 聚合腳本（可選）

如果需要聚合所有組件 CSS 到單一文件（類似現有的 `AggregateCssPlugin`），可以添加構建後腳本：

```javascript
// scripts/aggregate-css.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const distDir = path.resolve(__dirname, '../dist');
const cssFiles = glob.sync('components/**/*.css', { cwd: distDir });

const combined = cssFiles
  .map(file => {
    const fullPath = path.join(distDir, file);
    return fs.readFileSync(fullPath, 'utf8');
  })
  .filter(Boolean)
  .join('\n\n');

const outputPath = path.join(distDir, 'module-library.css');
fs.writeFileSync(outputPath, combined, 'utf8');
console.log('聚合 CSS 已寫入:', outputPath);
```

**package.json scripts：**
```json
{
  "scripts": {
    "build": "stencil build && node scripts/aggregate-css.js",
    "build:watch": "stencil build --watch"
  }
}
```

### 2. TypeScript 配置（可選）

Stencil.js 會自動處理 TypeScript，但可以添加 `tsconfig.json` 用於 IDE 支援：

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

### 3. 構建後處理（可選）

如果需要額外的構建後處理，可以添加腳本：

```json
{
  "scripts": {
    "build": "stencil build && npm run postbuild",
    "postbuild": "node scripts/postbuild.js"
  }
}
```

## 不需要的配置

### ❌ 不需要 webpack

Stencil.js 使用 Rollup，不需要 webpack 配置。

### ❌ 不需要 babel

Stencil.js 內建處理 JSX 和現代 JavaScript，不需要 Babel 配置。

### ❌ 不需要 css-loader / style-loader

Stencil.js 自動處理 CSS，不需要額外的 CSS loader。

### ❌ 不需要 MiniCssExtractPlugin

Stencil.js 自動提取和處理 CSS。

## 依賴對比

### ui-react18 需要的依賴

```json
{
  "devDependencies": {
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "babel-loader": "^9.1.3",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "@babel/preset-typescript": "^7.28.5",
    "css-loader": "^6.8.1",
    "mini-css-extract-plugin": "^2.9.4",
    "style-loader": "^3.3.3"
  }
}
```

### module-library 需要的依賴

```json
{
  "devDependencies": {
    "@stencil/core": "^4.0.0",
    "@stencil/react-output-target": "^0.5.0",
    "typescript": "^5.9.3"
  }
}
```

**大幅簡化！** 只需要 Stencil 相關依賴。

## 構建流程

### Stencil.js 構建流程

```
源碼 (TypeScript/JSX)
    ↓
Stencil 編譯器
    ↓
Rollup 打包
    ↓
輸出 (dist/)
```

### 現有 webpack 構建流程

```
源碼 (TypeScript/JSX)
    ↓
Babel 轉譯
    ↓
webpack 打包
    ↓
MiniCssExtractPlugin 提取 CSS
    ↓
AggregateCssPlugin 聚合 CSS
    ↓
輸出 (build/)
```

## 構建腳本對比

### ui-react18

```json
{
  "scripts": {
    "build": "webpack --mode production && tsc -p tsconfig.build.json"
  }
}
```

### module-library

```json
{
  "scripts": {
    "build": "stencil build",
    "build:dev": "stencil build --dev",
    "build:watch": "stencil build --watch"
  }
}
```

**更簡潔！** 一個命令完成所有構建。

## 進階配置（可選）

### 1. 自定義 Rollup 插件

如果需要自定義 Rollup 插件：

```typescript
// stencil.config.ts
import { Config } from '@stencil/core';
import { rollupPlugin } from 'some-rollup-plugin';

export const config: Config = {
  // ...
  rollupPlugins: {
    before: [
      rollupPlugin(),
    ],
  },
};
```

### 2. 外部依賴配置

配置外部依賴（避免打包到 bundle 中）：

```typescript
export const config: Config = {
  // ...
  rollupPlugins: {
    before: [
      require('rollup-plugin-node-resolve')(),
      require('rollup-plugin-commonjs')(),
    ],
  },
  // 或使用 externals
  external: ['@zag-js/core', '@zag-js/dialog'],
};
```

### 3. 構建優化選項

```typescript
export const config: Config = {
  // ...
  buildEs5: false,           // 不構建 ES5（現代瀏覽器）
  minifyJs: true,           // 壓縮 JavaScript
  minifyCss: true,          // 壓縮 CSS
  sourceMap: true,          // 生成 source map
  validateTypes: true,      // 驗證類型
  strictTypeChecking: true,  // 嚴格類型檢查
};
```

## 總結

### ✅ 需要配置

1. **stencil.config.ts** - 唯一必需的配置文件
2. **package.json** - 依賴和腳本
3. **可選：構建後腳本** - 如果需要 CSS 聚合等額外處理

### ❌ 不需要配置

1. ❌ webpack.config.js
2. ❌ babel.config.json
3. ❌ css-loader / style-loader
4. ❌ MiniCssExtractPlugin
5. ❌ 其他 bundle 工具

### 優勢

- ✅ **簡化配置**：只需一個配置文件
- ✅ **內建優化**：自動代碼分割、tree-shaking、壓縮
- ✅ **類型安全**：內建 TypeScript 支援
- ✅ **多框架支援**：自動生成 React、Vue、Angular 適配器
- ✅ **開發體驗**：內建 watch 模式和熱重載

## 參考資料

- [Stencil.js 配置文檔](https://stenciljs.com/docs/config)
- [Stencil.js 構建系統](https://stenciljs.com/docs/build)
- [Rollup 文檔](https://rollupjs.org/)

