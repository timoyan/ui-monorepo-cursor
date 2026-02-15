import { http, HttpResponse } from "msw";

export const handlers = [
	http.get("/api/hello", () => {
		return HttpResponse.json({ message: "Hello from MSW!" });
	}),
	http.get("/api/users", () => {
		return HttpResponse.json([
			{ id: "1", name: "Alice" },
			{ id: "2", name: "Bob" },
		]);
	}),
];
