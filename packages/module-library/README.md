# Module Library

框架無關的共享組件庫，使用 **Stencil.js** 和 **Zag.js** 構建。

## 特性

- ✅ 使用 **Scoped CSS** 進行樣式封裝
- ✅ 框架無關的 Web Components
- ✅ 支援 React、Vue、Angular 等框架
- ✅ TypeScript 完整支援
- ✅ 使用 Zag.js 提供無頭 UI 邏輯

## 安裝

```bash
pnpm add module-library
```

## 使用方式

### 作為 Web Components

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="module-library/dist/module-library/module-library.esm.js"></script>
</head>
<body>
  <my-button variant="primary">Click me</my-button>
</body>
</html>
```

### 在 React/Next.js 中使用

```tsx
import { MyButton } from 'module-library/react';
import 'module-library/components/my-button/my-button.css';

export default function Page() {
  return (
    <MyButton variant="primary" onClick={() => console.log('clicked')}>
      Click me
    </MyButton>
  );
}
```

### 在 Vue 中使用

```vue
<template>
  <my-button variant="primary" @buttonClick="handleClick">
    Click me
  </my-button>
</template>

<script setup>
import 'module-library/components/my-button/my-button.css';

function handleClick(event) {
  console.log('clicked', event);
}
</script>
```

## 組件

### MyButton

基礎按鈕組件，支援多種變體和尺寸。

**Props:**
- `variant`: `'primary' | 'secondary' | 'success' | 'danger'` (預設: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (預設: `'md'`)
- `disabled`: `boolean` (預設: `false`)
- `type`: `'button' | 'submit' | 'reset'` (預設: `'button'`)

**Events:**
- `buttonClick`: 點擊事件

**範例:**
```tsx
<MyButton variant="primary" size="md">Primary</MyButton>
<MyButton variant="secondary">Secondary</MyButton>
<MyButton variant="success" size="lg">Success</MyButton>
<MyButton variant="danger" disabled>Danger</MyButton>
```

## 主題定制

使用 CSS 變數可以輕鬆定制主題：

```css
my-button {
  --button-primary-bg: #28a745;
  --button-primary-hover: #218838;
}
```

## 開發

```bash
# 安裝依賴
pnpm install

# 開發模式（監聽文件變化）
pnpm build:watch

# 構建
pnpm build

# 測試
pnpm test
```

## 技術棧

- **Stencil.js**: Web Components 構建工具
- **Zag.js**: 無頭 UI 狀態機
- **TypeScript**: 類型安全
- **Scoped CSS**: 樣式封裝

