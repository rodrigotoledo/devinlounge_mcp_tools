# Agent instructions (Cursor, Copilot, Claude Code, Codex, Antigravity, Windsurf, etc.)

This repo is a **monorepo**:

`hardhat-*` names below are stack profile aliases used in these instructions (they are not limited to Expo-only projects).

General runtime rule: **Expo runs on the host; every other stack runs through Docker Compose**. Compose services should use bind mounts so local file edits are reflected inside containers during development.

Inter-service networking rule (all agents): inside Docker, services must call each other by **Compose service name** (`http://api:8000`, `http://nestjs:3001`, `http://fullstack:3000`) and never `localhost`. `localhost` is only for host/browser access to published ports.

- **`hardhat-expo/`** — Mobile app (Expo Router, React Native, TypeScript, NativeWind). Use **Node/npm on the host** (`npm run typecheck`, `expo start`). Prefer **Tailwind via `className`** for UI; use `style` only when necessary (see **`CLAUDE.md`** and **`.cursor/rules/hardhat-project.mdc`**).
- **`hardhat-backend/`** — REST API (FastAPI, Python). **Every** API command (`pip`, `python`, `uvicorn`, etc.) must use **Docker Compose at the repo root** (`docker compose exec api …` or `run --rm api …`). Env: `hardhat-backend/.env`. Do **not** suggest host Python/uvicorn/pip unless the user explicitly opts out.
- **`hardhat-fullstack/`** — Rails. **Prefer Docker** for runtime tooling: `docker compose exec fullstack bundle install`, `bin/rails`, `bin/rspec`, `bin/rubocop`, etc. When creating new Rails apps, use `bin/rails new ... --skip-test`, then install and configure `rspec-rails`, `shoulda-matchers`, `simplecov`, and `guard-rspec` (includes `guard` dependency), and run `bundle exec guard init rspec` to generate `Guardfile`. Before scaffolding, ask the Rails gem decisions first: authentication (`bcrypt`, `devise` only if explicit, or OAuth), authorization (`cancancan`, `pundit`, or none), styling (`tailwindcss-rails` or `simplecss`), background jobs (`solid_queue` or `sidekiq`), pagination (`pagy` or `kaminari`), and whether the app is HTML-first or API-heavy (`jbuilder`/`blueprinter` only when needed). Ask follow-up gem questions when relevant: search (`ransack`/`pg_search`), uploads (Active Storage / `image_processing` / `shrine`), admin (`activeadmin`/`avo`), auditing (`paper_trail`/`audited`), and multi-tenancy (`acts_as_tenant`). Do **not** assume `devise` by default, and do **not** keep Minitest as the primary test workflow. **Postgres schema:** `hardhat-fullstack/db/migrate/` (apply with `docker compose exec fullstack bin/rails db:migrate`). Do **not** default to host `bundle`/`rails`/`rspec` for the composed app unless the user opts out.

If your project is only React Native/Expo, apply only the `hardhat-expo` profile and ignore backend/fullstack entries.

## Code clarity

- Prefer **clear variable names** (avoid abbreviations like `cat`/`st`; use `category`/`style`).
- In Rails views, prefer **helpers/partials** for derived UI logic instead of complex inline ERB.

## Service defaults (MVP)

- **Default starter output for every new project:** always scaffold at least one working endpoint/screen immediately after creation (HTML home or JSON health) so the app has a predictable first response.

- **FastAPI:** prefer Pydantic v2 schemas at boundaries, SQLAlchemy 2.0 async patterns, and pytest request/integration tests for critical endpoints.
- **Next.js:** prefer App Router + TypeScript strict, TanStack Query for client-side server-state, and Zod + React Hook Form for forms.
- **React SPA:** prefer Vite + TypeScript strict, TanStack Query for server-state, and Zod + React Hook Form for forms.
- **NestJS:** prefer modular architecture, DTO validation with class-validator, OpenAPI/Swagger enabled, and Jest unit + e2e tests for critical endpoints.
- **Expo (React Native):** prefer Expo Router + TypeScript strict, TanStack Query for server-state, NativeWind via `className`, and secure token storage with `expo-secure-store`.

For React/Expo projects, default to TanStack Query and do not introduce Redux unless explicitly requested.

**Rails tests:** RSpec only in `hardhat-fullstack/`, with `simplecov`, `shoulda-matchers`, and `guard-rspec` configured by default. Prefer **request specs** over controller specs. In specs, use Rails route helpers (`root_path`, `user_path(user)`) instead of hardcoded URL strings; do not assert exact validation or flash **message** strings — use validity/errors structure and flash **presence**; see **`CLAUDE.md`** (Testing — hardhat-fullstack).

Shared editor settings: **`.vscode/`**. Cursor rules: **`.cursor/rules/`**. GitHub Copilot: **`.github/copilot-instructions.md`**. Canonical command table: **`CLAUDE.md`**.
