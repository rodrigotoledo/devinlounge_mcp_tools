# Multi-Framework Project — Configuration & Guidelines

This is the source of truth for repository layout, Docker rules, code style, and editor configuration.

---

## 🐳 Core Rule: Always Use Docker

**For all runtime, installs, tests, migrations, and scripts** — except Expo (React Native), which stays on host.

Working directory: **repo root** (where `docker-compose.yml` lives). Use `docker compose exec <service>` when containers are running, or `docker compose run --rm <service>` for one-shots.

During development, Docker Compose services should mount the local source directories so file changes on the host are reflected inside containers automatically.

Inter-service networking rule: from inside containers, call dependencies by Docker Compose service name (for example `http://api:8000`, `http://nestjs:3001`, `http://fullstack:3000`) and never by `localhost`. `localhost` is only for host/browser access to published ports.

Starter output rule (all frameworks): after scaffold, create at least one default working output immediately (HTML home route/screen or JSON health endpoint).

Do not run directly on the host:
- ❌ `npm install`, `npm run build` (Node services)
- ❌ `bundle install`, `rails`, `rspec`, `rubocop` (Rails)
- ❌ `pip install`, `python`, `uvicorn` (FastAPI/Python)
- ❌ `npm run start`, `nest` (NestJS)

---

## 📂 Project Structure

| Path | Stack | Runtime | Notes |
|------|-------|---------|-------|
| `expo-mobile/` | Expo, React Native, Expo Router, NativeWind, TS strict | **Host** (npm) | Mobile app; `npm run typecheck` on host |
| `web-nextjs/` | Next.js 15, React 19, TypeScript, Tailwind v4 | **Docker** (node service) | Web frontend; SSR + static export ready |
| `web-react/` | React 19, Vite, TypeScript, Tailwind v4 | **Docker** (node service) | SPA frontend; dev server, build, tests |
| `backend-nestjs/` | NestJS, TypeScript, PostgreSQL | **Docker** (node service) | REST/GraphQL API; tests, linting via Compose |
| `backend-fastapi/` | FastAPI, SQLAlchemy, Pydantic, PostgreSQL | **Docker** (api service) | Alternative Python API; async, OpenAPI docs |
| `backend-rails/` | Rails 8, PostgreSQL (main + cache DB), Redis, Sidekiq | **Docker** (fullstack, fullstack-worker) | Full-stack monolith; Solid Cache, Action Cable |
| `backend-phoenix/` | Phoenix, Elixir, PostgreSQL | **Docker** (phoenix service) | Functional API; LiveView, Channels ready |
| Repo root | `docker-compose.yml`, `.env`, `.env.example`, scripts, docs | — | Single source for all services, databases, caches |

---

## 🎯 Code Style & Naming

### Universal Rules (All Languages)

- **No abbreviations.** Use `category`, not `cat`; `style`, not `st`; `configuration`, not `config` in public APIs (but `config/` directories and common abbreviations like `env`, `pkg`, `pkg.json` are fine).
- **Comments only when logic is non-obvious.** Prefer clear naming and straightforward code over comments explaining what code does. Comment *why* something is done (design decision, workaround for a limitation, etc.).
- **Small, task-scoped changes.** Follow existing patterns in the file/package you're touching.
- **Clear error messages & validation only at system boundaries** — user input, external APIs, environment config. Trust internal code.

### File Organization

- **TypeScript/JavaScript:** `src/` for source, `tests/` or `__tests__/` for tests. Export types and constants from a clear index.
- **Rails:** Controllers, models, jobs, mailers in standard `app/` structure. Helpers for view logic. Tests in `spec/`.
- **NestJS:** Modules, controllers, services in `src/`. Tests co-located with services (`*.spec.ts`).
- **FastAPI:** Route files in `app/routers/`, models in `app/models/`, logic in `app/services/`. Tests in `tests/`.
- **Phoenix:** Controllers, views, live views in standard structure. Tests in `test/`.

