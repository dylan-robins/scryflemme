# Repository Guidance

This repository is a monorepo with:

- `apps/backend`: Express API
- `apps/frontend`: Angular app

## Working Rules

- Prefer changes that stay within the relevant app folder.
- Treat root config files as shared workspace settings.
- Do not move app-local files into the root unless there is a clear monorepo-wide reason.
- Preserve user changes outside the requested scope.
- When generating commit messages, follow the Conventional Commits specification.

## Monorepo Conventions

- Keep backend code under `apps/backend/src`.
- Keep frontend code under `apps/frontend/src`.
- Use workspace package names when running scripts from the root.
- Update shared config files only when a change affects both apps.

## Quality Bar

- Keep changes small and well-scoped.
- Add or update tests when behavior changes.
- Prefer readable code over clever code.
