# 組件測試說明

## 測試方式

### 1. 使用本地服務器（推薦）

由於瀏覽器的 CORS 限制，需要使用本地服務器來測試：

```bash
# 在專案根目錄執行
cd packages/module-library/test

# 使用 Python 3
python3 -m http.server 8000

# 或使用 Node.js
npx serve .

# 或使用 PHP
php -S localhost:8000
```

然後在瀏覽器中打開：`http://localhost:8000/index.html`

### 2. 使用 VS Code Live Server

1. 安裝 VS Code 的 "Live Server" 擴展
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

## 測試內容

測試頁面包含以下測試場景：

1. **基本按鈕** - 測試所有 variant（primary、secondary、success、danger）
2. **不同尺寸** - 測試 size（sm、md、lg）
3. **禁用狀態** - 測試 disabled 屬性
4. **事件處理** - 測試 buttonClick 事件
5. **主題定制** - 測試 CSS 變數覆蓋

## 預期結果

- 所有按鈕應該正確顯示
- 不同 variant 應該有不同的顏色
- 不同 size 應該有不同的尺寸
- 禁用按鈕應該呈現灰色且不可點擊
- 點擊按鈕應該觸發事件並在控制台和頁面上顯示日誌
- 自定義主題按鈕應該使用紫色

## 調試

如果組件無法載入，請檢查：

1. 瀏覽器控制台是否有錯誤
2. 文件路徑是否正確
3. 是否使用了本地服務器（不能直接打開 HTML 文件）

