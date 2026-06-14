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
- Use the shared port from `process.env.PORT`, defaulting to `3000`.
- Keep `/health` available for service checks.
- Keep API routes under `/api/*`.

## Change Guidance

- Prefer edits that stay local to the backend package.
- Update shared monorepo files only if the backend change requires it.
- Add or update tests when behavior changes.
