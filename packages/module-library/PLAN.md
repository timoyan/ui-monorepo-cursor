# Module Library 開發計劃

## 專案概述

創建一個框架無關的共享組件庫 `module-library`，使用 **Stencil.js** 和 **Zag.js** 構建。該庫將提供可在任何框架（React、Vue、Angular、Vanilla JS）中使用的 Web Components，主要使用場景為 React + NextJS 專案。

## 技术选型

### 核心技術
- **Stencil.js**: 用於構建框架無關的 Web Components
  - 生成標準的 Custom Elements
  - 支援 TypeScript
  - 內建優化和 tree-shaking
  - 支援 React、Vue、Angular 等框架的適配器

- **Zag.js**: 用於構建無頭（headless）UI 組件邏輯
  - 框架無關的狀態機
  - 提供可訪問性（a11y）支援
  - 豐富的組件狀態管理（Dialog、Menu、Select、Accordion 等）

### 輔助技術
- **TypeScript**: 類型安全
- **Vitest**: 單元測試
- **Storybook**: 組件文檔和開發環境
- **Biome**: 程式碼格式化和 linting（與 monorepo 保持一致）

## 專案結構

```
packages/module-library/
├── src/
│   ├── components/           # Stencil 组件
│   │   ├── my-button/
│   │   │   ├── my-button.tsx
│   │   │   ├── my-button.css
│   │   │   └── my-button.spec.ts
│   │   ├── my-dialog/
│   │   │   ├── my-dialog.tsx
│   │   │   ├── my-dialog.css
│   │   │   └── my-dialog.spec.ts
│   │   └── index.ts          # 組件匯出
│   ├── utils/                # 工具函數
│   │   └── zag-adapters/     # Zag.js 適配器
│   ├── types/                # TypeScript 類型定義
│   └── index.ts              # 主入口
├── react/                    # React 包裝器（可選）
│   └── react-component-lib/
│       ├── index.ts
│       └── components.tsx
├── stencil.config.ts          # Stencil 配置
├── tsconfig.json             # TypeScript 配置
├── package.json
├── README.md
└── PLAN.md                   # 本文档
```

## 實施步驟

### 階段 1: 專案初始化

#### 1.1 創建 package 目錄結構
- [ ] 創建 `packages/module-library` 目錄
- [ ] 初始化 `package.json`
- [ ] 配置 pnpm workspace 整合

#### 1.2 安裝核心依賴
```json
{
  "dependencies": {
    "@zag-js/core": "^1.x.x",
    "@zag-js/dialog": "^1.x.x",
    "@zag-js/menu": "^1.x.x",
    "@zag-js/select": "^1.x.x",
    "@zag-js/accordion": "^1.x.x"
  },
  "devDependencies": {
    "@stencil/core": "^4.x.x",
    "@stencil/react-output-target": "^0.5.x",
    "@types/node": "^20.x.x",
    "typescript": "^5.9.3",
    "vitest": "^1.0.4"
  }
}
```

#### 1.3 配置 TypeScript
- [ ] 創建 `tsconfig.json`（參考現有 packages）
- [ ] 配置編譯選項和路徑別名

### 階段 2: Stencil.js 配置

#### 2.1 創建 Stencil 配置檔案
- [ ] 創建 `stencil.config.ts`（**唯一必需的配置文件**）
- [ ] **注意**：Stencil.js 內建 Rollup bundler，**無需配置 webpack 或其他 bundle 工具**
- [ ] 配置輸出目標：
  - `dist`: 標準 Web Components
  - `dist-custom-elements`: Custom Elements 構建
  - `dist-types`: TypeScript 類型定義
  - React 輸出目標（用於 React/NextJS 整合）

#### 2.2 配置範例
```typescript
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'module-library',
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
    }),
  ],
};
```

### 階段 3: 整合 Zag.js

#### 3.1 創建 Zag.js 適配器
- [ ] 創建 `src/utils/zag-adapters/` 目錄
- [ ] 實現 Stencil 與 Zag.js 的橋接工具
- [ ] 處理狀態管理和事件綁定

#### 3.2 範例組件：Dialog
- [ ] 使用 `@zag-js/dialog` 創建 Dialog 組件
- [ ] 實現 Stencil 組件包裝
- [ ] 新增樣式和動畫

### 階段 4: 組件開發

#### 4.1 基礎組件
- [ ] **Button**: 基礎按鈕組件
  - 使用 Stencil 原生實現
  - 支援 variant、size、disabled 等屬性
  - 事件處理（click、focus、blur）

- [ ] **Dialog/Modal**: 對話框組件
  - 整合 `@zag-js/dialog`
  - 支援開啟/關閉動畫
  - 可訪問性支援（ARIA）
  - 焦點管理

#### 4.2 複雜組件（使用 Zag.js）
- [ ] **Menu**: 下拉選單
  - 使用 `@zag-js/menu`
  - 鍵盤導航支援
  - 子選單支援

- [ ] **Select**: 選擇器
  - 使用 `@zag-js/select`
  - 搜尋功能
  - 多選支援

