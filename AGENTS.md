# Agent instructions (Cursor, Copilot, Claude Code, Windsurf, etc.)

This repo is a **monorepo**:

- **`hardhat-expo/`** — Mobile app (Expo Router, React Native, TypeScript, NativeWind). Use **Node/npm on the host** (`npm run typecheck`, `expo start`). Prefer **Tailwind via `className`** for UI; use `style` only when necessary (see **`CLAUDE.md`** and **`.cursor/rules/hardhat-project.mdc`**).
- **`hardhat-backend/`** — REST API (FastAPI, Python). **Every** API command (`pip`, `python`, `uvicorn`, etc.) must use **Docker Compose at the repo root** (`docker compose exec api …` or `run --rm api …`). Env: `hardhat-backend/.env`. Do **not** suggest host Python/uvicorn/pip unless the user explicitly opts out.
- **`hardhat-fullstack/`** — Rails. **Prefer Docker** for runtime tooling: `docker compose exec fullstack bundle install`, `bin/rails`, `bin/rspec`, `bin/rubocop`, etc. **Postgres schema:** `hardhat-fullstack/db/migrate/` (apply with `docker compose exec fullstack bin/rails db:migrate`). Do **not** default to host `bundle`/`rails`/`rspec` for the composed app unless the user opts out.

## Code clarity

- Prefer **clear variable names** (avoid abbreviations like `cat`/`st`; use `category`/`style`).
- In Rails views, prefer **helpers/partials** for derived UI logic instead of complex inline ERB.

**Rails tests:** RSpec only in `hardhat-fullstack/`; do not assert exact validation or flash **message** strings — use validity/errors structure and flash **presence**; see **`CLAUDE.md`** (Testing — hardhat-fullstack).

Shared editor settings: **`.vscode/`**. Cursor rules: **`.cursor/rules/`**. GitHub Copilot: **`.github/copilot-instructions.md`**. Canonical command table: **`CLAUDE.md`**.
