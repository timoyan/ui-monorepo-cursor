# Module Library - Next.js 14 + React 18

使用 `module-library` Web Components 的 Next.js 14 範例專案。

## 技術棧

- **Next.js**: 14.2.35
- **React**: 18.2.0
- **module-library**: Web Components 組件庫

## 安裝

```bash
pnpm install
```

## 開發

```bash
pnpm dev
```

訪問 http://localhost:3000

## 構建

```bash
pnpm build
pnpm start
```

## 使用 module-library

### 1. 在 `_app.tsx` 中初始化

```tsx
import { defineCustomElements } from 'module-library/loader';
import 'module-library/dist/collection/components/my-button/my-button.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    defineCustomElements();
  }, []);
  
  return <Component {...pageProps} />;
}
```

### 2. 在組件中使用

```tsx
<my-button variant="primary" onButtonClick={handleClick}>
  Click me
</my-button>
```

### 3. TypeScript 類型聲明

在 `pages/index.tsx` 中可以看到如何聲明 Web Components 的類型。

## 特性

- ✅ Web Components 支援
- ✅ Scoped CSS 樣式
- ✅ 事件處理
- ✅ TypeScript 類型支援
- ✅ 主題定制（CSS 變數）

