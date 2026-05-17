import type { LoaderContext } from "@paretojs/core";
import { createGraphQLHandler } from "@/server/graphql/index";

const yoga = createGraphQLHandler();

function forwardToGraphQL(ctx: LoaderContext): Promise<void> {
	return new Promise((resolve, reject) => {
		yoga(ctx.req, ctx.res, (err?: unknown) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

/** GET (GraphiQL) and POST (queries/mutations) for /graphql */
export async function loader(ctx: LoaderContext) {
	await forwardToGraphQL(ctx);
}

export async function action(ctx: LoaderContext) {
	await forwardToGraphQL(ctx);
}
