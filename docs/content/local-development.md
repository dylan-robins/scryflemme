# Local Development

## Prerequisites

- Node.js for the app workspaces
- Yarn 4
- Python with `uv` for the docs workspace

## Bootstrap

Do this first:

```bash
yarn install
```

That installs the frontend, backend, and shared types workspaces.

Then authenticate Prisma for the backend workspace:

```bash
yarn workspace @scryflemme/backend exec prisma login
```

## Run The App

```bash
yarn dev
```

This starts:

- the backend on `http://localhost:3000`
- the frontend on `http://localhost:4200`

The frontend proxies `/api/*` to the backend in development.

If Prisma has not been authenticated for this workspace yet, the backend will fail to start cleanly against the private database.

## Database Workflow

If you modify the database schema, update the database using the prisma cli:

```bash
yarn workspace @scryflemme/backend exec prisma migrate deploy
```

If you need a full reset and re-seed of the database:

```bash
yarn workspace @scryflemme/backend exec prisma migrate reset
yarn workspace @scryflemme/backend exec prisma db seed
```

## Docs Workflow

```bash
cd docs
uv sync
uv run zensical --help
```

If you want to rebuild the docs site locally, use the CLI provided by Zensical in that environment.

## Environment Variables

### Backend

- `DATABASE_URL`: required for Prisma
- `PORT`: optional, defaults to `3000`
- `LOGTO_ISSUER`: optional override for the Logto tenant issuer
- `LOGTO_AUDIENCE`: optional override for the API resource identifier
- `LOGTO_CLIENT_ID`: optional override for ID token verification

### Frontend

The current frontend config uses the local development URLs directly.

If you change ports or environments, update:

- the backend proxy config
- the OIDC redirect URIs
- the backend audience value

## Common Pitfalls

- If Prisma says it cannot connect or authenticate, rerun `prisma login` in the backend workspace.
- If `/api/me` 401s, check the browser request headers first.
- If Logto rejects the auth redirect, make sure the resource identifier matches the configured API resource.
- If the backend can’t verify tokens, check `LOGTO_ISSUER` and JWKS discovery.
- If backend startup fails, rerun prisma login
