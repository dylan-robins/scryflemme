# scryflemme

Monorepo starter with:

- `apps/backend`: Express API
- `apps/frontend`: Angular app

## Development

```bash
corepack enable
yarn install
yarn dev
```

The backend listens on `http://localhost:3000`.
The frontend listens on `http://localhost:4200`.

The frontend proxies `/api/*` requests to the backend in local development.
