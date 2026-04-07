# Claude / Claude Code — project context

Use this file as the source of truth for repository layout when planning or editing code.

## Rule for agents (Cursor, Claude Code, Copilot, etc.)

**Prefer Docker Compose from the repository root** for anything that runs the **API** (`api`) or **Rails fullstack** (`fullstack`): installs, tests, consoles, migrations, one-off scripts. Use `docker compose exec <service> …` when containers are already up, or `docker compose run --rm <service> …` for one-shots.

- **Do not** default to host **`python`**, **`pip`**, **`uvicorn`**, **`bundle`**, **`rspec`**, **`rails`**, or **`rake`** for those services unless the user explicitly opts out of Docker.
- **Expo** (`hardhat-expo/`) stays on the **host** with Node/npm — unchanged.

Working directory for all `docker compose` commands: **repo root** (where `docker-compose.yml` lives).

## Structure

| Path | Stack | Notes |
|------|--------|--------|
| `hardhat-expo/` | Expo (React Native), Expo Router, NativeWind, TS strict | App routes: `app/`; UI: `components/`; `npm run typecheck` from this directory (**host**, not Docker) |
| `hardhat-backend/` | FastAPI, SQLAlchemy, Pydantic | Source da API; **Compose na raiz** — see below |
| `hardhat-fullstack/` | Rails 8 + **PostgreSQL** (app + **Solid Cache** DB `*_cache`) + **Redis** (`REDIS_URL`: Action Cable, Sidekiq) | **DDL** em `db/migrate/` + `db/cache_schema.rb`; web **`fullstack`** + worker **`fullstack-worker`** (Sidekiq); Tailwind v4 = Expo |
| Repo root | `docker-compose.yml` (Postgres + Redis + API + Rails), optional Ruby tooling | `.rubocop.yml`, `.erb-lint.yml` may apply to Ruby/ERB elsewhere |

## Commands — Expo (host)

From repo root:

- Typecheck: `cd hardhat-expo && npm run typecheck`
- Start app: `cd hardhat-expo && npx expo start` (or `npm start`)

## Commands — API + Rails (**Docker Compose only**)

All **FastAPI** runtime, **`pip`/Python** installs, and ad hoc Python **must** use the **`api`** service. All **Rails** runtime, **`bundle`**, **`rspec`**, **`rubocop`**, **`rails`/`rake`** tasks that target the composed app **must** use the **`fullstack`** service — always from **`docker-compose.yml` at the repo root**.

O Compose sobe **`fullstack`** (Puma): `bundle check || bundle install`, `bin/rails db:prepare`, `bin/rails server` na porta **3000** (`FULLSTACK_PORT`). **`fullstack-worker`** roda **`bundle exec sidekiq`** (Active Job). Em **development** (Compose), Rails usa credenciais discretas **`FULLSTACK_DATABASE_*`** → **`DATABASE_*`** no container (ver `.env.example`). Em **production**, `database.yml` usa **`DATABASE_URL`** e opcional **`DATABASE_CACHE_URL`** (senão deriva `<db>_cache` na mesma URL). Fragment cache = **Solid Cache** (Postgres). **`REDIS_URL`** (default `redis://redis:6379/1`) = Action Cable + Sidekiq — a API usa outro índice Redis (ex. `/0`).

Optional **root `.env`**: portas e `WATCHFILES_FORCE_POLLING` (veja **`.env.example`** na raiz). API: **`hardhat-backend/.env`**. Rails: **`hardhat-fullstack/.env`**. Para criar/atualizar `.env` a partir dos exemplos: **`./scripts/sync-env-from-example.sh`**.

