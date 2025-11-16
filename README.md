## UI Monorepo

This repository is a small UI monorepo that contains:

- **`packages/ui-react18`** – React component library (`Button`, `Card`) built with webpack 5, wyw‑in‑js, and extracted CSS.
- **`packages/nextjs-14-app`** – Next.js 14 app using the shared UI package (React 18).
- **`packages/nextjs-15-app`** – Next.js 15 app (App Router + React Compiler, React 19) using the shared UI package.
- **`packages/vite-react-18`** – Vite + React 18 example using the UI package.
- **`packages/vite-react-19`** – Vite + React 19 example using the UI package.

The UI package is shipped as ES modules, with React treated as an external dependency and styles emitted as real `.css` files.

## Tech stack

- **React 18 / 19**
- **Next.js 14 / 15**
- **Vite 5**
- **`packages/ui-react18`**
  - wyw‑in‑js (`@wyw-in-js/webpack-loader`) + `@linaria/core` for static, zero‑runtime CSS
  - webpack 5 ES module output
  - `MiniCssExtractPlugin` + custom `AggregateCssPlugin` that emits `main/main.css`
  - Storybook 7 (`@storybook/react-webpack5`)
- **Tooling**
  - pnpm workspaces
  - Biome (`@biomejs/biome`) for linting and formatting
  - Husky + lint-staged for pre-commit checks

## Getting started

### Install

From the repo root:

```bash
pnpm install
```

### Build all packages

```bash
pnpm -r build
```

This builds:

- `packages/ui-react18` (library bundle + CSS)
- `packages/nextjs-14-app`
- `packages/nextjs-15-app`
- `packages/vite-react-18`
- `packages/vite-react-19`

## Running the example apps

All commands are run from the repo root.

- **Next.js 14 (React 18)**:

  ```bash
  pnpm --filter nextjs-14-app dev
  ```

- **Next.js 15 (React 19 + React Compiler)**:

  ```bash
  pnpm --filter nextjs-15-app dev
  ```

- **Vite + React 18**:

  ```bash
  pnpm --filter vite-react-18 dev
  ```

- **Vite + React 19**:

  ```bash
  pnpm --filter vite-react-19 dev
  ```

## UI package (`packages/ui-react18`)

### Structure (simplified)

```text
packages/ui-react18/
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
      main.css      # aggregated CSS for all components
```

### Exports

The `ui-react18` package exposes ESM entry points via `package.json`:

- `ui-react18` – main barrel (`build/main/main.js`)
- `ui-react18/Button` – `Button` component JS + types
- `ui-react18/Button/style.css` – per‑component CSS
- `ui-react18/Card` – `Card` component JS + types
- `ui-react18/Card/style.css` – per‑component CSS
- `ui-react18/main` – main entry JS
- `ui-react18/main/style.css` – aggregated stylesheet (used by the Next.js 15 app)

### Using the UI package

In a consumer app:

```ts
import { Button, Card } from "ui-react18";
import "ui-react18/main/style.css";
```

Or per component:

```ts
import { Button } from "ui-react18/Button";
import "ui-react18/Button/style.css";
```

React and `react-dom` are externals; the host app must provide them.

## Storybook (UI package)

From the repo root:

```bash
pnpm --filter ui-react18 storybook
```

This runs Storybook for the shared UI components on port `6006`.

## Linting & formatting (Biome)

Biome is configured at the repo root in `biome.json`.

- **Lint all**:

  ```bash
  pnpm lint
  ```

- **Format (check only)**:

  ```bash
  pnpm format
  ```

- **Format and write changes**:

  ```bash
  pnpm format -- --write
  ```

In Cursor / VS Code, Biome is configured as the default formatter for JS/TS/TSX with format‑on‑save enabled via `.vscode/settings.json`.

## Git hooks (Husky + lint-staged)

- Husky is configured at the root and installs via the `prepare` script.
- A `pre-commit` hook runs `pnpm lint-staged`, which:
  - formats **staged files** with `biome format --write`
  - lints **staged files** with `biome lint --write --unsafe`
- If Biome finds unfixable issues, the commit is blocked until they are resolved.

## Notes

- Use `pnpm -r build` to build everything instead of running each package individually.
- The `ui-react18` library is designed to be tree‑shakeable and to ship only static CSS, with no runtime styling cost.