# GraphQL practice server

In-memory GraphQL API at **`/graphql`** via Pareto resource route [`app/graphql/route.ts`](../../app/graphql/route.ts) (works in `pnpm dev` and production).

- **GraphiQL**: enabled when `NODE_ENV !== "production"` (e.g. `pnpm dev`). Open `/graphql` in the browser.
- **Production**: GraphiQL is off; send `POST /graphql` with a JSON body (`query`, optional `variables`).
- **Depth limit**: queries deeper than 10 levels are rejected.

REST health check: **`GET /api/health`** ([`app/api/health/route.ts`](../../app/api/health/route.ts)).

## Local setup

```bash
cd packages/pareto-pandacss-ark
pnpm install
pnpm dev
```

Use the dev server URL printed by Pareto (port may vary). Then visit:

- GraphiQL: `http://localhost:<port>/graphql`
- REST: `http://localhost:<port>/api/health`

## Example operations

### Hello + health (compare with REST `/api/health`)

```graphql
query {
  hello
  health {
    status
    uptime
  }
}
```

REST returns `{ "status": "ok", "uptime": <number> }`. GraphQL `health` exposes the same fields under a nested type.

### List demos

```graphql
query {
  demos {
    id
    title
    createdAt
  }
}
```

### Get one demo (`null` if missing)

```graphql
query {
  demo(id: "1") {
    id
    title
  }
}
```

Missing ids return **`null`** for `demo`, not a GraphQL error.

### Create demo

```graphql
mutation {
  createDemo(title: "My practice item") {
    id
    title
    createdAt
  }
}
```

Empty or whitespace-only titles return an error: `title must not be empty`.

### Delete demo

```graphql
mutation {
  deleteDemo(id: "1")
}
```

Returns `true` if a row was removed, `false` if the id did not exist.

## REST vs GraphQL (this package)

| Concern | REST | GraphQL |
|--------|------|---------|
| Health | `GET /api/health` | `query { health { status uptime } }` |
| Demos | not exposed | `demos`, `demo`, `createDemo`, `deleteDemo` |

Data is in-memory only; restarting the server resets demos to the seed entry.