---

## 🎨 Frontend — Tailwind CSS (Latest)

All frontends (Next.js, React, Rails ERB, Phoenix) use **Tailwind CSS v4** (latest).

- **Default to utility classes.** Use `className` (or `class=` in Rails/Phoenix) with Tailwind utilities for layout, spacing, typography, colors.
- **Inline styles only when necessary:** runtime values, animation libraries, or matching surrounding code that already uses `style={}`.
- **Reuse color tokens.** Define color palettes in `theme/colors.ts` (React/Next.js) or Tailwind config, then reference programmatically when `className` alone is insufficient.
- **Components over duplication.** Shared UI patterns → partials (Rails), components (React), or Phx.Component (Phoenix).

---

## 🔧 Service-Specific Commands

### Expo / React Native (Host)

```bash
cd expo-mobile

# Typecheck
npm run typecheck

# Start dev server
npx expo start   # or: npm start

# Build
npm run build

# Tests
npm run test
```

### Next.js (Docker)

```bash
# Install dependencies
docker compose exec nextjs npm install

# Dev server (runs inside container)
docker compose exec nextjs npm run dev

# Build
docker compose exec nextjs npm run build

# Tests
docker compose exec nextjs npm run test

# Linting
docker compose exec nextjs npm run lint
```

### React SPA (Docker)

```bash
# Install
docker compose exec react npm install

# Dev (Vite dev server)
docker compose exec react npm run dev

# Build
docker compose exec react npm run build

# Tests (Vitest)
docker compose exec react npm run test

# Linting
docker compose exec react npm run lint
```

### NestJS (Docker)

```bash
# Install
docker compose exec nestjs npm install

# Dev (watch mode)
docker compose exec nestjs npm run start:dev

# Build
docker compose exec nestjs npm run build

# Tests
docker compose exec nestjs npm run test

# Linting
docker compose exec nestjs npm run lint
```

### FastAPI (Docker)

```bash
# Install dependencies
docker compose exec api pip install -r requirements.txt

# Dev server (uvicorn with reload)
docker compose exec api uvicorn app.main:app --reload

# Tests
docker compose exec api pytest

# Linting
docker compose exec api ruff check .
docker compose exec api mypy app/
```

### Rails (Docker)

```bash
# Create a new Rails app without Minitest
docker compose exec fullstack bin/rails new my_app --skip-test

# Decide before scaffolding auth/UI:
# - auth: bcrypt
# - authorization: cancancan or pundit
# - styling: tailwindcss-rails or simplecss
# - background jobs: solid_queue or sidekiq
# - pagination: pagy or kaminari
# - rendering style: HTML-first or JSON/API-first
# - if relevant: search (ransack / pg_search), uploads (Active Storage / image_processing / shrine), admin (activeadmin / avo), auditing (paper_trail / audited), multi-tenancy (acts_as_tenant)

# Install gems
docker compose exec fullstack bundle install

# Required Rails test stack
docker compose exec fullstack bundle add rspec-rails --group "development,test"
docker compose exec fullstack bundle add shoulda-matchers --group "test"
docker compose exec fullstack bundle add simplecov --group "test"
docker compose exec fullstack bundle add guard-rspec --group "development,test"
docker compose exec fullstack bin/rails generate rspec:install
docker compose exec fullstack bundle exec guard init rspec
docker compose exec fullstack rm -rf test/

# Auth/authorization (choose what was decided)
docker compose exec fullstack bundle add bcrypt
docker compose exec fullstack bundle add cancancan
# or
docker compose exec fullstack bundle add pundit

# Migrations & schema
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rails generate migration DescriptiveName

# Tests (RSpec only)
docker compose exec fullstack bin/rspec

# Console
docker compose exec fullstack bin/rails console

# Linting
docker compose exec fullstack bin/rubocop
docker compose exec fullstack bin/erb-lint
```

