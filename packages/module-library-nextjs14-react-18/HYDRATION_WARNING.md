# Hydration 警告處理說明

## 問題

在使用 SSR 時，會看到以下警告：

```
Warning: Extra attributes from the server: class
    at my-button
```

## 原因

這是因為：
1. **SSR 時**：Web Component 還沒有被定義，Stencil 可能渲染為普通的 HTML，`class` 屬性可能不存在或不同
2. **客戶端 hydration 時**：Web Component 已經被定義，會渲染為自定義元素，`class` 屬性被正確添加
3. **結果**：服務器端和客戶端的 HTML 不一致，React 檢測到差異並發出警告

## 當前解決方案

### 方案 1：使用包裝組件（當前實現）

在 `MyButtonWrapper.tsx` 中使用 `span` 包裝並設置 `suppressHydrationWarning`：

```tsx
<span suppressHydrationWarning style={{ display: "inline-block" }}>
  <BaseMyButton {...rest}>{children}</BaseMyButton>
</span>
```

**限制**：`suppressHydrationWarning` 只能抑制該元素及其直接子元素的警告，但警告來自 `my-button` 元素本身，可能無法完全抑制。

### 方案 2：在容器上使用（已實現）

在 `main` 元素上使用 `suppressHydrationWarning`：

```tsx
<main suppressHydrationWarning>
  {/* 內容 */}
</main>
```

這會抑制整個容器內的 hydration 警告。

### 方案 3：接受警告（推薦）

**這個警告不影響功能**，只是開發時的提示。可以：
- 忽略這個警告（功能正常）
- 在生產環境中不會顯示
- 不影響 SEO 或性能

## 建議

**對於當前專案**：

1. **如果警告不影響開發體驗**：可以接受並忽略
2. **如果需要完全消除警告**：回到 `ssr: false` 方案
3. **如果需要 SSR 且無法接受警告**：考慮使用其他組件庫或實現自定義 SSR 邏輯

## 技術細節

### 為什麼會出現 `class` 屬性差異？

1. Stencil 使用 Scoped CSS，會在組件上添加 scoped 類名
2. SSR 時，組件可能還沒有完全初始化
3. 客戶端 hydration 時，組件完全初始化，類名被正確添加

### `suppressHydrationWarning` 的限制

- 只能抑制該元素及其**直接子元素**的警告
- 對於嵌套的 Web Component，警告可能來自更深層的元素
- 這是 React 的設計限制，不是 bug

## 總結

**當前實現已經盡可能處理了 hydration 警告**，但如果警告仍然出現：

✅ **可以安全忽略** - 不影響功能
✅ **SSR 正常工作** - 組件內容會出現在初始 HTML 中
✅ **功能正常** - 事件處理和交互都正常

如果警告影響開發體驗，可以考慮回到 `ssr: false` 方案。

