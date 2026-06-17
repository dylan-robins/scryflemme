# scryflemme

Monorepo starter with:

- `apps/backend`: Express API
- `apps/frontend`: Angular app
- `apps/types`: Shared API contract types for both apps
- `docs`: `uv`-managed documentation workspace

## Development

```bash
corepack enable
yarn install
yarn dev
```

The backend listens on `http://localhost:3000`.
The frontend listens on `http://localhost:4200`.

The frontend proxies `/api/*` requests to the backend in local development.

## Documentation

The docs workspace lives in `docs/` and is intended to be built with `uv` plus Zensical.

```bash
cd docs
uv sync
uv run zensical --help
```

## Shared Types

The `@scryflemme/types` workspace package is the single source of truth for API contracts shared
between the backend and frontend.

Useful scripts:

```bash
yarn types:typecheck
yarn typecheck
```
