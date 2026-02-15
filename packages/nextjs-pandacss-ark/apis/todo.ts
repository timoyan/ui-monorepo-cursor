import { apiSlice } from "./apiSlice";

export interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

const JSONPLACEHOLDER_BASE = "https://jsonplaceholder.typicode.com";

export const todoApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTodo: builder.query<Todo, string>({
			query: (id) => `${JSONPLACEHOLDER_BASE}/todos/${id}`,
		}),
	}),
});

export const { useGetTodoQuery, useLazyGetTodoQuery } = todoApi;
