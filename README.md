# React UI Library Project

这是一个使用 React、Linaria 和 Storybook 构建的 UI 组件库项目。

## 项目结构

```
ui/
├── src/
│   ├── ui/              # UI 组件库
│   │   ├── Button/      # Button 组件
│   │   ├── Card/        # Card 组件
│   │   └── index.js     # 组件库入口
│   ├── App.jsx          # React 应用主组件
│   └── index.js         # 应用入口
├── .storybook/          # Storybook 配置
└── public/              # 静态文件
```

## 技术栈

- **React** - UI 框架
- **Linaria** - CSS-in-JS，零运行时开销
- **Storybook** - 组件开发和文档工具
- **CRACO** - Create React App 配置覆盖工具，用于支持 Linaria

## 安装依赖

```bash
npm install
```

## 运行应用

```bash
npm start
```

应用将在 http://localhost:3000 启动

## 运行 Storybook

```bash
npm run storybook
```

Storybook 将在 http://localhost:6006 启动

## 构建 Storybook

```bash
npm run build-storybook
```

## UI 组件库

所有 UI 组件位于 `src/ui/` 目录下，每个组件都包含：
- 组件文件（.jsx）
- Storybook stories（.stories.jsx）
- 导出文件（index.js）

### 当前可用组件

- **Button** - 按钮组件，支持多种变体（primary, secondary, success, danger）
- **Card** - 卡片组件，支持标题、内容和页脚

## Linaria 使用

所有组件的样式都使用 Linaria 的 `styled` API 编写，样式在构建时提取为 CSS，实现零运行时开销。

```jsx
import { styled } from '@linaria/react';

const StyledButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
`;
```

Linaria 配置通过以下方式实现：
- **React 应用**: 使用 CRACO (`craco.config.js`) 覆盖 Create React App 配置，添加 Linaria Babel preset
- **Storybook**: 在 `.storybook/main.js` 中配置 webpack 支持 Linaria

由于 UI 组件库现在位于 `src/ui/` 目录下，react-scripts 会自动处理这些文件，无需额外的 webpack 配置。

## 开发指南

### 添加新组件

1. 在 `src/ui/` 下创建新组件目录
2. 创建组件文件（例如 `MyComponent.jsx`）
3. 使用 Linaria 的 `styled` API 编写样式
4. 创建 Storybook stories 文件（`MyComponent.stories.jsx`）
5. 创建导出文件（`index.js`）
6. 在 `src/ui/index.js` 中导出新组件

### 组件示例

查看 `src/ui/Button/` 和 `src/ui/Card/` 目录获取完整的组件实现示例。