| Goal | Command |
|------|--------|
| Stack completo (foreground) | `docker compose up --build` |
| Detached | `docker compose up -d --build` |
| Stop + remove containers | `docker compose down` |
| API logs | `docker compose logs -f api` |
| Rails logs | `docker compose logs -f fullstack` |
| Sidekiq (worker) logs | `docker compose logs -f fullstack-worker` |
| Shell no container da API | `docker compose exec api sh` |
| Shell no container Rails | `docker compose exec fullstack bash` |
| Instalar gems (após mudar `Gemfile`) | `docker compose exec fullstack bundle install` |
| Schema / migrações (Postgres compartilhado) | `docker compose exec fullstack bin/rails db:migrate` |
| Nova migration | `docker compose exec fullstack bin/rails generate migration NomeDescritivo` |
| Testes RSpec | `docker compose exec fullstack bin/rspec` |
| RuboCop (Rails) | `docker compose exec fullstack bin/rubocop` |
| Console Rails | `docker compose exec fullstack bin/rails console` |
| Python one-off | `docker compose exec api python -c "..."` |

Use **`docker compose exec`** when o serviço já está **`up`**. Use **`docker compose run --rm api …`** ou **`run --rm fullstack …`** para one-shots (DB/redis costumam precisar estar saudáveis).

After **`requirements.txt`** changes: `docker compose build api` (or `up --build`). After **`Gemfile` / `Gemfile.lock`** changes: `docker compose build fullstack` (or `up --build`).

## Style

- Small, task-scoped changes; follow existing naming and file organization in the package you touch.
- After substantive TS changes in `hardhat-expo`, run `npm run typecheck` there.
- Prefer **clear naming** (avoid abbreviations like `cat`, `st`; use `category`, `style`, etc.).

### `hardhat-expo/` — NativeWind / Tailwind

- **Default to `className`** with Tailwind utility classes (NativeWind) for layout, spacing, typography, and colors.
- Use **`style={{}}`** only when Tailwind is impractical (runtime/dynamic values, `Animated`, third-party components, or matching surrounding code that already uses inline styles).
- Reuse **`theme/colors.ts`** for programmatic colors when `className` alone is not enough.

## Testing — `hardhat-fullstack/` (Rails)

- Use **RSpec only** for Rails tests in this repo (`spec/`, `bin/rspec` via Docker Compose `fullstack`). Do **not** add or default to Minitest for application specs unless the user explicitly asks.
- **Do not assert exact human-readable messages** (validation errors, `raise` messages, I18n strings). Those change with copy and locale and make tests brittle.
  - Prefer: `expect(record).to be_valid` / `not_to be_valid`, `expect(record.errors.added?(:attr, :blank)).to be true` (or other symbol), `expect(record.errors[:email]).to be_present`, or `expect(record.errors.details[:attr].map { _1[:error] }).to include(:blank)`, etc.
  - Avoid: `expect(record.errors.full_messages).to include("Email can't be blank")` or `to eq("…")` on message text.
- **Model specs**: focus on **validity, invalidity, and which attributes fail** (validations, constraints), not wording of errors.
- **Request / controller / system specs**: assert **behavior** — HTTP status, **redirect URL**, DB changes, **that flash keys are set** (`expect(flash[:notice]).to be_present`, `expect(flash[:alert]).to be_present`) — **not** the exact flash sentence. Prefer testing **endpoint contract** (status, location, side effects) over copy.

## Rails helpers (views)

- Prefer using **Rails helpers** and **partials** for repeated/derived view logic (labels, CSS class maps, display rules) instead of inline ERB.
- Keep helpers small and readable; avoid cryptic abbreviations in variable names.

## Local overrides

- **Claude Code** user-specific permissions may live in `.claude/settings.local.json` (do not commit secrets).

## VS Code / Cursor

- Shared settings: `.vscode/settings.json`. If RuboCop fails to run (no `Gemfile` at repo root), set `ruby.rubocop.useBundler` to `false` in that file or add a root `Gemfile`.
- **`python.defaultInterpreterPath`** is for **editor IntelliSense** only; it does **not** replace running the API via **Docker Compose** for backend work.
