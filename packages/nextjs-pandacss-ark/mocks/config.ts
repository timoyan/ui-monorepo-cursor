/**
 * MSW configuration per environment:
 *
 * - **Dev (browser)**: onUnhandledRequest: "bypass"
 *   All APIs bypass (hit real network) by default.
 *   Only APIs with explicit handlers in handlers.ts are mocked.
 *
 * - **CI / Unit test (Node)**: onUnhandledRequest: "error"
 *   All API requests must be handled by MSW.
 *   Unhandled requests fail the test (forces adding handlers).
 */
export const devOptions = {
	onUnhandledRequest: "bypass" as const,
};

export const testOptions = {
	onUnhandledRequest: "error" as const,
};
