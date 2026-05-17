import { beforeEach, describe, expect, it } from "vitest";
import { resetDemos } from "../data";
import { createGraphQLHandler } from "../index";

const yoga = createGraphQLHandler();

async function runGraphQL<T = Record<string, unknown>>(
	query: string,
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
	const response = await yoga.fetch("http://test/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	});
	return response.json() as Promise<{
		data?: T;
		errors?: Array<{ message: string }>;
	}>;
}

describe("graphql schema", () => {
	beforeEach(() => {
		resetDemos();
	});

	it("returns hello", async () => {
		const result = await runGraphQL<{ hello: string }>(/* GraphQL */ `
			query {
				hello
			}
		`);

		expect(result.errors).toBeUndefined();
		expect(result.data?.hello).toBe("Hello from pareto-pandacss-ark GraphQL");
	});

	it("returns health with ok status", async () => {
		const result = await runGraphQL<{
			health: { status: string; uptime: number };
		}>(
			/* GraphQL */ `
				query {
					health {
						status
						uptime
					}
				}
			`,
		);

		expect(result.errors).toBeUndefined();
		expect(result.data?.health.status).toBe("ok");
		expect(typeof result.data?.health.uptime).toBe("number");
	});

	it("lists seed demos", async () => {
		const result = await runGraphQL<{
			demos: Array<{ id: string; title: string }>;
		}>(/* GraphQL */ `
			query {
				demos {
					id
					title
				}
			}
		`);

		expect(result.errors).toBeUndefined();
		expect(result.data?.demos).toEqual([{ id: "1", title: "Welcome demo" }]);
	});

	it("creates a demo via mutation", async () => {
		const result = await runGraphQL<{
			createDemo: { id: string; title: string; createdAt: string };
		}>(/* GraphQL */ `
			mutation {
				createDemo(title: "Practice item") {
					id
					title
					createdAt
				}
			}
		`);

		expect(result.errors).toBeUndefined();
		expect(result.data?.createDemo.title).toBe("Practice item");
		expect(result.data?.createDemo.id).toBe("2");
		expect(result.data?.createDemo.createdAt).toBeTruthy();

		const listResult = await runGraphQL<{ demos: Array<{ id: string }> }>(
			/* GraphQL */ `
				query {
					demos {
						id
					}
				}
			`,
		);
		expect(listResult.data?.demos).toHaveLength(2);
	});

	it("returns null when demo id is not found", async () => {
		const result = await runGraphQL<{ demo: { id: string } | null }>(
			/* GraphQL */ `
				query {
					demo(id: "missing") {
						id
					}
				}
			`,
		);

		expect(result.errors).toBeUndefined();
		expect(result.data?.demo).toBeNull();
	});

	it("rejects empty title on createDemo", async () => {
		const result = await runGraphQL(/* GraphQL */ `
			mutation {
				createDemo(title: "   ") {
					id
				}
			}
		`);

		expect(result.errors?.[0]?.message).toBe("title must not be empty");
	});

	it("deletes a demo via mutation", async () => {
		const result = await runGraphQL<{ deleteDemo: boolean }>(/* GraphQL */ `
			mutation {
				deleteDemo(id: "1")
			}
		`);

		expect(result.errors).toBeUndefined();
		expect(result.data?.deleteDemo).toBe(true);

		const listResult = await runGraphQL<{ demos: Array<{ id: string }> }>(
			/* GraphQL */ `
				query {
					demos {
						id
					}
				}
			`,
		);
		expect(listResult.data?.demos).toEqual([]);
	});
});
