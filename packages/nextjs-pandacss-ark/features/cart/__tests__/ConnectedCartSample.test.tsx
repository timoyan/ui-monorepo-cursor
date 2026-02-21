import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { act } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import { apiSlice } from "@/apis/apiSlice";
import type { CartItem } from "@/apis/cart";
import { store } from "@/core/store";
import { createMockCartItem } from "@/mocks/fixtures";
import { server } from "@/mocks/server";
import { ConnectedCartSample } from "../ConnectedCartSample";

function renderWithStore(ui: React.ReactElement) {
	return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
});

describe("ConnectedCartSample", () => {
	// 僅用於驗證 lint:test 會擋 snapshot，驗證完請刪除此 test
	it("snapshot placeholder (remove after verifying lint:test)", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		const { container } = renderWithStore(<ConnectedCartSample />);
		await screen.findByText(/Cart is empty/i);
		expect(container.firstChild).toMatchSnapshot();
	});

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

	it("handleBlur calls updateQuantity when input value differs from item quantity", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product E",
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
					return HttpResponse.json({ ...item, quantity: body.quantity });
				},
			),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product E");
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product e/i,
		});
		await act(async () => {
			fireEvent.change(qtyInput, { target: { value: "5" } });
		});
		await act(async () => {
			fireEvent.blur(qtyInput);
		});
		await screen.findByDisplayValue("5");
		expect(qtyInput).toHaveValue(5);
	});

	it("handleBlur syncs input to item quantity when value unchanged on blur", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product F",
			quantity: 2,
		});
		let patchCalls = 0;
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
			http.patch("http://test.com/api/cart/updateQuantity", () => {
				patchCalls += 1;
				return HttpResponse.json({ ...item, quantity: 2 });
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product F");
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product f/i,
		});
		expect(qtyInput).toHaveValue(2);
		await act(async () => {
			fireEvent.change(qtyInput, { target: { value: "3" } });
		});
		await act(async () => {
			fireEvent.change(qtyInput, { target: { value: "2" } });
			fireEvent.blur(qtyInput);
		});
		expect(patchCalls).toBe(0);
		expect(qtyInput).toHaveValue(2);
	});

	it("pressing Enter on quantity input triggers blur and handleBlur", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product G",
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
					return HttpResponse.json({ ...item, quantity: body.quantity });
				},
			),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product G");
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product g/i,
		});
		await act(async () => {
			fireEvent.change(qtyInput, { target: { value: "4" } });
		});
		await act(async () => {
			fireEvent.keyDown(qtyInput, { key: "Enter" });
		});
		await screen.findByDisplayValue("4");
		expect(qtyInput).toHaveValue(4);
	});

	it("disables quantity controls while update is in progress", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product H",
			quantity: 2,
		});
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
			http.patch("http://test.com/api/cart/updateQuantity", async () => {
				await new Promise((resolve) => setTimeout(resolve, 300));
				return HttpResponse.json({ ...item, quantity: 3 });
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product H");
		const increaseBtn = screen.getByRole("button", {
			name: /increase quantity/i,
		});
		await act(async () => {
			await userEvent.click(increaseBtn);
		});
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product h/i,
		});
		expect(increaseBtn).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /decrease quantity/i }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /remove product h from cart/i }),
		).toBeDisabled();
		expect(qtyInput).toBeDisabled();
		await screen.findByDisplayValue("3");
	});

	it("disables quantity controls while remove is in progress", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product I",
			quantity: 1,
		});
		let cartList: CartItem[] = [item];
		server.use(
			http.get("http://test.com/api/cart", () =>
				HttpResponse.json([...cartList]),
			),
			http.delete("http://test.com/api/cart/remove", async () => {
				await new Promise((resolve) => setTimeout(resolve, 300));
				cartList = [];
				return HttpResponse.json({ success: true });
			}),
		);
		renderWithStore(<ConnectedCartSample />);
		await screen.findByText("Product I");
		const removeBtn = screen.getByRole("button", {
			name: /remove product i from cart/i,
		});
		await act(async () => {
			await userEvent.click(removeBtn);
		});
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product i/i,
		});
		expect(removeBtn).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /increase quantity/i }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /decrease quantity/i }),
		).toBeDisabled();
		expect(qtyInput).toBeDisabled();
		await screen.findByText(/cart is empty/i);
	});
});
