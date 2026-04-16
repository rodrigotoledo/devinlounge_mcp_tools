# Cursor AI Rules — Multi-Framework Codebase

These rules guide Cursor's behavior in this polyglot codebase. They ensure consistency, reduce token waste, and maintain Docker-first practices.

## 🐳 Foundational Rules

1. **Always use Docker Compose for backend services.** Never run `npm`, `bundle`, `pip`, `mix`, or `poetry` directly on the host. Use `docker compose exec <service> …` for running services or one-shot commands.
2. **Expo / React Native stays on host.** Use `npm`, `npm run`, `npx expo` directly in `expo-mobile/` directory.
3. **All migrations, tests, and installs via Docker.** Always.

## 📝 Code Style

- **No abbreviations.** Use `category`, not `cat`; `style`, not `st`; `configuration`, not `config` (exceptions: `pkg`, `env`, `db` in file paths and common abbreviations in established libraries).
- **Comments only when necessary.** Document *why*, not *what*. If the code is clear, no comment is needed. If logic is complex, explain the decision or workaround.
- **Follow language conventions.** PascalCase for classes (TS/JS/Python), snake_case for functions (Python), UPPERCASE for constants.
- **Small, focused changes.** Stick to the task. Don't refactor unrelated code.

## 🎯 Per-Service Rules

### Frontend (Expo, Next.js, React)

**Expo (React Native) — Host Environment**
- Run on host: `npx expo start`, `npm run typecheck`, `npm run test`
- Use NativeWind + Tailwind utilities in `className`
- Inline styles only for dynamic/runtime values
- Extract repeated logic to custom hooks
- Keep components small and single-purpose

**Next.js — Docker Service**
- Docker command: `docker compose exec nextjs …`
- Use App Router (Pages Router is deprecated)
- Prefer Server Components by default; Client Components only when needed
- Tailwind utilities in `className`
- API routes in `app/api/`
- Environment variables in `web-nextjs/.env.local` and `.env.example`

**React SPA — Docker Service**
- Docker command: `docker compose exec react …`
- Use Vite as bundler
- Tailwind utilities in `className`
- Component structure: small, reusable units
- Custom hooks for shared logic
- Tests with Vitest (`*.test.ts` or `*.spec.ts`)

**All Frontends**
- Use Tailwind v4 (latest) for styling
- Semantic HTML for accessibility
- ARIA labels where needed
- Keyboard navigation support
- Mobile-first responsive design

### Backend — NestJS (Node)

**Docker command:** `docker compose exec nestjs …`

- **Module organization:** One module per domain. Controllers are thin (route → service).
- **Dependency Injection:** Use NestJS DI for everything. No singletons.
- **Validation:** Class-validator + class-transformer for request DTOs
- **Guards/Pipes/Interceptors:** Use for auth, validation, logging, error handling.
- **Database:** TypeORM (default) or Prisma. Migrations in `src/database/migrations/`.
- **Tests:** Jest with `--coverage`. Co-locate with source (`*.spec.ts`).
- **Linting:** ESLint + Prettier. Run via Docker: `docker compose exec nestjs npm run lint`

### Backend — FastAPI (Python)

**Docker command:** `docker compose exec api …`

- **Structure:** Routers by domain in `app/routers/`, models in `app/models/`, business logic in `app/services/`.
- **Validation:** Pydantic v2. Use models for all request/response validation and OpenAPI docs.
- **Async:** Use `async/await` throughout. FastAPI is async by default.
- **Dependency Injection:** Use FastAPI's Depends() for injecting dependencies.
- **Database:** SQLAlchemy 2.0 with async support. Alembic for migrations in `app/migrations/`.
- **Tests:** Pytest with fixtures. Keep tests focused on behavior, not implementation.
- **Linting:** Ruff (replaces flake8, isort, black). Run via Docker: `docker compose exec api ruff check .`
- **Type Checking:** MyPy or Pylance (editor only). Run via Docker as part of CI if needed.

### Backend — Rails (Ruby)

**Docker command:** `docker compose exec fullstack …`

- **Structure:** Standard Rails conventions. Models for DB logic, controllers for requests, views for presentation.
- **Helpers:** Use for view-specific logic (labels, CSS classes, display rules). Keep them small.
- **Testing:** RSpec only. No Minitest. Assert behavior, not exact error messages.
  - `expect(record).not_to be_valid` not `expect(record.errors.full_messages).to include("Email...")`
  - Check presence: `expect(record.errors[:email]).to be_present`
  - Use error symbols: `expect(record.errors.details[:email].map { _1[:error] }).to include(:blank)`
- **Database:** Migrations in `db/migrate/`. Solid Cache uses `db/cache_schema.rb`.
- **Caching:** Fragment cache = Solid Cache (PostgreSQL). Session/job cache = Redis (via Sidekiq + Action Cable).
- **Linting:** RuboCop + erb-lint. Run via Docker: `docker compose exec fullstack bin/rubocop`

### Backend — Phoenix (Elixir)

**Docker command:** `docker compose exec phoenix …`

- **Structure:** Context modules for business logic (similar to Rails services). Schemas for validation. Views/Controllers for HTTP.
- **LiveView:** For real-time UI updates. Channels for WebSocket communication.
- **Database:** Ecto for queries & migrations. Migrations in `priv/repo/migrations/`.
- **Testing:** ExUnit. Test synchronously; use fixtures for setup.
- **Linting & Format:** Credo for linting. Format via `mix format` (run via Docker, not in editor).
- **Dependencies:** Mix + Hex. Update `mix.exs` and run `docker compose exec phoenix mix deps.get`

## 🚀 Common Tasks (Always via Docker)

