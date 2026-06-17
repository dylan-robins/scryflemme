# API

This page documents the current backend endpoints that the frontend depends on.

## Public Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Runtime health check |
| `GET` | `/api/hello` | Minimal example endpoint |
| `GET` | `/api/cards` | Paginated card catalog |

## Authenticated Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/me` | Resolves the current Logto user into the local `User` row |

## `/api/cards`

Query parameters:

- `page`: 1-based page index
- `pageSize`: bounded page size
- `setCode`: optional set filter

The response includes:

- the current page and page size
- the total count and total page count
- the active set code
- catalog metadata and sets
- the current page of cards

## `/api/me`

The frontend calls this endpoint after login.

The backend expects:

- `Authorization: Bearer <access token>`
- `X-Logto-Id-Token: <id token>` when available

The response includes the local user row:

- `userID`
- `logtoSubject`
- `email`
- `name`

## API Shape Rule

Anything that is user-specific should be resolved by the backend from the authenticated token, not from browser state.
