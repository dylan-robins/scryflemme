# Scryflemme

[![Tests](https://github.com/dylan-robins/scryflemme/actions/workflows/tests.yml/badge.svg)](https://github.com/dylan-robins/scryflemme/actions/workflows/tests.yml)
[![Docs](https://github.com/dylan-robins/scryflemme/actions/workflows/docs.yml/badge.svg)](https://github.com/dylan-robins/scryflemme/actions/workflows/docs.yml)

Monorepo for the Scryflemme card browser, with:

- `apps/backend`: Express API, Prisma, and backend-owned auth
- `apps/frontend`: Angular UI and Logto login flow
- `apps/types`: shared API contract types
- `docs`: Zensical-powered developer documentation

[Documentation](https://dylan-robins.github.io/scryflemme/)

## What This Is

The app currently serves three core purposes:

1. browse the card catalog
2. authenticate users through Logto
3. link each signed-in user to a local database record

The backend is the source of truth for user identity and application data.

## Quick Start

```bash
corepack enable
yarn install
yarn dev
```

That starts:

- backend on `http://localhost:3000`
- frontend on `http://localhost:4200`

The frontend proxies `/api/*` requests to the backend during local development.

## Documentation

The docs workspace lives in `docs/` and is built with `uv` plus Zensical.

```bash
cd docs
uv sync
uv run zensical build
```

## Repository Layout

- `apps/backend/src`: backend source
- `apps/backend/prisma`: schema, migrations, and seed data
- `apps/frontend/src`: frontend source
- `apps/types/src`: shared types
- `docs/content`: developer documentation source

## Common Commands

```bash
yarn build
yarn test
yarn typecheck
```

Workspace-specific commands:

```bash
yarn backend:dev
yarn backend:test
yarn frontend:dev
yarn frontend:test
```

## Shared Types

`@scryflemme/types` is the single source of truth for API contracts shared between the frontend and backend.

If you change a request or response shape, update the shared types first and then adjust both callers.