Rails projects must use `rspec-rails` as the only test framework and `simplecov` as the default coverage tool. Keep `shoulda-matchers` and `guard-rspec` installed/configured in Rails projects. Do not keep Minitest as the active Rails testing workflow. Do not assume `devise`; prefer decision-first setup with `bcrypt` + (`cancancan` or `pundit`) and explicit CSS choice (`tailwindcss-rails` or `simplecss`). Before generating app features, also ask about background jobs, pagination, API serialization, and other gem-dependent choices such as search, uploads, admin/backoffice, auditing, and multi-tenancy when relevant.

### Phoenix (Docker)

```bash
# Install dependencies
docker compose exec phoenix mix deps.get

# Migrations
docker compose exec phoenix mix ecto.migrate

# Tests
docker compose exec phoenix mix test

# Dev server (iex)
docker compose exec phoenix iex -S mix phx.server

# Linting
docker compose exec phoenix mix credo
```

### All Services (Docker Compose)

```bash
# Start everything
docker compose up --build

# Start detached
docker compose up -d --build

# Stop & remove containers
docker compose down

# View logs
docker compose logs -f <service>   # e.g., docker compose logs -f nextjs

# Shell access
docker compose exec <service> bash   # Node services, Rails
docker compose exec api sh          # FastAPI
docker compose exec phoenix bash    # Phoenix
```

---

## 📝 Environment Variables

Each service has its own `.env` file, plus a root `.env` for shared infrastructure (ports, database URLs, Redis).

### Root `.env.example`

```
# Shared infrastructure — Ports & connection strings
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=app_user
POSTGRES_PASSWORD=dev_password

REDIS_HOST=localhost
REDIS_PORT=6379

# Service ports (published to host)
NEXTJS_PORT=3000
REACT_PORT=5173
NESTJS_PORT=3001
FASTAPI_PORT=8000
RAILS_PORT=3000
PHOENIX_PORT=4000

# Docker image build args
NODE_ENV=development
PYTHON_ENV=development
```

### Service-Specific `.env` Files

Each service directory has its own `.env.example`:

- `web-nextjs/.env.example`
- `web-react/.env.example`
- `backend-nestjs/.env.example`
- `backend-fastapi/.env.example`
- `backend-rails/.env.example` (or `.env.example` in `backend-rails/`)
- `backend-phoenix/.env.example`

**Setup script:**
```bash
# Create / update .env files from examples
./scripts/sync-env-from-example.sh
```

---

## 🧪 Testing & Quality

### TypeScript / JavaScript (All Node Services)

- **Linter:** ESLint (tsconfig strict)
- **Formatter:** Prettier (2 spaces)
- **Tests:** Vitest (React), Jest (Next.js, NestJS), or ts-node for unit tests
- **Run via Docker:** `docker compose exec <service> npm run test`

### Python (FastAPI)

- **Linter:** Ruff (replaces flake8, isort, black)
- **Type checker:** MyPy (basic or strict, depending on project)
- **Tests:** Pytest
- **Run via Docker:** `docker compose exec api pytest`, `docker compose exec api ruff check .`

### Ruby (Rails)

- **Linter:** RuboCop
- **Formatter:** Built-in (same tool)
- **Linter for ERB:** erb-lint
- **Tests:** `rspec-rails` only (no Minitest)
- **Coverage:** `simplecov` in every Rails project
- **Do NOT assert exact error messages.** Assert behavior: `expect(record).not_to be_valid`, `expect(record.errors[:email]).to be_present`, `expect(flash[:notice]).to be_present`.
- **Run via Docker:** `docker compose exec fullstack bin/rspec`, `docker compose exec fullstack bin/rubocop`

### Elixir (Phoenix)

- **Linter:** Credo
- **Formatter:** Built-in (`mix format`)
- **Tests:** ExUnit
- **Run via Docker:** `docker compose exec phoenix mix test`, `docker compose exec phoenix mix credo`

