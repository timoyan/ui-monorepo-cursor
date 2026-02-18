import type { CartItem } from "@/apis/cart";

/** Default mock cart item used by MSW handlers and tests. */
export const defaultCartItem: CartItem = {
	id: "cart-1",
	productId: "prod-1",
	productName: "Sample Product",
	quantity: 1,
};

/**
 * Creates a mock cart item with optional overrides.
 */
export function createMockCartItem(overrides?: Partial<CartItem>): CartItem {
	return { ...defaultCartItem, ...overrides };
}
