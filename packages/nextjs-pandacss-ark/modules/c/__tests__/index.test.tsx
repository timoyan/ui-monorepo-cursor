import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import { apiSlice } from "@/apis/apiSlice";
import { store } from "@/core/store";
import { server } from "@/mocks/server";
import { ModuleC } from "@/modules/c";

function renderWithStore(ui: React.ReactElement) {
	return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
});

describe("ModuleC", () => {
	it("renders cart heading", () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
	});

	it("renders empty cart with Add item button when API returns empty", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		const emptyMessage = await screen.findByText(/cart is empty/i);
		expect(emptyMessage).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /add item/i }),
		).toBeInTheDocument();
	});
});
