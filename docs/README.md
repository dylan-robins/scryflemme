# Scryflemme Docs

This workspace is for the architecture and operational docs for the monorepo.

Intended workflow:

```bash
cd docs
uv sync
uv run zensical --help
```

Starter topics live under `content/`:

- `index.md`: docs landing page and reading order
- `architecture.md`: system layout and request flow
- `authentication.md`: Logto and backend auth behavior
- `api.md`: backend endpoint map
- `data-model.md`: Prisma models and ownership
- `roadmap.md`: next planned areas of work
- `local-development.md`: how to run the repo locally
- `decisions/`: lightweight architecture decision records
