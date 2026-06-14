# Backend Guidance

You are working in `apps/backend`, the Express API for this monorepo.

## Stack

- Node.js
- Express
- TypeScript in ESM mode

## Code Style

- Keep code strict and typed.
- Prefer small modules with a single responsibility.
- Avoid `any`; use `unknown` when needed.
- Use `async`/`await` for asynchronous code.

## Backend Conventions

- Keep source files in `src/`.
- Preserve the existing ESM setup.
- Use `process.env.PORT`, defaulting to `3000`.
- Keep `/health` available for service checks.
- Keep API routes under `/api/*`.

## Change Guidance

- Keep edits local to the backend package unless a shared change is required.
- Update monorepo root files only when they are affected directly.
- Add or update tests when behavior changes.
