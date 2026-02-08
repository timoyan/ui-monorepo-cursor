# Stencil React Output Target 說明

## 概述

**Stencil React Output Target** 是一個工具，用於自動為 Stencil Web Components 生成 React 包裝元件（React Wrapper Components），讓你在 React/Next.js 專案中能夠像使用原生 React 組件一樣使用 Stencil 組件。

## 主要用途

### 1. **自動生成 React 包裝元件**

將 Stencil Web Components 轉換為 React 組件，無需手動編寫適配代碼。

**沒有 React Output Target：**
```tsx
// 需要手動處理事件、ref 等
import { defineCustomElements } from 'module-library/loader';

useEffect(() => {
  const button = buttonRef.current;
  button?.addEventListener('buttonClick', handleClick);
  return () => button?.removeEventListener('buttonClick', handleClick);
}, []);

<my-button ref={buttonRef}>Click me</my-button>
```

**使用 React Output Target：**
```tsx
// 像使用原生 React 組件一樣
import { MyButton } from 'module-library/react';

<MyButton variant="primary" onButtonClick={handleClick}>
  Click me
</MyButton>
```

### 2. **改善開發體驗**

#### ✅ 自動事件處理
- 將 Web Components 的自定義事件轉換為 React 事件處理器
- 無需手動使用 `addEventListener`

#### ✅ Props 類型安全
- 自動生成 TypeScript 類型定義
- 完整的 IDE 自動完成和類型檢查

#### ✅ Ref 支持
- 支持 React ref，可以直接訪問組件實例
- 無需手動處理 DOM 元素

#### ✅ 更好的 React 整合
- 與 React 的生命週期和狀態管理完美整合
- 支持 React Hooks

### 3. **解決的問題**

#### 問題 1：事件處理複雜
```tsx
// ❌ 沒有 React Output Target
const buttonRef = useRef<HTMLElement>(null);
useEffect(() => {
  buttonRef.current?.addEventListener('buttonClick', handleClick);
  return () => buttonRef.current?.removeEventListener('buttonClick', handleClick);
}, []);
```

```tsx
// ✅ 使用 React Output Target
<MyButton onButtonClick={handleClick} />
```

#### 問題 2：類型定義缺失
```tsx
// ❌ 沒有類型定義，容易出錯
<my-button variant="primay">  // typo: primay
```

```tsx
// ✅ 完整的 TypeScript 類型檢查
<MyButton variant="primary">  // TypeScript 會提示錯誤
```

#### 問題 3：Props 傳遞不直觀
```tsx
// ❌ Web Components 使用屬性（attributes）
<my-button variant="primary" size="md" disabled={true} />
```

```tsx
// ✅ React 組件使用 props（更符合 React 習慣）
<MyButton variant="primary" size="md" disabled={true} />
```

## 配置方式

### 在 `stencil.config.ts` 中配置

```typescript
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'module-library',
  
  outputTargets: [
    // 其他輸出目標...
    
    // React 輸出目標
    reactOutputTarget({
      componentCorePackage: 'module-library',  // 包名
      proxiesFile: './react/react-component-lib/components.tsx',  // 生成的 React 組件文件
      includeDefineCustomElements: true,  // 自動定義自定義元素
      includePolyfills: false,  // Next.js 不需要 polyfills
    }),
  ],
};
```

### 生成的輸出

配置後，構建會生成：

```
module-library/
├── dist/                    # Web Components 輸出
├── react/
│   └── react-component-lib/
│       ├── components.tsx   # ✅ 自動生成的 React 組件
│       ├── index.ts
│       └── index.d.ts        # ✅ TypeScript 類型定義
└── package.json
```

## 使用方式

### 在 Next.js 專案中使用

```tsx
// pages/index.tsx
import { MyButton } from 'module-library/react';
import 'module-library/components/my-button/css';

export default function Home() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <MyButton 
      variant="primary" 
      size="md"
      onButtonClick={handleClick}
    >
      Click me
    </MyButton>
  );
}
```

### 對比：使用 vs 不使用

| 特性 | 不使用 React Output Target | 使用 React Output Target |
|------|---------------------------|-------------------------|
| 導入方式 | `import { defineCustomElements } from 'module-library/loader'` | `import { MyButton } from 'module-library/react'` |
| 組件使用 | `<my-button>` (Web Component) | `<MyButton>` (React 組件) |
| 事件處理 | `addEventListener` | `onButtonClick={handler}` |
| 類型檢查 | 需要手動定義 | 自動生成 |
| Ref 支持 | 需要手動處理 | 原生支持 |
| 開發體驗 | 較差 | 優秀 |

## 當前專案狀態

### 目前配置

在 `stencil.config.ts` 中，React Output Target 被註釋掉了：

```typescript
// 3. React 包裝器（暫時註釋，待修復路徑問題）
// reactOutputTarget({
//   componentCorePackage: 'module-library',
//   proxiesFile: './react/react-component-lib/components.tsx',
//   includeDefineCustomElements: true,
//   includePolyfills: false,
// }),
```

### 為什麼被註釋？

之前遇到路徑解析問題，暫時移除以確保構建通過。

### 是否需要啟用？

**建議啟用**，特別是如果你：
- ✅ 主要在 React/Next.js 專案中使用
- ✅ 希望更好的開發體驗
- ✅ 需要完整的 TypeScript 類型支持
- ✅ 不想手動處理事件綁定

**可以不啟用**，如果你：
- ⚠️ 需要在多個框架中使用（React、Vue、Angular）
- ⚠️ 希望保持 Web Components 的標準性
- ⚠️ 不需要 React 特定的功能

## 啟用步驟

1. **修復配置**
   ```typescript
   reactOutputTarget({
     componentCorePackage: 'module-library',
     proxiesFile: './react/react-component-lib/components.tsx',
     includeDefineCustomElements: true,
     includePolyfills: false,
   })
   ```

2. **構建**
   ```bash
   pnpm -F module-library build
   ```

3. **更新 package.json exports**
   ```json
   {
     "exports": {
       "./react": {
         "types": "./react/react-component-lib/index.d.ts",
         "import": "./react/react-component-lib/index.js"
       }
     }
   }
   ```

4. **在 Next.js 中使用**
   ```tsx
   import { MyButton } from 'module-library/react';
   ```

## 總結

**Stencil React Output Target 的主要價值：**

1. 🎯 **簡化使用**：讓 Web Components 在 React 中像原生組件一樣使用
2. 🔒 **類型安全**：自動生成完整的 TypeScript 類型定義
3. 🚀 **開發體驗**：更好的 IDE 支持和錯誤提示
4. ⚡ **性能**：無額外運行時開銷，只是編譯時轉換

**建議**：如果你的主要使用場景是 React/Next.js，強烈建議啟用 React Output Target。

