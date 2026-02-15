import { http, HttpResponse } from "msw";
import { createMockTodo } from "./fixtures/todo";

/**
 * MSW handlers for local dev and unit tests.
 * Add or uncomment handlers below as needed to mock API endpoints.
 * - Local dev (browser): only handlers listed here are mocked; unhandled requests hit the real network.
 * - Unit tests (Node): all API requests must be handled; unhandled requests fail the test.
 */
export const handlers = [
	http.get("https://jsonplaceholder.typicode.com/todos/:id", ({ params }) => {
		return HttpResponse.json(createMockTodo({ id: Number(params.id) }));
	}),
];