---

## 📦 Dependency Management

| Service | Tool | Lock File |
|---------|------|-----------|
| Next.js, React, NestJS | npm | `package-lock.json` |
| FastAPI | pip | `requirements.txt` (pin versions) |
| Rails | Bundler | `Gemfile.lock` |
| Phoenix | Hex/Mix | `mix.lock` |

After changing dependency files:
- **Node:** `docker compose build <service>` (or `up --build`)
- **Python:** `docker compose build api`
- **Ruby:** `docker compose build fullstack`
- **Elixir:** `docker compose build phoenix`

---

## 🌳 Git Workflow

**Use Git Flow for branching:**

1. **Main branch:** `main` — production-ready code. Always deployable.
2. **Development branch:** `develop` — integration branch for features.
3. **Feature branches:** `feature/<name>` from `develop`. PR back to `develop`.
4. **Hotfix branches:** `hotfix/<name>` from `main`. PR to both `main` and `develop`.
5. **Release branches:** `release/<version>` from `develop` for final testing. PR to `main` + `develop`.

**Commit messages:**
- Present tense, lowercase: `add user authentication`, `fix session timeout bug`
- Include context: `backend-nestjs: add JWT validation middleware`
- Reference issues: `fixes #123`

**PR process:**
- Squash commits into logical chunks before merging.
- Use descriptive PR titles with context: `[web-nextjs] add dark mode toggle`.
- Merge to `develop` (features) or `main` (hotfixes), never directly to `main` (except hotfixes).

---

## 🔄 Data & Caching

### PostgreSQL

- **Single shared instance** (all services read/write to same DB).
- Connection pooling: handled by each service (Prisma, SQLAlchemy, Ecto, etc.).
- **Rails special:** Solid Cache for fragment caching uses a separate `*_cache` table in the same DB.

### Redis

- **Single shared instance** for session storage, job queues, real-time messaging.
- **Rails:** Action Cable (WebSocket pubsub), Sidekiq (Active Job).
- **Phoenix:** Channels (similar to Action Cable), PubSub.
- **Services:** Key prefixing to avoid collisions (e.g., `nestjs:sessions:`, `fastapi:rate-limits:`).

### Migrations

Each service manages its own schema:
- **Rails:** `db/migrate/` + `db/cache_schema.rb` (Solid Cache)
- **NestJS:** TypeORM migrations in `src/database/migrations/`
- **FastAPI:** Alembic migrations in `app/migrations/`
- **Phoenix:** Ecto migrations in `priv/repo/migrations/`

Run migrations in Compose *before* starting the app:
```bash
docker compose exec fullstack bin/rails db:migrate
docker compose exec nestjs npm run migration:run
docker compose exec api alembic upgrade head
docker compose exec phoenix mix ecto.migrate
```

---

## 🎛️ Editor Configuration (VS Code / Cursor)

Shared `.vscode/settings.json` for all services. Extensions are auto-recommended in `.vscode/extensions.json`.

**Key configurations:**
- **Tab size:** 2 spaces (all languages)
- **Format on save:** Enabled
- **Rulers:** Column 100 (soft limit)
- **Bracket pair colorization & matching:** Enabled
- **Final newline & trim trailing whitespace:** Enabled
- **File exclusions:** `node_modules/`, `.venv/`, `__pycache__/`, `.git/`, `.DS_Store`, etc.

**Per-language formatters:**
- TypeScript/JavaScript: Built-in formatter
- Python: Ruff (via Pylance)
- Ruby: Ruby LSP
- Elixir: (standard tooling, no LSP auto-format in editor; use `mix format` via Compose)

**Linters:**
- ESLint for Node projects (when applicable)
- RuboCop disabled in editor (run via Docker)
- Python: Pylance (analysis only)

**Tailwind CSS:** Configured for all frontends using class regex.

---

## 🚀 Cursor-Specific Configuration

