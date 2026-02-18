import { apiSlice } from "./apiSlice";

export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
}

export interface AddToCartRequest {
	productId: string;
	productName?: string;
	quantity?: number;
}

export interface UpdateQuantityRequest {
	itemId: string;
	quantity: number;
}

export interface RemoveFromCartRequest {
	itemId: string;
}

/** Path relative to baseUrl. Cart uses apiSlice's dynamic baseUrl (e.g. http://test.com/api). */
const CART_BASE = "cart";

export const cartApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCart: builder.query<CartItem[], void>({
			query: () => CART_BASE,
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({ type: "Cart" as const, id })),
							{ type: "Cart", id: "LIST" },
						]
					: [{ type: "Cart", id: "LIST" }],
		}),
		addToCart: builder.mutation<CartItem, AddToCartRequest>({
			query: (body) => ({
				url: `${CART_BASE}/add`,
				method: "POST",
				body,
			}),
			invalidatesTags: ["Cart"],
		}),
		updateQuantity: builder.mutation<CartItem, UpdateQuantityRequest>({
			query: (body) => ({
				url: `${CART_BASE}/updateQuantity`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Cart"],
		}),
		removeFromCart: builder.mutation<
			{ success: boolean },
			RemoveFromCartRequest
		>({
			query: (body) => ({
				url: `${CART_BASE}/remove`,
				method: "DELETE",
				body,
			}),
			invalidatesTags: ["Cart"],
		}),
	}),
});

export const {
	useGetCartQuery,
	useAddToCartMutation,
	useUpdateQuantityMutation,
	useRemoveFromCartMutation,
} = cartApi;
