/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
// Use relative paths instead of @/* alias: Vitest loads setup outside the Next.js context,
// so tsconfig path mappings may not resolve when this file is imported by the test runner.
import { server } from "../mocks/server";
import { testOptions } from "../mocks/config";

beforeAll(() => server.listen(testOptions));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
