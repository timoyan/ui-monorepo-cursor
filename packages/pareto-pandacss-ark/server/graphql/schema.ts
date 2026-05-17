import { GraphQLError } from "graphql";
import { createSchema } from "graphql-yoga";
import { createDemo, deleteDemo, getDemoById, listDemos } from "./data";

export const schema = createSchema({
	typeDefs: /* GraphQL */ `
		type Query {
			hello: String!
			health: Health!
			demos: [Demo!]!
			demo(id: ID!): Demo
		}

		type Mutation {
			createDemo(title: String!): Demo!
			deleteDemo(id: ID!): Boolean!
		}

		type Health {
			status: String!
			uptime: Float!
		}

		type Demo {
			id: ID!
			title: String!
			createdAt: String!
		}
	`,
	resolvers: {
		Query: {
			hello: () => "Hello from pareto-pandacss-ark GraphQL",
			health: () => ({
				status: "ok",
				uptime: process.uptime(),
			}),
			demos: () => listDemos(),
			demo: (_parent, args: { id: string }) => getDemoById(args.id) ?? null,
		},
		Mutation: {
			createDemo: (_parent, args: { title: string }) => {
				const title = args.title.trim();
				if (!title) {
					throw new GraphQLError("title must not be empty");
				}
				return createDemo(title);
			},
			deleteDemo: (_parent, args: { id: string }) => deleteDemo(args.id),
		},
	},
});
