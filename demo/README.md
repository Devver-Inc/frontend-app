# Demo

Runs the real app with sample data: no backend, no Logto, no `.env`.

```bash
pnpm install
pnpm demo
```

Then open http://localhost:5173. You are signed in as a sample user of the
Northwind organization. Open the Storefront project to see the deployment map.

- `start.mjs` starts the mock API on port 3100 and the Vite dev server on 5173
- `mock-api.mjs` holds the sample data, in the shape of the backend DTOs
- `auth-client.mjs` replaces the Logto client in the browser

Changes made in the demo only live in memory, and most of them do not change
the sample data. This folder and the `demo` script only exist on this branch.
