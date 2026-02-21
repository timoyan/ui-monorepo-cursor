import { describe, expect, it } from "vitest";
import {
	CART_ENDPOINTS,
	getBaseUrlForEndpoint,
} from "@/apis/utils/getBaseUrlForEndpoint";

const CART_BASE_URL = "http://test.com/api";
const DEFAULT_BASE_URL = "/api";

describe("getBaseUrlForEndpoint", () => {
	it("returns CART_BASE_URL for getCart", () => {
		expect(getBaseUrlForEndpoint("getCart")).toBe(CART_BASE_URL);
	});

	it("returns CART_BASE_URL for all cart endpoints", () => {
		for (const endpoint of CART_ENDPOINTS) {
			expect(getBaseUrlForEndpoint(endpoint)).toBe(CART_BASE_URL);
		}
	});

	it("returns DEFAULT_BASE_URL for unknown endpoint", () => {
		expect(getBaseUrlForEndpoint("unknown")).toBe(DEFAULT_BASE_URL);
		expect(getBaseUrlForEndpoint("getUser")).toBe(DEFAULT_BASE_URL);
	});

	it("returns DEFAULT_BASE_URL when endpoint is undefined", () => {
		expect(getBaseUrlForEndpoint(undefined)).toBe(DEFAULT_BASE_URL);
	});

	it("returns DEFAULT_BASE_URL when endpoint is empty string", () => {
		expect(getBaseUrlForEndpoint("")).toBe(DEFAULT_BASE_URL);
	});
});
