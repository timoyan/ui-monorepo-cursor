"use client";

import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT =
	typeof window === "undefined"
		? "http://localhost/graphql"
		: new URL("/graphql", window.location.origin).toString();

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	credentials: "same-origin",
});
