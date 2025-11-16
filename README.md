# React UI Library (ES Modules, zero‑runtime CSS)

This repository contains a small React UI library built with:
- wyw‑in‑js (Linaria toolchain) using the `css` API for fully static, zero‑runtime CSS
- Webpack 5 with pure ES modules output
- Storybook for local component development

React is treated as an external dependency and is not bundled.

## Project structure

```
ui/
├── src/
│   └── ui/
│       ├── Button/
│       │   ├── Button.jsx
│       │   └── index.js
│       ├── Card/
│       │   ├── Card.jsx
│       │   └── index.js
│       └── index.js               # (optional) library barrel
├── .storybook/                    # Storybook config
├── webpack.config.js              # Custom Webpack build (no CRA)
└── build/                         # Build artifacts (ESM JS + extracted CSS)
    ├── Button/
    │   ├── index.js
    │   └── index.css
    └── Card/
        ├── index.js
        └── index.css
```

## Tech stack

- **React** (external, not bundled)
- **wyw‑in‑js** (`@wyw-in-js/webpack-loader`) with Linaria preset (`evaluate: false`) for static CSS extraction
- **Webpack 5** (ES modules output, tree‑shakeable)
- **MiniCssExtractPlugin** for emitting `.css` files per component
- **Storybook** for component development

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

Outputs ESM JS and static CSS per component under `build/<Component>/`.

## Storybook

```bash
npm run storybook
```

Runs Storybook at http://localhost:6006.

## Usage in external projects

Import only what you need (tree‑shakeable) and include the generated CSS:

```js
// JS (ESM)
import { Button } from 'your-lib/build/Button/index.js';
// CSS
import 'your-lib/build/Button/index.css';
```

React (and `react/jsx-runtime`) are externals, so your host app must already depend on React.

## Tree‑shaking

- ESM output (`import`/`export`)
- `package.json` has `"sideEffects": false`
- Webpack `optimization.usedExports: true`
- No common vendor chunks; each component is an independent entry

## Notes

- This project does not include a CRA app or HTML page. It builds a consumable UI library only.
- CSS is fully static (no runtime style injection). We use Linaria’s `css` API via wyw‑in‑js.

## Add a new component

1. Create a folder under `src/ui/<NewComponent>/`
2. Add `<NewComponent>.jsx` and `index.js` (re‑export)
3. Use `@linaria/core` `css` API for styles
4. Optionally add a Storybook story under the same folder
5. Rebuild with `npm run build`

