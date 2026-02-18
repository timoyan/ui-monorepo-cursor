# nextjs-pandacss-ark

Next.js app with PandaCSS and Ark UI.

## Tech stack

- **Next.js** – React framework (Pages Router)
- **PandaCSS** – Build-time CSS-in-JS with zero runtime
- **Ark UI** – Headless, accessible UI components
- **Redux Toolkit (RTK Query)** – State management and data fetching

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- **`core/`** – App-level concerns (store, router, error handling)
- **`pages/`** – Next.js pages (combine modules/features/components)
- **`modules/`** – Business domain modules (combine multi features)
- **`features/`** – Independent features (cart, payment, etc.)
- **`components/`** – Reusable UI components (Button, Accordion)
- **`apis/`** – RTK Query API slices and endpoints
- **`hooks/`** – Shared hooks
- **`mocks/`** – MSW handlers, fixtures, browser/server setup

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Scripts

- `pnpm dev` – Start development server (do not use `--turbo`/`--turbopack`; PandaCSS works with the default Webpack dev server.)
- `pnpm build` – Run `panda codegen` then build for production
- `pnpm start` – Start production server
- `pnpm test` – Run tests in watch mode
- `pnpm test:run` – Run tests once (CI)
- `pnpm test:report` – Run tests and write HTML report to `test-result/`
- `pnpm test:report:view` – Serve `test-result/` on http://localhost:3131 and open in browser (use after `test:report`; required because the report cannot be opened via `file://` due to CORS)
- `pnpm test:coverage` – Run tests with coverage and write **lcov** report to `test-result/coverage/lcov.info` (and HTML to `test-result/coverage/lcov-report/`)

## Mock API (MSW)

MSW is enabled in development to mock API requests.

- **Handlers**: `mocks/handlers.ts` – Exports `devHandlers` (cart API) for **local dev only** and empty `handlers` for the test server. Add or edit endpoints in `devHandlers` to mock more APIs in dev.
- **Stores**: `mocks/local-dev-store/` – In-memory state used by `devHandlers` in local dev (e.g. `cartStore.ts` for cart add/update/remove). Not used by unit tests.
- **Fixtures**: `mocks/fixtures/` – Shared mock data (e.g. `defaultCartItem`, `createMockCartItem`) for dev handlers and tests
- **Config**: `mocks/config.ts` – `devOptions` (bypass) vs `testOptions` (error)
- **Browser**: `mocks/browser.ts` – Uses `devHandlers`; started in dev via `useMSWReady` in `_app`
- **Node**: `mocks/server.ts` – Uses empty `handlers`; for unit tests (Vitest). Each test mocks endpoints via `server.use()`.

**Behavior**:

- **Local dev**: The browser worker uses `devHandlers`. All other APIs bypass (hit real network). Only APIs in `devHandlers` are mocked.
- **Unit tests**: The test server starts with no handlers. Every test that hits an API must call `server.use()` in that test to mock the endpoints it needs. Unhandled requests fail the test.

**Test setup**: Import `test/setup.ts` in your test config (e.g. `setupFiles`) so the MSW server runs before tests. In tests that use RTK Query, call `store.dispatch(apiSlice.util.resetApiState())` in `beforeEach` to clear cache between tests. Mock cart (and other) endpoints in each test with `server.use(http.get(...), http.post(...), ...)`.

**Regenerate service worker**: Run `pnpm msw:init` after upgrading MSW if the worker needs updating. The worker lives in `msw/` and is committed; `msw init` is not run during `pnpm install` to avoid install hangs.
