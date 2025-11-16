## UI Monorepo

This repository is a small UI monorepo that contains:

- **`packages/ui`** – React component library (`Button`, `Card`) built with webpack 5, wyw‑in‑js, and extracted CSS.
- **`packages/nextjs-14-app`** – Next.js 14 app using the shared UI package (React 18).
- **`packages/nextjs-15-app`** – Next.js 15 app (App Router + React Compiler, React 19) using the shared UI package.
- **`packages/vite-react-18`** – Vite + React 18 example using the UI package.
- **`packages/vite-react-19`** – Vite + React 19 example using the UI package.

The UI package is shipped as ES modules, with React treated as an external dependency and styles emitted as real `.css` files.

## Tech stack

- **React 18 / 19**
- **Next.js 14 / 15**
- **Vite 5**
- **`packages/ui`**
  - wyw‑in‑js (`@wyw-in-js/webpack-loader`) + `@linaria/core` for static, zero‑runtime CSS
  - webpack 5 ES module output
  - `MiniCssExtractPlugin` + custom `AggregateCssPlugin` that emits `main/main.css`
  - Storybook 7 (`@storybook/react-webpack5`)
- **Tooling**
  - pnpm workspaces
  - Biome (`@biomejs/biome`) for linting and formatting

## Getting started

### Install

From the repo root:

pnpm install### Build all packages

pnpm -r buildThis builds:

- `packages/ui` (library bundle + CSS)
- `packages/nextjs-14-app`
- `packages/nextjs-15-app`
- `packages/vite-react-18`
- `packages/vite-react-19`

## Running the example apps

All commands are run from the repo root.

- **Next.js 14 (React 18)**

 
  pnpm --filter nextjs-14-app dev
  - **Next.js 15 (React 19 + React Compiler)**

 
  pnpm --filter nextjs-15-app dev
  - **Vite + React 18**

 
  pnpm --filter vite-react-18 dev
  - **Vite + React 19**

 
  pnpm --filter vite-react-19 dev
  ## UI package (`packages/ui`)

### Structure (simplified)

packages/ui/
  src/ui/
    Button/
      Button.tsx
      index.ts
    Card/
      Card.tsx
      index.ts
    index.ts
  build/
    Button/
      index.js
      index.css
    Card/
      index.js
      index.css
    main/
      main.js
      main.css      # aggregated CSS for all components### Exports

The `ui` package exposes ESM entry points via `package.json`:

- `ui` – main barrel (`build/main/main.js`)
- `ui/Button` – `Button` component JS + types
- `ui/Button/style.css` – per‑component CSS
- `ui/Card` – `Card` component JS + types
- `ui/Card/style.css` – per‑component CSS
- `ui/main` – main entry JS
- `ui/main/style.css` – aggregated stylesheet (used by the Next.js 15 app)

### Using the UI package

In a consumer app:

import { Button, Card } from "ui";
import "ui/main/style.css";Or per component:

import { Button } from "ui/Button";
import "ui/Button/style.css";React and `react-dom` are externals; the host app must provide them.

## Storybook (UI package)

From the repo root:

pnpm --filter ui storybookThis runs Storybook for the shared UI components on port `6006`.

## Linting & formatting (Biome)

Biome is configured at the repo root in `biome.json`.

- **Lint all**

 
  pnpm lint
  - **Format (check only)**

 
  pnpm format
  - **Format and write changes**

 
  pnpm format -- --write
  In Cursor / VS Code, Biome is configured as the default formatter for JS/TS/TSX with format‑on‑save enabled via `.vscode/settings.json`.

## Notes

- Use `pnpm -r build` to build everything instead of running each package individually.
- The `ui` library is designed to be tree‑shakeable and to ship only static CSS, with no runtime styling cost.