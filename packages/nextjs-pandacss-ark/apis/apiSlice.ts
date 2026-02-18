import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_BASE_URL = "/api";
const CART_BASE_URL = "http://test.com/api";

const cartEndpoints = [
	"getCart",
	"addToCart",
	"updateQuantity",
	"removeFromCart",
] as const;

function getBaseUrlForEndpoint(endpoint?: string): string {
	if (
		endpoint &&
		cartEndpoints.includes(endpoint as (typeof cartEndpoints)[number])
	) {
		return CART_BASE_URL;
	}
	return DEFAULT_BASE_URL;
}

const dynamicBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
	const baseUrl = getBaseUrlForEndpoint(api.endpoint);
	return fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			headers.set("Content-Type", "application/json");
			return headers;
		},
	})(args, api, extraOptions);
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: dynamicBaseQuery,
	endpoints: () => ({}),
	tagTypes: ["Cart"],
});
