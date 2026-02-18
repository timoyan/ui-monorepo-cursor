# UI Monorepo

This repository is a small UI monorepo that contains:

- **`packages/ui-react18`** – React 18 component library (`Button`, `Card`) built with webpack 5, wyw‑in‑js, and extracted CSS.
- **`packages/ui-react19`** – React 19 component library (`Button`, `Card`) built with webpack 5, wyw‑in‑js, and extracted CSS.
- **`packages/nextjs14`** – Next.js 14 app using the shared UI package (React 18).
- **`packages/nextjs15`** – Next.js 15 app (App Router + React Compiler, React 19) using the shared UI package.
- **`packages/nextjs-pandacss-ark`** – Next.js 15 app (Pages Router) with PandaCSS and Ark UI (`Button`, `Accordion`).
- **`packages/vite-react18`** – Vite + React 18 example using the UI package.
- **`packages/vite-react19`** – Vite + React 19 example using the UI package.

The UI package is shipped as ES modules, with React treated as an external dependency and styles emitted as real `.css` files.

## Tech Stack

- **React 18 / 19**
- **Next.js 14 / 15**
- **Vite 5**
- **PandaCSS** – Build-time CSS-in-JS (used in `nextjs-pandacss-ark`)
- **Ark UI** – Headless, accessible components (used in `nextjs-pandacss-ark`)
- **`packages/ui-react18`**
  - wyw‑in‑js (`@wyw-in-js/webpack-loader`) + `@linaria/core` for static, zero‑runtime CSS
  - webpack 5 ES module output
  - `MiniCssExtractPlugin` + custom `AggregateCssPlugin` that emits `main/main.css`
  - Storybook 7 (`@storybook/react-webpack5`)
- **Tooling**
  - pnpm workspaces
  - Biome (`@biomejs/biome`) for linting and formatting
  - Husky + lint-staged for pre-commit checks

## Getting Started

### Installation

From the repo root:

```bash
pnpm install
```

### Build All Packages

```bash
pnpm -r build
```

This builds:

- `packages/ui-react18` (library bundle + CSS)
- `packages/ui-react19` (library bundle + CSS)
- `packages/nextjs14`
- `packages/nextjs15`
- `packages/nextjs-pandacss-ark`
- `packages/vite-react18`
- `packages/vite-react19`

## Running the Example Apps

All commands are run from the repo root.

### Next.js 14 (React 18)

```bash
pnpm --filter nextjs14 dev
```

### Next.js 15 (React 19 + React Compiler)

```bash
pnpm --filter nextjs15 dev
```

### Next.js + PandaCSS + Ark UI

```bash
pnpm --filter nextjs-pandacss-ark dev
```

### Vite + React 18

```bash
pnpm --filter vite-react18 dev
```

### Vite + React 19

```bash
pnpm --filter vite-react19 dev
```

## UI Package (`packages/ui-react18`)

### Structure (Simplified)

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
- `ui-react18/main/style.css` – aggregated stylesheet (used by the nextjs15 app)

### Using the UI Package

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

## Storybook (UI Packages)

From the repo root:

```bash
# For React 18 components
pnpm --filter ui-react18 storybook

# For React 19 components
pnpm --filter ui-react19 storybook
```

This runs Storybook for the shared UI components on port `6006`.

## Linting & Formatting (Biome)

Biome is configured at the repo root in `biome.json`.

### Lint All

```bash
pnpm lint
```

### Format (Check Only)

```bash
pnpm format
```

### Format and Write Changes

```bash
pnpm format -- --write
```

In Cursor / VS Code, Biome is configured as the default formatter for JS/TS/TSX with format‑on‑save enabled via `.vscode/settings.json`.

## Git Hooks (Husky + lint-staged)

- Husky is configured at the root and installs via the `prepare` script.
- A `pre-commit` hook runs `pnpm lint-staged`, which:
  - formats **staged files** with `biome format --write`
  - lints **staged files** with `biome lint --write --unsafe`
- If Biome finds unfixable issues, the commit is blocked until they are resolved.

## GitHub Actions

This repository includes GitHub Actions workflows for continuous integration:

### Build Verification (`build.yml`)

- **Triggers**: Pull requests and pushes to `main`/`master` branches
- **Purpose**: Builds and verifies all packages in the monorepo
- **Packages built**:
  - `nextjs14`
  - `nextjs15`
  - `nextjs-pandacss-ark`
  - `ui-react18`
  - `ui-react19`
  - `vite-react18`
  - `vite-react19`

### Playwright Tests (`playwright.yml`)

- **Triggers**: Pull requests and pushes to `main`/`master` branches
- **Purpose**: Runs end-to-end tests using Playwright

### Setting Up Branch Protection

To require these checks to pass before merging pull requests:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Under **Branch protection rules**, add or edit the rule for `main`
4. Enable **Require status checks to pass before merging**
5. Select the following required status checks:
   - `Build Verification / Build All Packages`
   - `Playwright Tests / test` (if you want to require tests)
6. Optionally enable **Require branches to be up to date before merging**

This ensures that all builds must pass successfully before any pull request can be merged into `main`.

## Version Requirements

### React Version Compatibility

This monorepo maintains separate packages for different React versions to ensure compatibility and optimal performance.

| Package | React Version | React DOM Version | Notes |
|---------|--------------|-------------------|-------|
| `ui-react18` | `>=18.0.0` | `>=18.0.0` | Compatible with React 18.x |
| `ui-react19` | `>=19.0.0` | `>=19.0.0` | Requires React 19.x (uses React 19 features) |

### Choosing the Right Package

**Use `ui-react18` if:**
- Your project uses React 18.x
- You're using Next.js 14 or earlier
- You need maximum compatibility

**Use `ui-react19` if:**
- Your project uses React 19.x
- You're using Next.js 15 or later
- You want to use React 19 features (e.g., `useActionState`, `useOptimistic`, React Compiler)

### Package Installation

```bash
# For React 18 projects
pnpm add ui-react18

# For React 19 projects
pnpm add ui-react19
```

### Peer Dependencies

Both packages declare React as a peer dependency. Make sure your project has the correct React version installed:

```json
{
  "dependencies": {
    "react": "^18.2.0",  // For ui-react18
    "react-dom": "^18.2.0"
  }
}
```

```json
{
  "dependencies": {
    "react": "^19.0.0",  // For ui-react19
    "react-dom": "^19.0.0"
  }
}
```

### Hooks and React Version Features

If you create hooks that use React 19-specific features:

1. **Place them in `ui-react19` only** - Don't add React 19 hooks to `ui-react18`
2. **Document version requirements** - Use JSDoc comments to indicate React version requirements
3. **Use peer dependencies** - Package.json will enforce version requirements
4. **Provide fallbacks** - If needed, create React 18-compatible alternatives

Example hook documentation:

```typescript
/**
 * Uses React 19's useActionState hook.
 * 
 * @requires React 19.0.0 or higher
 * @package ui-react19
 * 
 * @example
 * ```tsx
 * import { useMyActionState } from 'ui-react19/hooks';
 * 
 * function MyComponent() {
 *   const [state, action, isPending] = useMyActionState(...);
 *   // ...
 * }
 * ```
 */
export function useMyActionState() {
  // React 19 only
}
```

## Notes

- Use `pnpm -r build` to build everything instead of running each package individually.
- The `ui-react18` and `ui-react19` libraries are designed to be tree‑shakeable and to ship only static CSS, with no runtime styling cost.
- **Never mix packages** - Don't import from both `ui-react18` and `ui-react19` in the same project.
- **Version enforcement** - Peer dependencies will warn if incorrect React version is installed.