Create `.cursor/rules.md` in the repo root:

```markdown
# Cursor AI Rules for This Codebase

## Core Principles
1. Always use Docker for all runtime tasks (except Expo). Never run npm, bundle, pip, mix directly on the host.
2. No abbreviations in code — use `category` not `cat`, `style` not `st`.
3. Comment only when logic is non-obvious. Prefer clear names and straightforward code.
4. Follow existing patterns in the file/package you touch.

## Service-Specific Rules

### Frontend (Next.js, React, Expo)
- Use Tailwind CSS utilities by default. Inline styles only for dynamic/runtime values.
- Prioritize accessibility: semantic HTML, ARIA labels, keyboard navigation.
- Keep components small and focused. Extract repeated logic to custom hooks.

### NestJS Backend
- Use NestJS modules for domain organization. Keep controllers thin; logic in services.
- Dependency injection is the default. Avoid singletons.
- Use guards/pipes/interceptors for cross-cutting concerns (auth, validation, logging).

### FastAPI Backend
- Use Pydantic models for request/response validation and documentation.
- Async/await throughout. Use proper dependency injection.
- Keep routes in separate routers by domain. Services contain business logic.

### Rails Fullstack
- Use Rails conventions: models for DB logic, controllers for request handling, views for presentation.
- Helpers for view-specific logic (labels, CSS classes, display rules). Avoid duplicating view logic.
- RSpec only for tests. Assert behavior (HTTP status, redirect), not exact error messages.

### Phoenix Backend
- Use Phoenix context modules to organize business logic (similar to Rails concerns/services).
- LiveView for real-time UI updates. Channels for WebSocket communication.
- Keep schemas focused on validation. Queries in context modules.

## Token Optimization
- Keep responses concise. Avoid over-explaining working code.
- Suggest specific file locations and line numbers when referencing code.
- Use diffs for changes, not full file rewrites.
- Ask clarifying questions instead of guessing intent.

## Git & Deployment
- Use Git Flow: `develop` for features, `main` for production.
- Write clear, present-tense commit messages: `add user auth`, `fix timeout bug`.
- Always run tests and linters via Docker *before* pushing.
```

---

## 🤖 Copilot & Other AI Assistants

**Add to `.copilot-config.json` (or integrate into VS Code settings):**

```json
{
  "copilot": {
    "rules": {
      "no_abbreviations": true,
      "always_docker": true,
      "tailwind_first": true,
      "test_via_compose": true,
      "git_flow": true
    },
    "exclude_patterns": [
      "node_modules/",
      ".venv/",
      "__pycache__/",
      ".git/",
      "dist/",
      "build/"
    ]
  }
}
```

---

## 📚 Quick Reference

### Install a dependency (Docker)

```bash
# Node services
docker compose exec nextjs npm install <package>
docker compose exec nestjs npm install <package>

# Python
docker compose exec api pip install <package> && docker compose exec api pip freeze > requirements.txt

# Ruby
docker compose exec fullstack bundle add <gem>

# Elixir
docker compose exec phoenix mix ecto.gen.migration add_field_to_users
```

### Run tests (all services)

```bash
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test
```

### Database & migrations

```bash
# Rails
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rails db:seed

# NestJS
docker compose exec nestjs npm run migration:run

# FastAPI
docker compose exec api alembic upgrade head

# Phoenix
docker compose exec phoenix mix ecto.migrate
```

### Check linting/style

```bash
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec api ruff check .
docker compose exec fullstack bin/rubocop
docker compose exec phoenix mix credo
```

---

## 📖 Further Reading

- **Docker:** See `docker-compose.yml` for full service definitions.
- **Tailwind:** Check each frontend's `tailwind.config.js`.
- **Git Flow:** https://nvie.com/posts/a-successful-git-branching-model/
- **Code style:** Follow existing patterns in each service. When in doubt, consult language-specific linters (ESLint, RuboCop, Ruff, Credo).