### Install a Dependency

```bash
# Node services
docker compose exec nextjs npm install <package>
docker compose exec nestjs npm install <package>
docker compose exec react npm install <package>

# Python
docker compose exec api pip install <package>
docker compose exec api pip freeze > backend-fastapi/requirements.txt

# Ruby
docker compose exec fullstack bundle add <gem>

# Elixir
docker compose exec phoenix mix ecto.gen.migration create_table_name
```

### Run Tests

```bash
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test
```

### Linting & Formatting

```bash
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec react npm run lint
docker compose exec api ruff check . && mypy app/
docker compose exec fullstack bin/rubocop && bin/erb-lint app/views
docker compose exec phoenix mix credo && mix format --check-formatted
```

### Database Migrations

```bash
# Rails
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rails generate migration DescriptiveName

# NestJS
docker compose exec nestjs npm run migration:run
docker compose exec nestjs npm run migration:generate src/database/migrations/CreateUserTable

# FastAPI
docker compose exec api alembic upgrade head
docker compose exec api alembic revision --autogenerate -m "description"

# Phoenix
docker compose exec phoenix mix ecto.migrate
docker compose exec phoenix mix ecto.gen.migration create_table_name
```

## 🎨 Tailwind CSS

Used in all frontends: Expo, Next.js, React, Rails (ERB), Phoenix (EEx).

- **Default approach:** Use Tailwind utility classes in `className` (or `class=` in ERB/EEx)
- **Dynamic values:** Use inline `style={{}}` only when class names cannot express the value
- **Color tokens:** Define in `theme/colors.ts` (frontends) or Tailwind config for programmatic access
- **Responsive design:** Mobile-first; use `sm:`, `md:`, `lg:` prefixes
- **Dark mode:** Configure in `tailwind.config.js` (usually `class` strategy)

## 🌳 Git Workflow — Git Flow

**Branches:**
- `main` — Production-ready. Always deployable.
- `develop` — Integration branch for features.
- `feature/<name>` — New features, bug fixes. Branch from `develop`. PR back to `develop`.
- `hotfix/<name>` — Critical production fixes. Branch from `main`. PR to both `main` and `develop`.
- `release/<version>` — Final testing before production. Branch from `develop`. PR to `main` + `develop`.

**Commit messages:**
- Present tense, lowercase: `add user authentication`, `fix session timeout`
- Include context: `backend-nestjs: add JWT validation`, `web-nextjs: fix dark mode toggle`
- Reference issues: `fixes #123`

**PR guidelines:**
- Descriptive title with service context: `[backend-fastapi] add database connection pooling`
- Squash related commits into logical chunks
- Always merge to `develop` (features) or back to both `main` + `develop` (hotfixes)
- Never force-push to shared branches

## 💡 Token Optimization

**Help Cursor stay efficient:**
- **Be specific:** Reference file paths, line numbers, and exact function names.
- **Show, don't tell:** Provide code diffs or snippets instead of long descriptions.
- **Ask before acting:** Clarify ambiguous requests instead of guessing.
- **Keep responses concise:** Summarize working solutions; don't re-explain code.
- **Avoid duplication:** Don't repeat the same question; acknowledge prior context.

**Cursor best practices:**
- Use Cmd+K (or Ctrl+K) for inline edits; Cmd+I (or Ctrl+I) for chat
- Reference existing code patterns instead of asking for full rewrites
- Use `/` commands for focused tasks: `/edit`, `/explain`, `/test`

## 🔐 Environment & Secrets

- **`.env.example`** — Committed to repo. Contains defaults and placeholders.
- **`.env`** — Local only. Never committed. Created from `.env.example`.
- **Secrets management:** Use environment variables for sensitive data (API keys, DB passwords). Store in `.env` locally, in CI/CD system vars or secrets manager in production.
- **Rotation:** Change passwords/tokens regularly. Update `.env.example` comments to reflect expected format only, never actual values.

## ❌ What NOT to Do

- ❌ Run `npm install` on the host (except Expo)
- ❌ Run `bundle install` on the host
- ❌ Run `pip install` on the host (no venv on host for backend services)
- ❌ Use abbreviations in identifiers (`cat`, `st`, `config` outside file paths)
- ❌ Commit `.env` files or real secret values
- ❌ Assert exact error message text in tests (leads to brittle tests)
- ❌ Duplicate code; extract to functions/components/helpers
- ❌ Force-push to shared branches (main, develop)
- ❌ Mix testing frameworks (RSpec + Minitest in Rails, etc.)
- ❌ Ignore linting/type errors; fix them or configure exceptions with comments

## ✅ Checklist Before Commit

- [ ] Code follows language conventions (casing, naming, style)
- [ ] No abbreviations in identifiers
- [ ] Tests pass (via Docker): `docker compose exec <service> npm run test`
- [ ] Linting passes: `docker compose exec <service> npm run lint` (or equivalent)
- [ ] `.env.example` updated if new env vars added
- [ ] Migrations created (if DB schema changed)
- [ ] Commit message is clear: `[service] action: description`
- [ ] PR is against correct branch (`develop` for features, `main` for hotfixes)
- [ ] No secrets or sensitive data in commit

## 📚 References

- **Docker Compose:** `docker-compose.yml` in repo root; `--help` for all commands
- **Tailwind:** https://tailwindcss.com/docs
- **Git Flow:** https://nvie.com/posts/a-successful-git-branching-model/
- **Service docs:** See service-specific `.env.example` and `README.md` files

---

**Last updated:** 2026-04-16  
**Git Flow:** Strict adherence required  
**Docker:** Mandatory for all non-Expo services
