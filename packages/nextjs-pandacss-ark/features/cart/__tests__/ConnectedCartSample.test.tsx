import { describe, it, expect, beforeEach } from "vitest";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { apiSlice } from "@/apis/apiSlice";
import { ConnectedCartSample } from "../ConnectedCartSample";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import type { CartItem } from "@/apis/cart";
import { createMockCartItem } from "@/mocks/fixtures";

function renderWithStore(ui: React.ReactElement) {
	return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
});

describe("ConnectedCartSample", () => {
	it("renders loading state while fetching cart", async () => {
		server.use(
			http.get("http://test.com/api/cart", async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return HttpResponse.json([]);
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		expect(screen.getByText("Cart")).toBeInTheDocument();
		expect(screen.getByText(/loading cart…/i)).toBeInTheDocument();
		await screen.findByText(/cart is empty/i);
	});

	it("renders empty cart with Add item button", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ConnectedCartSample />);
		const emptyMessage = await screen.findByText(/Cart is empty/i);

		expect(emptyMessage).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /add item/i }),
		).toBeInTheDocument();
	});

	it("renders error state when fetch fails", async () => {
		server.use(
			http.get("http://test.com/api/cart", () =>
				HttpResponse.json({ error: "Server error" }, { status: 500 }),
			),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText(/failed to load cart/i);
		expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
	});

	it("adds item when Add item is clicked", async () => {
		const cartItems: CartItem[] = [];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(cartItems)),
			http.post("http://test.com/api/cart/add", async ({ request }) => {
				const body = (await request.json()) as {
					productId?: string;
					productName?: string;
					quantity?: number;
				};
				const item = createMockCartItem({
					id: `item-${Date.now()}`,
					productId: body.productId ?? "prod-1",
					productName: body.productName,
					quantity: body.quantity ?? 1,
				});
				cartItems.push(item);
				return HttpResponse.json(item);
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText(/cart is empty/i);
		const addButton = screen.getByRole("button", { name: /add item/i });
		await act(async () => {
			await userEvent.click(addButton);
		});
		await screen.findByText("Sample Product");
		expect(screen.getByText(/id: prod-sample/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /decrease quantity/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /increase quantity/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /remove sample product from cart/i }),
		).toBeInTheDocument();
	});

	it("disables Add item button and shows Adding… while add is in progress", async () => {
		const cartItems: CartItem[] = [];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(cartItems)),
			http.post("http://test.com/api/cart/add", async ({ request }) => {
				await new Promise((resolve) => setTimeout(resolve, 300));
				const body = (await request.json()) as {
					productId?: string;
					productName?: string;
					quantity?: number;
				};
				const item = createMockCartItem({
					id: `item-${Date.now()}`,
					productId: body.productId ?? "prod-1",
					productName: body.productName,
					quantity: body.quantity ?? 1,
				});
				cartItems.push(item);
				return HttpResponse.json(item);
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByRole("button", { name: /add item/i });
		const addButton = screen.getByRole("button", { name: /add item/i });
		await act(async () => {
			await userEvent.click(addButton);
		});
		expect(screen.getByRole("button", { name: /adding…/i })).toBeDisabled();
		await screen.findByText("Sample Product");
	});

	it("displays cart items from API", async () => {
		const items = [
			createMockCartItem({
				id: "item-1",
				productName: "Product A",
				productId: "prod-a",
				quantity: 2,
			}),
		];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(items)),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product A");
		expect(screen.getByText(/id: prod-a/i)).toBeInTheDocument();
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product a/i,
		});
		expect(qtyInput).toHaveValue(2);
	});

	it("increases quantity when + is clicked", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product A",
			quantity: 1,
		});
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
			http.patch(
				"http://test.com/api/cart/updateQuantity",
				async ({ request }) => {
					const body = (await request.json()) as {
						itemId: string;
						quantity: number;
					};
					return HttpResponse.json({
						...item,
						quantity: body.quantity,
					});
				},
			),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product A");
		const increaseBtn = screen.getByRole("button", {
			name: /increase quantity/i,
		});
		await act(async () => {
			await userEvent.click(increaseBtn);
		});
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product a/i,
		});
		await screen.findByDisplayValue("2");
		expect(qtyInput).toHaveValue(2);
	});

	it("decreases quantity when − is clicked", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product B",
			quantity: 2,
		});
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
			http.patch(
				"http://test.com/api/cart/updateQuantity",
				async ({ request }) => {
					const body = (await request.json()) as {
						itemId: string;
						quantity: number;
					};
					return HttpResponse.json({
						...item,
						quantity: body.quantity,
					});
				},
			),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product B");
		const decreaseBtn = screen.getByRole("button", {
			name: /decrease quantity/i,
		});
		await act(async () => {
			await userEvent.click(decreaseBtn);
		});
		await screen.findByDisplayValue("1");
		expect(
			screen.getByRole("spinbutton", { name: /quantity for product b/i }),
		).toHaveValue(1);
	});

	it("disables decrease when quantity is 1", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product C",
			quantity: 1,
		});
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product C");
		expect(
			screen.getByRole("button", { name: /decrease quantity/i }),
		).toBeDisabled();
	});

	it("removes item when Remove is clicked", async () => {
		const productD = createMockCartItem({
			id: "item-d",
			productId: "prod-d",
			productName: "Product D",
			quantity: 1,
		});
		let cartItems: (typeof productD)[] = [productD];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(cartItems)),
			http.delete("http://test.com/api/cart/remove", () => {
				cartItems = [];
				return HttpResponse.json({ success: true });
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product D");
		const removeBtn = screen.getByRole("button", {
			name: /remove product d from cart/i,
		});
		await act(async () => {
			await userEvent.click(removeBtn);
		});
		await screen.findByText(/cart is empty/i);
		expect(
			screen.getByRole("button", { name: /add item/i }),
		).toBeInTheDocument();
		expect(screen.queryByText("Product D")).not.toBeInTheDocument();
	});
});
