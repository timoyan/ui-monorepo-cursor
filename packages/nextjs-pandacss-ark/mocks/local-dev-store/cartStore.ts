import type { CartItem } from "@/apis/cart";

/**
 * In-memory cart shared by all cart MSW handlers.
 * Simulates a single backend data source: add/update/remove operate on the same state.
 * Reset between tests via resetCartStore() so tests don't leak state.
 */
let cart: CartItem[] = [];

function nextId(): string {
	return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getCart(): CartItem[] {
	return [...cart];
}

export function addToCart(item: {
	productId: string;
	productName?: string;
	quantity?: number;
}): CartItem {
	const newItem: CartItem = {
		id: nextId(),
		productId: item.productId,
		productName: item.productName ?? "Sample Product",
		quantity: item.quantity ?? 1,
	};
	cart.push(newItem);
	return newItem;
}

export function updateQuantity(
	itemId: string,
	quantity: number,
): CartItem | null {
	const index = cart.findIndex((i) => i.id === itemId);
	if (index === -1) return null;
	cart[index] = { ...cart[index], quantity };
	return cart[index];
}

export function removeFromCart(itemId: string): boolean {
	const index = cart.findIndex((i) => i.id === itemId);
	if (index === -1) return false;
	cart.splice(index, 1);
	return true;
}

/** Reset cart to empty. Call in test beforeEach when tests depend on cart state. */
export function resetCartStore(): void {
	cart = [];
}
