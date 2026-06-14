# Repository Guidance

This repository is a monorepo with:

- `apps/backend`: Express API
- `apps/frontend`: Angular app

## Working Rules

- Keep app-specific changes inside the app that owns them.
- Treat root config as shared workspace configuration.
- Do not relocate generated app files without a concrete reason.
- Preserve unrelated user changes.
- When generating commit messages, follow the Conventional Commits specification.

## Monorepo Conventions

- Put backend source in `apps/backend/src`.
- Put frontend source in `apps/frontend/src`.
- Run workspace scripts by package name from the monorepo root.
- Change shared configs only when the change applies to both apps.

## Quality Bar

- Keep edits focused and easy to review.
- Add tests for behavior changes where practical.
- Prefer clarity over cleverness.
