import type { Todo } from "@/apis/todo";

/** Default mock todo used by MSW handlers and tests. */
export const defaultTodo: Todo = {
	userId: 1,
	id: 1,
	title: "delectus aut autem1",
	completed: false,
};

/**
 * Creates a mock todo with optional overrides.
 * Use for tests that need specific data (e.g. completed: true).
 */
export function createMockTodo(overrides?: Partial<Todo>): Todo {
	return { ...defaultTodo, ...overrides };
}