- [ ] **Accordion**: 手風琴
  - 使用 `@zag-js/accordion`
  - 展開/收起動畫

#### 4.3 組件開發規範
- [ ] 每個組件包含：
  - `.tsx` 檔案（組件邏輯）
  - `.css` 檔案（樣式，使用 CSS Variables 支援主題）
  - `.spec.ts` 檔案（單元測試）
  - 類型定義（TypeScript interfaces）

### 階段 5: React/NextJS 整合

#### 5.1 React 包裝器
- [ ] 使用 Stencil React Output Target 生成 React 包裝器
- [ ] 確保類型安全
- [ ] 支援 React 事件處理

#### 5.2 NextJS 整合
- [ ] 配置 Next.js 以支援 Web Components
- [ ] 處理 SSR（Server-Side Rendering）
- [ ] 創建範例頁面

#### 5.3 使用範例
```tsx
// 在 Next.js 中使用
import { MyButton, MyDialog } from 'module-library/react';
import 'module-library/dist/module-library.css';

export default function Page() {
  return (
    <>
      <MyButton variant="primary">Click me</MyButton>
      <MyDialog open={true}>
        <p>Dialog content</p>
      </MyDialog>
    </>
  );
}
```

### 階段 6: 構建和匯出配置

#### 6.1 CSS 處理策略

**推薦方案：Shadow DOM + CSS 變數**

Stencil.js 支援三種樣式封裝模式：

1. **Shadow DOM（推薦）** - 完全樣式隔離
   ```typescript
   @Component({
     tag: 'my-button',
     styleUrl: 'my-button.css',
     shadow: true, // 啟用 Shadow DOM
   })
   ```

2. **Scoped CSS** - 類名作用域化
   ```typescript
   @Component({
     tag: 'my-button',
     styleUrl: 'my-button.css',
     shadow: false,
     scoped: true,
   })
   ```

3. **Global CSS** - 全局樣式（不推薦，除非必要）

**CSS 變數主題系統：**
```css
/* my-button.css */
:host {
  /* 預設主題變數 */
  --button-primary-bg: #007bff;
  --button-primary-hover: #0056b3;
  --button-padding: 12px 24px;
  --button-border-radius: 6px;
  --button-font-size: 16px;
  
  /* 允許外部覆蓋 */
  display: inline-block;
}

button {
  background-color: var(--button-primary-bg);
  padding: var(--button-padding);
  border-radius: var(--button-border-radius);
  font-size: var(--button-font-size);
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--button-primary-hover);
}
```

**外部主題覆蓋：**
```css
/* 在應用層覆蓋主題 */
my-button {
  --button-primary-bg: #28a745;
  --button-primary-hover: #218838;
}
```

**CSS Bundle 輸出策略：**

Stencil.js 會自動處理 CSS，但我們需要考慮：

1. **組件級 CSS** - 每個組件獨立 CSS 文件
   - 優點：按需載入，tree-shaking 友好
   - 缺點：多個 HTTP 請求（可通過 HTTP/2 緩解）

2. **聚合 CSS** - 合併所有組件 CSS（類似現有的 AggregateCssPlugin）
   - 優點：單一 CSS 文件，減少請求
   - 缺點：無法按需載入

**建議配置：**
```typescript
// stencil.config.ts
export const config: Config = {
  namespace: 'module-library',
  outputTargets: [
    {
      type: 'dist',
      // CSS 會自動包含在每個組件中
      // 或通過 loader 載入
    },
    {
      type: 'dist-custom-elements',
      // 自定義元素模式，CSS 需要手動載入
    },
  ],
  // 啟用 CSS 優化
  minifyCss: true,
  // 生成 source map（開發時）
  sourceMap: true,
};
```

**CSS 載入方式：**

**選項 A：組件級 CSS（推薦）**
```tsx
// Next.js 中使用
import 'module-library/dist/components/my-button/my-button.css';
import { MyButton } from 'module-library/react';
```

**選項 B：聚合 CSS（類似現有方案）**
```tsx
// 載入所有樣式
import 'module-library/dist/module-library.css';
```

**選項 C：自動注入（React 包裝器）**
```typescript
// react-component-lib/index.ts
// 自動載入 CSS（如果配置了 includeImportCustomElements）
```

#### 6.2 Bundle 輸出策略

