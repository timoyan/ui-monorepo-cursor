import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "@/store";
import { apiSlice } from "@/apis/apiSlice";
import { TodoSample } from "../TodoSample";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { defaultTodo, createMockTodo } from "@/mocks/fixtures";

function renderWithStore(ui: React.ReactElement) {
	return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
});

describe("TodoSample", () => {
	it("renders initial state with Fetch button and placeholder text", () => {
		renderWithStore(<TodoSample />);
		expect(
			screen.getByRole("heading", { name: /todo api/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /fetch/i })).toBeInTheDocument();
		expect(screen.getByText(/click fetch to load todo/i)).toBeInTheDocument();
	});

	it("calls trigger and displays todo data from MSW handler on Fetch click", async () => {
		renderWithStore(<TodoSample />);
		const fetchButton = screen.getByRole("button", { name: /fetch/i });
		await userEvent.click(fetchButton);
		await screen.findByText(defaultTodo.title);
		expect(screen.getByText(defaultTodo.title)).toBeInTheDocument();
		expect(screen.getByText(/id: 1 · user: 1/i)).toBeInTheDocument();
		expect(screen.getByText(/not completed/i)).toBeInTheDocument();
	});

	it("shows loading state when Fetch is clicked", async () => {
		server.use(
			http.get("https://jsonplaceholder.typicode.com/todos/:id", async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return HttpResponse.json(defaultTodo);
			}),
		);
		renderWithStore(<TodoSample />);
		const fetchButton = screen.getByRole("button", { name: /fetch/i });
		await userEvent.click(fetchButton);
		expect(
			screen.getByRole("button", { name: /loading…/i }),
		).toBeInTheDocument();
		await screen.findByText(defaultTodo.title);
	});

	it("disables Fetch button while loading", async () => {
		const mockTodo = createMockTodo({ title: "Mock todo" });
		server.use(
			http.get("https://jsonplaceholder.typicode.com/todos/:id", async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return HttpResponse.json(mockTodo);
			}),
		);
		renderWithStore(<TodoSample />);
		const fetchButton = screen.getByRole("button", { name: /fetch/i });
		await userEvent.click(fetchButton);
		expect(screen.getByRole("button", { name: /loading…/i })).toBeDisabled();
		await screen.findByText(mockTodo.title);
	});

	it("shows error message when fetch fails", async () => {
		server.use(
			http.get("https://jsonplaceholder.typicode.com/todos/:id", () => {
				return HttpResponse.json({ error: "Not found" }, { status: 404 });
			}),
		);
		renderWithStore(<TodoSample />);
		const fetchButton = screen.getByRole("button", { name: /fetch/i });
		await userEvent.click(fetchButton);
		await screen.findByText(/failed to load todo/i);
		expect(screen.getByText(/failed to load todo/i)).toBeInTheDocument();
	});

	it("displays completed status when handler returns completed todo", async () => {
		const completedTodo = createMockTodo({
			userId: 2,
			id: 2,
			title: "Done task",
			completed: true,
		});
		server.use(
			http.get("https://jsonplaceholder.typicode.com/todos/:id", () => {
				return HttpResponse.json(completedTodo);
			}),
		);
		renderWithStore(<TodoSample />);
		const fetchButton = screen.getByRole("button", { name: /fetch/i });
		await userEvent.click(fetchButton);
		await screen.findByText(completedTodo.title);
		expect(screen.getByText(/completed/i)).toBeInTheDocument();
	});
});
