import { createYoga } from "graphql-yoga";
import { depthLimitPlugin } from "./depthLimitPlugin";
import { schema } from "./schema";

export function createGraphQLHandler() {
	return createYoga({
		schema,
		graphqlEndpoint: "/graphql",
		graphiql: process.env.NODE_ENV !== "production",
		// Practice server: surface resolver errors in GraphiQL and tests.
		maskedErrors: false,
		plugins: [depthLimitPlugin()],
	});
}
