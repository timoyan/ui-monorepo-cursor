# CSS 與 Bundle 策略建議

## 概述

本文檔針對 `module-library` 的 CSS 處理和 Bundle 輸出策略提供詳細建議，參考現有 `ui-react18` 和 `ui-react19` 的實踐，並結合 Stencil.js 的特性。

## CSS 處理策略

### 1. Shadow DOM vs Scoped CSS

**推薦：Shadow DOM（預設）**

Stencil.js 支援三種樣式封裝模式：

#### 選項 A：Shadow DOM（推薦）✅

```typescript
@Component({
  tag: 'my-button',
  styleUrl: 'my-button.css',
  shadow: true, // 啟用 Shadow DOM
})
export class MyButton {
  // ...
}
```

**優點：**
- ✅ 完全樣式隔離，不會污染全局樣式
- ✅ 不會被外部樣式影響
- ✅ 符合 Web Components 標準
- ✅ 支援 CSS 變數主題化

**缺點：**
- ⚠️ 外部樣式無法直接影響（需使用 CSS 變數或 ::part()）
- ⚠️ 某些第三方 CSS 框架可能無法直接使用

#### 選項 B：Scoped CSS

```typescript
@Component({
  tag: 'my-button',
  styleUrl: 'my-button.css',
  shadow: false,
  scoped: true,
})
```

**優點：**
- ✅ 類名自動作用域化
- ✅ 外部樣式可以影響（通過類名）

**缺點：**
- ⚠️ 樣式隔離不如 Shadow DOM 徹底
- ⚠️ 可能與外部樣式衝突

#### 選項 C：Global CSS（不推薦）

僅在特殊情況下使用，例如需要與第三方 CSS 框架深度整合。

### 2. CSS 變數主題系統

**推薦做法：使用 CSS Custom Properties**

```css
/* my-button.css */
:host {
  /* 預設主題變數 */
  --button-primary-bg: #007bff;
  --button-primary-hover: #0056b3;
  --button-primary-active: #0056b3;
  --button-primary-text: #ffffff;
  
  --button-secondary-bg: #6c757d;
  --button-secondary-hover: #545b62;
  --button-secondary-text: #ffffff;
  
  /* 尺寸變數 */
  --button-padding-sm: 8px 16px;
  --button-padding-md: 12px 24px;
  --button-padding-lg: 16px 32px;
  
  --button-font-size-sm: 14px;
  --button-font-size-md: 16px;
  --button-font-size-lg: 18px;
  
  --button-border-radius: 6px;
  --button-transition: all 0.2s ease;
  
  display: inline-block;
}

button {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: var(--button-padding-md);
  font-size: var(--button-font-size-md);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  transition: var(--button-transition);
}

button:hover {
  background-color: var(--button-primary-hover);
}

button:active {
  background-color: var(--button-primary-active);
}

/* Variant 支援 */
:host([variant="secondary"]) button {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}

:host([variant="secondary"]) button:hover {
  background-color: var(--button-secondary-hover);
}
```

**外部主題覆蓋：**

```css
/* 在應用層（Next.js）覆蓋主題 */
my-button {
  --button-primary-bg: #28a745;
  --button-primary-hover: #218838;
}

/* 或針對特定實例 */
.my-custom-button {
  --button-primary-bg: #dc3545;
}
```

### 3. CSS Bundle 策略

#### 方案 A：組件級 CSS（推薦）✅

每個組件獨立 CSS 文件，支援按需載入。

**優點：**
- ✅ Tree-shaking 友好
- ✅ 按需載入，減少初始 bundle 大小
- ✅ 與現有 `ui-react18` 的 `./Button/style.css` 模式一致

**使用方式：**
```tsx
// Next.js 中使用
import { MyButton } from 'module-library/react';
import 'module-library/components/my-button/my-button.css';
```

**package.json exports：**
```json
{
  "exports": {
    "./components/my-button/css": {
      "default": "./dist/components/my-button/my-button.css"
    }
  }
}
```

#### 方案 B：聚合 CSS（類似現有 AggregateCssPlugin）

合併所有組件 CSS 到單一文件。

**優點：**
- ✅ 單一 HTTP 請求
- ✅ 適合一次性載入所有組件

**缺點：**
- ⚠️ 無法按需載入
- ⚠️ 即使只使用一個組件也要載入全部 CSS

**使用方式：**
```tsx
// 載入所有樣式
import 'module-library/css';
```

**實現方式：**

Stencil.js 不直接支援聚合 CSS，需要：

1. **選項 1：構建後處理腳本**
```javascript
// scripts/aggregate-css.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const cssFiles = glob.sync('dist/components/**/*.css');
const combined = cssFiles
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n\n');

fs.writeFileSync('dist/module-library.css', combined);
```

2. **選項 2：使用 Stencil 的 `dist` 輸出**
`dist` 輸出會自動處理 CSS，但每個組件仍然是獨立的。

#### 方案 C：自動注入（React 包裝器）

在 React 包裝器中自動載入 CSS。

```typescript
// react-component-lib/index.ts
import { defineCustomElements } from 'module-library/loader';
import 'module-library/css'; // 自動載入

defineCustomElements();
```

**優點：**
- ✅ 使用者無需手動載入 CSS
- ✅ 簡化使用體驗

**缺點：**
- ⚠️ 無法按需載入
- ⚠️ 可能載入不需要的 CSS

### 4. CSS 載入建議

**推薦組合方案：**

1. **開發環境**：組件級 CSS + 自動注入
2. **生產環境**：組件級 CSS + 按需載入（或聚合 CSS）

**Next.js 配置：**

```typescript
// next.config.js
module.exports = {
  // 確保 CSS 文件可以被正確處理
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};
```

## Bundle 輸出策略

### 1. Stencil 輸出目標配置

