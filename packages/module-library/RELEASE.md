# Module Library 版本發佈指南

## 概述

本文檔說明如何使用 pnpm 進行 `module-library` 的版本管理和發佈。

## 版本號管理

### 語義化版本（Semantic Versioning）

遵循 [SemVer](https://semver.org/) 規範：

- **MAJOR** (主版本號): 不兼容的 API 變更
- **MINOR** (次版本號): 向後兼容的功能新增
- **PATCH** (修補版本號): 向後兼容的問題修復

範例：`1.2.3` → `1.2.4` (patch), `1.3.0` (minor), `2.0.0` (major)

## 發佈流程

### 方法 1: 手動版本管理（簡單專案）

#### 1. 更新版本號

```bash
# 在專案根目錄
cd packages/module-library

# 使用 pnpm version 命令更新版本
pnpm version patch   # 0.1.0 → 0.1.1 (修補版本)
pnpm version minor   # 0.1.0 → 0.2.0 (次版本)
pnpm version major   # 0.1.0 → 1.0.0 (主版本)

# 或直接指定版本號
pnpm version 1.0.0

# 預發布版本
pnpm version 1.0.0-beta.1
pnpm version prerelease  # 1.0.0-beta.1 → 1.0.0-beta.2
```

#### 2. 構建專案

```bash
# 確保構建成功
pnpm build

# 或從根目錄
pnpm -F module-library build
```

#### 3. 發佈到 npm（如果不再設為 private）

```bash
# 移除 private 標記（如果需要發佈到 npm）
# 編輯 package.json，將 "private": true 改為 false 或移除

# 發佈
pnpm publish --access public

# 發佈預發布版本
pnpm publish --tag beta
```

### 方法 2: 使用 Changesets（推薦用於團隊協作）

Changesets 提供更好的版本管理和變更日誌生成。

#### 安裝 Changesets

```bash
# 在 monorepo 根目錄
pnpm add -D -w @changesets/cli
```

#### 初始化 Changesets

```bash
pnpm changeset init
```

這會創建 `.changeset` 目錄和配置文件。

#### 使用流程

**1. 創建變更集（Changeset）**

```bash
# 在專案根目錄
pnpm changeset

# 或針對特定包
pnpm changeset --filter module-library
```

這會引導你：
- 選擇受影響的包（`module-library`）
- 選擇版本類型（patch/minor/major）
- 編寫變更說明

**2. 版本升級**

```bash
# 根據 changesets 自動升級版本
pnpm changeset version
```

這會：
- 讀取所有 changesets
- 自動升級版本號
- 生成 CHANGELOG.md
- 刪除已處理的 changesets

**3. 發佈**

```bash
# 構建所有包
pnpm -r build

# 發佈
pnpm changeset publish
```

### 方法 3: 使用 pnpm 的版本管理腳本

創建自動化發佈腳本。

#### 創建發佈腳本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "version:patch": "pnpm version patch && pnpm build",
    "version:minor": "pnpm version minor && pnpm build",
    "version:major": "pnpm version major && pnpm build",
    "prepublishOnly": "pnpm build",
    "release": "pnpm build && pnpm publish --access public"
  }
}
```

#### 使用方式

```bash
# 升級版本並構建
pnpm version:patch

# 發佈
pnpm release
```

## 完整發佈流程範例

### 場景：發佈新功能（Minor 版本）

```bash
# 1. 確保代碼已提交
git status

# 2. 更新版本號
cd packages/module-library
pnpm version minor  # 0.1.0 → 0.2.0

# 3. 構建
pnpm build

# 4. 提交版本變更
git add package.json dist/
git commit -m "chore: bump version to 0.2.0"
git tag v0.2.0

# 5. 發佈（如果不再設為 private）
# 先移除 package.json 中的 "private": true
pnpm publish --access public

# 6. 推送代碼和標籤
git push
git push --tags
```

### 場景：修復 Bug（Patch 版本）

```bash
# 1. 修復 bug 並提交
git commit -m "fix: button click event not firing"

# 2. 升級版本
cd packages/module-library
pnpm version patch  # 0.1.0 → 0.1.1

# 3. 構建
pnpm build

# 4. 提交並發佈
git add package.json dist/
git commit -m "chore: bump version to 0.1.1"
git tag v0.1.1
git push && git push --tags

# 5. 發佈
pnpm publish --access public
```

## 發佈前檢查清單

- [ ] 所有測試通過：`pnpm test`
- [ ] 構建成功：`pnpm build`
- [ ] 代碼已格式化：`pnpm format`
- [ ] Lint 通過：`pnpm lint`
- [ ] 更新 CHANGELOG.md（如果有的話）
- [ ] 更新 README.md（如有必要）
- [ ] 版本號已正確更新
- [ ] `dist/` 目錄包含最新構建
- [ ] `package.json` 的 `files` 欄位包含所有需要發佈的文件

## 發佈配置

### package.json 配置

確保 `package.json` 包含正確的發佈配置：

```json
{
  "name": "module-library",
  "version": "0.1.0",
  "private": false,  // 設為 false 才能發佈到 npm
  "files": [
    "dist/",
    "react/",
    "loader/",
    "README.md"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### .npmignore（可選）

如果需要排除某些文件：

```
# .npmignore
src/
test/
*.spec.ts
*.test.ts
.storybook/
node_modules/
.git/
```

## 發佈到私有 Registry

### 使用私有 npm Registry

```bash
# 設置 registry
pnpm config set registry https://your-private-registry.com

# 發佈
pnpm publish
```

### 使用 Scope

```json
{
  "name": "@your-org/module-library",
  "publishConfig": {
    "access": "restricted"  // 或 "public"
  }
}
```

## 版本標籤管理

### 發佈不同標籤的版本

```bash
# 發佈穩定版（默認 latest）
pnpm publish

# 發佈 beta 版本
pnpm publish --tag beta

# 發佈 alpha 版本
pnpm publish --tag alpha

# 安裝特定標籤
pnpm add module-library@beta
```

### 升級標籤

```bash
# 將 beta 版本升級為 latest
pnpm dist-tag add module-library@1.0.0-beta.1 latest
```

## 回滾發佈

### 撤銷發佈（24 小時內）

```bash
# 撤銷特定版本
pnpm unpublish module-library@1.0.0

# 撤銷整個包（不推薦，僅在緊急情況下使用）
pnpm unpublish module-library --force
```

⚠️ **注意**：npm 不鼓勵使用 `unpublish`，建議發佈修復版本。

## 自動化發佈（CI/CD）

### GitHub Actions 範例

創建 `.github/workflows/publish.yml`：

```yaml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Build
        working-directory: packages/module-library
        run: pnpm build
      
      - name: Publish
        working-directory: packages/module-library
        run: pnpm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 常見問題

### Q: 如何發佈預發布版本？

```bash
pnpm version 1.0.0-beta.1
pnpm publish --tag beta
```

### Q: 如何更新已發佈的版本？

發佈新版本，不要修改已發佈的版本。

### Q: 如何發佈到多個 registry？

使用不同的 `publishConfig` 或手動指定：

```bash
pnpm publish --registry https://registry.npmjs.org
```

### Q: 如何查看當前版本？

```bash
pnpm list module-library
# 或
cat packages/module-library/package.json | grep version
```

## 參考資料

- [pnpm 版本管理文檔](https://pnpm.io/cli/version)
- [pnpm 發佈文檔](https://pnpm.io/cli/publish)
- [Semantic Versioning](https://semver.org/)
- [Changesets 文檔](https://github.com/changesets/changesets)