**推薦：多輸出目標組合**

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
  
  outputTargets: [
    // 1. 標準分佈式輸出（推薦用於生產）
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      // 支援代碼分割和懶加載
      // CSS 自動包含
    },
    
    // 2. 自定義元素輸出（用於直接使用 Web Components）
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      // 單一 bundle，適合簡單場景
      // 注意：CSS 需要手動載入
    },
    
    // 3. TypeScript 類型定義
    {
      type: 'dist-types',
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

**Bundle 大小優化：**

1. **Tree-shaking**
   - 使用 ES modules 輸出
   - 避免 side effects
   - 配置 `sideEffects: false` 在 package.json

2. **代碼分割**
   - Stencil 自動按組件分割
   - 使用動態 import 實現懶加載

3. **外部依賴**
   - Zag.js 應該作為 peer dependency 或 external
   - 避免重複打包

#### 6.3 package.json 配置

```json
{
  "name": "module-library",
  "version": "0.1.0",
  "private": true,
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./loader": {
      "import": "./dist/loader/index.js"
    },
    "./react": {
      "types": "./react/react-component-lib/index.d.ts",
      "import": "./react/react-component-lib/index.js"
    },
    "./css": {
      "default": "./dist/module-library.css"
    },
    "./components/*": {
      "types": "./dist/types/components/*/index.d.ts",
      "import": "./dist/components/*/index.js",
      "default": "./dist/components/*/index.js"
    },
    "./components/*/css": {
      "default": "./dist/components/*/*.css"
    }
  },
  "files": [
    "dist/",
    "react/",
    "loader/"
  ]
}
```

#### 6.4 構建腳本
- [ ] 配置 `build` 腳本：`stencil build`
- [ ] 配置 `build:watch` 腳本：`stencil build --watch`
- [ ] 配置 `build:dev` 腳本：`stencil build --dev`
- [ ] 配置 `test` 腳本：`stencil test`

### 階段 7: 測試

#### 7.1 單元測試
- [ ] 使用 Vitest 配置測試環境
- [ ] 為每個組件編寫測試
- [ ] 測試 Zag.js 狀態機邏輯

#### 7.2 E2E 測試
- [ ] 整合到現有的 Playwright E2E 測試
- [ ] 在 NextJS 應用中測試組件

### 階段 8: 文檔和範例

#### 8.1 Storybook 整合
- [ ] 配置 Storybook for Web Components
- [ ] 為每個組件創建 stories
- [ ] 文檔化 props 和用法

#### 8.2 README
- [ ] 編寫詳細的 README
- [ ] 包含安裝說明
- [ ] 包含使用範例（React、Vue、Vanilla JS）
- [ ] API 文檔

#### 8.3 範例應用
- [ ] 在 `nextjs14` 或 `nextjs15` 中整合範例
- [ ] 展示各種組件的用法

## 技術細節

### Stencil.js 最佳實踐

1. **組件命名**: 使用 kebab-case，如 `my-button`、`my-dialog`
2. **Props**: 使用 `@Prop()` 裝飾器
3. **Events**: 使用 `@Event()` 裝飾器
4. **State**: 使用 `@State()` 裝飾器
5. **Watch**: 使用 `@Watch()` 監聽屬性變化

### Zag.js 整合模式

```typescript
import { createDialog } from '@zag-js/dialog';
import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'my-dialog',
  styleUrl: 'my-dialog.css',
  shadow: true,
})
export class MyDialog {
  @Prop() open: boolean = false;
  @State() private dialogState: any;

  componentWillLoad() {
    const [state, send] = createDialog({
      open: this.open,
      onOpenChange: (details) => {
        this.open = details.open;
      },
    });
    this.dialogState = { state, send };
  }

  render() {
    return (
      <div>
        {/* 使用 dialogState 渲染 UI */}
      </div>
    );
  }
}
```

### CSS 變數主題支援

```css
:host {
  --button-primary-bg: #007bff;
  --button-primary-hover: #0056b3;
  --button-padding: 12px 24px;
  --button-border-radius: 6px;
}
```

### React 整合注意事項

1. **事件處理**: Stencil 事件需要轉換為 React 事件
2. **Ref 轉發**: 支援 React ref
3. **Props 映射**: 確保 props 正確傳遞

## 依賴關係

### 與現有 packages 的關係

- **獨立包**: `module-library` 不依賴 `ui-react18` 或 `ui-react19`
- **可被使用**: `nextjs14`、`nextjs15` 等應用可以使用 `module-library`
- **共享工具**: 使用相同的 Biome、TypeScript 配置

## 時間估算

- **階段 1-2**: 1-2 天（專案初始化和配置）
- **階段 3**: 1-2 天（Zag.js 整合）
- **階段 4**: 3-5 天（組件開發，取決於組件數量）
- **階段 5**: 1-2 天（React 整合）
- **階段 6**: 0.5 天（構建配置）
- **階段 7**: 2-3 天（測試）
- **階段 8**: 1-2 天（文檔）

**總計**: 約 10-17 個工作日

## 後續優化

1. **效能優化**
   - Tree-shaking 優化
   - 按需載入
   - 程式碼分割

2. **功能增強**
   - 更多 Zag.js 組件整合
   - 主題系統完善
   - 國際化支援

3. **開發體驗**
   - 更好的 TypeScript 類型提示
   - 開發工具和除錯支援
   - 熱重載優化

## 參考資料

- [Stencil.js 官方文檔](https://stenciljs.com/docs/introduction)
- [Zag.js 官方文檔](https://zagjs.com/)
- [Web Components 標準](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Stencil React Output Target](https://github.com/ionic-team/stencil-ds-output-targets)