**推薦配置：多輸出目標組合**

```typescript
// stencil.config.ts
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'module-library',
  
  // 構建優化
  buildEs5: false, // 現代瀏覽器不需要 ES5
  minifyJs: true,
  minifyCss: true,
  sourceMap: true, // 開發時生成 source map
  
  outputTargets: [
    // 1. 標準分佈式輸出（推薦用於生產）
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      // 支援代碼分割和懶加載
      // CSS 自動包含在組件中
    },
    
    // 2. 自定義元素輸出（用於直接使用 Web Components）
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      // 單一 bundle，適合簡單場景
      // 注意：CSS 需要手動載入或通過 loader
    },
    
    // 3. TypeScript 類型定義
    {
      type: 'dist-types',
      // 生成 .d.ts 文件
    },
    
    // 4. React 包裝器（用於 React/NextJS）
    reactOutputTarget({
      componentCorePackage: 'module-library',
      proxiesFile: '../react/react-component-lib/components.tsx',
      includeDefineCustomElements: true, // 自動定義自定義元素
      includePolyfills: false, // Next.js 不需要 polyfills
    }),
    
    // 5. 可選：文檔輸出
    {
      type: 'docs-readme',
    },
  ],
};
```

### 2. Bundle 大小優化

#### Tree-shaking

**配置 package.json：**
```json
{
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/index.js"
    },
    "./components/*": {
      "import": "./dist/components/*/index.js"
    }
  }
}
```

**確保：**
- ✅ 使用 ES modules 輸出
- ✅ 避免 side effects
- ✅ 使用具名導出而非默認導出

#### 代碼分割

Stencil.js 自動按組件分割，但可以進一步優化：

```typescript
// 使用動態 import 實現懶加載
const MyDialog = lazy(() => import('module-library/react').then(m => ({ default: m.MyDialog })));
```

#### 外部依賴處理

**Zag.js 應該作為 peer dependency：**

```json
{
  "peerDependencies": {
    "@zag-js/core": "^1.0.0",
    "@zag-js/dialog": "^1.0.0"
  },
  "devDependencies": {
    "@zag-js/core": "^1.0.0",
    "@zag-js/dialog": "^1.0.0"
  }
}
```

**或在 stencil.config.ts 中配置 externals：**

```typescript
export const config: Config = {
  // ...
  rollupPlugins: {
    before: [
      // 將 Zag.js 標記為 external
      require('rollup-plugin-node-resolve')(),
      require('rollup-plugin-commonjs')(),
    ],
  },
};
```

### 3. package.json exports 配置

**完整配置範例：**

```json
{
  "name": "module-library",
  "version": "0.1.0",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./loader": {
      "import": "./dist/loader/index.js",
      "default": "./dist/loader/index.js"
    },
    "./react": {
      "types": "./react/react-component-lib/index.d.ts",
      "import": "./react/react-component-lib/index.js",
      "default": "./react/react-component-lib/index.js"
    },
    "./css": {
      "default": "./dist/module-library.css"
    },
    "./components/my-button": {
      "types": "./dist/types/components/my-button/index.d.ts",
      "import": "./dist/components/my-button/my-button.js",
      "default": "./dist/components/my-button/my-button.js"
    },
    "./components/my-button/css": {
      "default": "./dist/components/my-button/my-button.css"
    },
    "./components/my-dialog": {
      "types": "./dist/types/components/my-dialog/index.d.ts",
      "import": "./dist/components/my-dialog/my-dialog.js",
      "default": "./dist/components/my-dialog/my-dialog.js"
    },
    "./components/my-dialog/css": {
      "default": "./dist/components/my-dialog/my-dialog.css"
    }
  },
  "files": [
    "dist/",
    "react/",
    "loader/"
  ]
}
```

### 4. 構建腳本

```json
{
  "scripts": {
    "build": "stencil build",
    "build:dev": "stencil build --dev",
    "build:watch": "stencil build --watch",
    "build:prod": "stencil build --prod",
    "test": "stencil test",
    "test:watch": "stencil test --watch"
  }
}
```

## 與現有方案的對比

### ui-react18/ui-react19 方案

**現有做法：**
- ✅ 使用 webpack + MiniCssExtractPlugin
- ✅ 每個組件獨立 CSS 文件
- ✅ 聚合 CSS（main/main.css）
- ✅ ES modules 輸出
- ✅ Tree-shaking 支援

**module-library 方案：**
- ✅ 使用 Stencil.js 內建構建系統
- ✅ Shadow DOM 樣式封裝
- ✅ CSS 變數主題系統
- ✅ 自動代碼分割
- ✅ 多框架適配器

## 推薦方案總結

### CSS 處理

1. **使用 Shadow DOM**（預設）
2. **CSS 變數主題系統**
3. **組件級 CSS + 可選聚合 CSS**
4. **支援按需載入**

### Bundle 輸出

1. **多輸出目標**：`dist` + `dist-custom-elements` + React 適配器
2. **Tree-shaking 優化**：`sideEffects: false`
3. **外部依賴**：Zag.js 作為 peer dependency
4. **代碼分割**：Stencil 自動處理

### 使用體驗

**開發者使用方式：**

```tsx
// 選項 1：按需載入（推薦）
import { MyButton } from 'module-library/react';
import 'module-library/components/my-button/css';

// 選項 2：聚合 CSS
import { MyButton, MyDialog } from 'module-library/react';
import 'module-library/css';

// 選項 3：自動注入（React 包裝器已處理）
import { MyButton } from 'module-library/react';
// CSS 已自動載入
```

## 參考資料

- [Stencil.js 樣式文檔](https://stenciljs.com/docs/styling)
- [Stencil.js 配置文檔](https://stenciljs.com/docs/config)
- [Web Components Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

