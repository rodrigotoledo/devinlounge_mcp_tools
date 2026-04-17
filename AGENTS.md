# Agent instructions (Cursor, Copilot, Claude Code, Codex, Antigravity, Windsurf, etc.)

This repo is a **monorepo**:



General runtime rule: **Expo runs on the host; every other stack runs through Docker Compose**. Compose services should use bind mounts so local file edits are reflected inside containers during development.

Inter-service networking rule (all agents): inside Docker, services must call each other by **Compose service name** (`http://api:8000`, `http://nestjs:3001`, `http://fullstack:3000`) and never `localhost`. `localhost` is only for host/browser access to published ports.


- **`expo/`** — Mobile app (Expo Router, React Native, TypeScript, NativeWind). Use **Node/npm on the host** (`npm run typecheck`, `expo start`). Prefer **Tailwind via `className`** for UI; use `style` only when necessary (see **`CLAUDE.md`** and **`.cursor/rules/expo-nativewind-tailwind.mdc`**).
- **`api/`** — REST API (FastAPI, Python). **Every** API command (`pip`, `python`, `uvicorn`, etc.) must use **Docker Compose at the repo root** (`docker compose exec api …` or `run --rm api …`). Env: `api/.env`. Do **not** suggest host Python/uvicorn/pip unless the user explicitly opts out.
- **`fullstack-rails/`** — Rails. **Always use Docker Compose** for runtime tooling: `docker compose exec fullstack bundle install`, `bin/rails`, `bin/rspec`, `bin/rubocop`, etc. Every Rails project should include a `docker-compose.yml` with at least app + database services. When creating new Rails apps, use `bin/rails new ... --skip-test`, depois instale e configure `rspec-rails`, `shoulda-matchers`, `simplecov`, e `guard-rspec` (inclui `guard` como dependência), e rode `bundle exec guard init rspec` para gerar o `Guardfile`. Antes de gerar recursos, defina as gems principais: autenticação (`bcrypt` ou OAuth), autorização (`cancancan`, `pundit` ou nenhuma), CSS (`tailwindcss-rails` ou `simplecss`), background jobs (`solid_queue` ou `sidekiq`), paginação (`pagy` ou `kaminari`), e se o app é HTML-first ou API-heavy (`jbuilder`/`blueprinter` só quando necessário). Pergunte sobre gems extras quando relevante: busca (`ransack`/`pg_search`), uploads (Active Storage / `image_processing` / `shrine`), admin (`activeadmin`/`avo`), auditoria (`paper_trail`/`audited`), multi-tenancy (`acts_as_tenant`). Não use `devise` por padrão, nem mantenha Minitest como workflow principal. **Postgres schema:** `fullstack-rails/db/migrate/` (aplique com `docker compose exec fullstack bin/rails db:migrate`).

Se seu projeto for só React Native/Expo, use apenas o perfil `expo` e ignore entradas de backend/fullstack.

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

**Rails tests:** RSpec only in `fullstack-rails/`, with `simplecov`, `shoulda-matchers`, and `guard-rspec` configured by default. Prefer **request specs** over controller specs. In specs, use Rails route helpers (`root_path`, `user_path(user)`) instead of hardcoded URL strings; do not assert exact validation or flash **message** strings — use validity/errors structure and flash **presence**; see **`CLAUDE.md`** (Testing — fullstack-rails).

Shared editor settings: **`.vscode/`**. Cursor rules: **`.cursor/rules/`**. GitHub Copilot: **`.github/copilot-instructions.md`**. Canonical command table: **`CLAUDE.md`**.
