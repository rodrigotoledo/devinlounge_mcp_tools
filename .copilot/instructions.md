# GitHub Copilot Instructions

**Last updated:** 2026-04-16  
**Applies to:** GitHub Copilot in VS Code

These instructions guide GitHub Copilot (and other AI assistants integrated via GitHub's tools) in this multi-framework codebase.

---

## 🎯 Core Principles

1. **Docker-First:** All non-Expo service runtime, tests, installs, and migrations must use Docker Compose. Never suggest or run `npm`, `bundle`, `pip`, `mix` directly on the host except for Expo Mobile.

2. **Container Networking by Service Name:** For container-to-container calls, always use Compose DNS service names (for example `http://api:8000`, `http://nestjs:3001`), never `localhost`.

3. **Default Starter Output:** For every newly created project, always add at least one immediate working output (HTML home/screen or JSON health endpoint).

4. **No Abbreviations:** Reject abbreviated identifiers. Suggest `category`, not `cat`; `style`, not `st`. Exceptions: `env`, `pkg`, `db`, `app` in file paths and established library abbreviations.

5. **Clear Code Over Comments:** Prefer self-documenting code. Only comment when logic is non-obvious or explains a workaround/design decision.

6. **Tailwind-First UI:** Use Tailwind CSS utility classes by default in all frontends. Inline styles only for dynamic/runtime values.

7. **Test Behavior, Not Messages:** In Rails/RSpec, assert behavior (`expect(record).not_to be_valid`), not exact error text.

8. **Follow Existing Patterns:** Stay consistent with the codebase style in the file/package being edited.

---

## 📍 Per-Service Guidelines

### Expo (React Native) — Host Environment

**Copilot should:**
- Suggest commands to run on the **host:** `npm start`, `npm run typecheck`, `npm run test`
- Always leave a default starter screen/page immediately after scaffold (e.g., `app/index.tsx` with a basic "ready" message)
- Recommend NativeWind + Tailwind utilities in `className`
- Recommend Expo Router typed routes for safer navigation
- Recommend TanStack Query for server-state in Expo apps
- Recommend `expo-secure-store` for auth/session token persistence
- Do not suggest Redux unless explicitly requested
- Extract repeated logic to custom hooks
- Keep components small and single-purpose

### Next.js 15 — Docker Service

**Copilot should:**
- Suggest: `docker compose exec nextjs npm run …` for all operations
- Always create a default output route/page after scaffold (e.g., `app/page.tsx` and/or `app/api/health/route.ts`)
- Recommend App Router (no Pages Router)
- Prefer Server Components; Client Components only when needed
- Use Tailwind utilities in `className`
- Recommend TanStack Query for client-side server-state
- Recommend React Hook Form + Zod for forms
- Do not suggest Redux unless explicitly requested
- API routes in `app/api/`

### React 19 SPA — Docker Service

**Copilot should:**
- Suggest: `docker compose exec react npm run …` for all operations
- Always leave a basic default screen in `src/App.tsx` and wire an initial backend health fetch when relevant
- Recommend Vite as bundler
- Use Tailwind utilities in `className`
- Recommend TanStack Query for server-state and cache invalidation
- Recommend React Hook Form + Zod for form validation
- Do not suggest Redux unless explicitly requested
- Create reusable components, not duplication
- Use Vitest for tests (`*.test.ts` / `*.spec.ts`)

### NestJS Backend — Docker Service

**Copilot should:**
- Suggest: `docker compose exec nestjs npm run …` for all operations
- Ensure a basic default JSON response exists immediately after scaffold (e.g., `GET /` returns `{ status: 'ok', service: 'nestjs' }`)
- Recommend modular architecture: one module per domain
- Suggest thin controllers (route handlers), thick services (business logic)
- Use NestJS DI for all dependencies
- Recommend class-validator + class-transformer for validation
- Recommend `@nestjs/swagger` for API contracts/docs
- Suggest Guards/Pipes/Interceptors for auth/logging/error handling
- Use TypeORM or Prisma for database queries
- Place tests co-located: `*.spec.ts` next to source and add e2e tests for critical endpoints

### FastAPI Backend — Docker Service

**Copilot should:**
- Suggest: `docker compose exec api pip install …` and `docker compose exec api python …` / `pytest`
- Ensure a default JSON health endpoint exists immediately after scaffold (e.g., `GET /health`)
- Recommend route organization: routers by domain in `app/routers/`
- Suggest Pydantic models for all validation and OpenAPI docs
- Recommend `pydantic-settings` for typed environment/config handling
- Recommend async/await throughout
- Use FastAPI's Depends() for dependency injection
- Suggest SQLAlchemy 2.0 with async support
- Recommend lifespan startup/shutdown hooks for shared resources (DB clients, caches)
- Recommend Pytest for tests with fixtures
- Suggest Ruff for linting, MyPy for type checking

### Rails Fullstack — Docker Service

**Copilot should:**
- Suggest: `docker compose exec fullstack …` for all runtime tasks
- Ensure a default response exists immediately after scaffold (`root 'home#index'` for HTML-first or `/health` JSON for API-heavy)
- Recommend Rails conventions: models ↔ DB, controllers ↔ requests, views ↔ HTML
- Suggest helpers for view-specific logic
- When creating a new Rails app, suggest `bin/rails new ... --skip-test`
- After app creation, install/configure `rspec-rails`, `shoulda-matchers`, `simplecov`, and `guard-rspec`
- Suggest `bin/rails generate rspec:install`, `bundle exec guard init rspec`, and removing `test/` when present
- Before scaffolding, ask the gem decisions first: auth (`bcrypt`, `devise` only if explicit, or OAuth), authorization (`cancancan`, `pundit`, or none), CSS (`tailwindcss-rails` or `simplecss`), background jobs (`solid_queue` or `sidekiq`), pagination (`pagy` or `kaminari`), and whether the app is HTML-first or API-heavy (`jbuilder` / `blueprinter` only when needed)
- Ask follow-up gem questions when relevant: search (`ransack` or `pg_search`), uploads (Active Storage / `image_processing` / `shrine`), admin (`activeadmin` / `avo`), auditing (`paper_trail` / `audited`), and multi-tenancy (`acts_as_tenant`)
- Do not default to `devise` unless explicitly requested
- **Reject** Minitest; use **RSpec only**
- Prefer **request specs** over controller specs in Rails
- Prefer route/path helpers (`root_path`, `user_path(user)`) over hardcoded route strings in specs
- Recommend asserting behavior: `expect(record).not_to be_valid`; **reject** `expect(record.errors.full_messages).to include("Email…")`
- Suggest Solid Cache for fragment caching (PostgreSQL-backed)
- Recommend Sidekiq + Action Cable via Redis

### Phoenix / Elixir Backend — Docker Service

**Copilot should:**
- Suggest: `docker compose exec phoenix …` for all operations
- Ensure a default JSON health output exists after scaffold (e.g., `GET /health`)
- Recommend context modules for business logic (similar to Rails services)
- Suggest LiveView for real-time UI updates
- Recommend Channels for WebSocket communication
- Suggest Ecto for queries and schema validation
- Recommend ExUnit for tests
- Suggest Credo for linting, `mix format` for formatting (run via Docker)

---

## 🚀 Common Operations

### Install Dependency

**Node services:**
```bash
docker compose exec nextjs npm install <package>
docker compose exec nestjs npm install <package>
docker compose exec react npm install <package>
```

**Python:**
```bash
docker compose exec api pip install <package>
docker compose exec api pip freeze > requirements.txt
```

**Ruby:**
```bash
docker compose exec fullstack bundle add <gem>
```

**Elixir:**
```bash
docker compose exec phoenix mix deps.get
```

### Run Tests

**Copilot should always suggest via Docker:**
```bash
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test
```

### Linting & Type Checking

**Never suggest running linters on the host; always via Docker:**
```bash
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec api ruff check . && mypy app/
docker compose exec fullstack bin/rubocop
docker compose exec phoenix mix credo
```

### Database Migrations

**Always via Docker:**
```bash
# Rails
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rails generate migration MigrationName

# NestJS
docker compose exec nestjs npm run migration:run
docker compose exec nestjs npm run migration:generate

# FastAPI
docker compose exec api alembic upgrade head
docker compose exec api alembic revision --autogenerate -m "description"

# Phoenix
docker compose exec phoenix mix ecto.migrate
docker compose exec phoenix mix ecto.gen.migration migration_name
```

---

## 🌳 Git Workflow

**Copilot should recommend Git Flow:**

- Main branch: `main` (production-ready only)
- Integration branch: `develop` (merge features here)
- Feature branches: `feature/<name>` from `develop`; PR back to `develop`
- Hotfixes: `hotfix/<name>` from `main`; PR to both `main` and `develop`
- Release prep: `release/<version>` from `develop`; PR to `main` + `develop`

**Commit message style:**
- Present tense, lowercase: `add user authentication`, `fix timeout bug`
- Include context: `backend-nestjs: add JWT validation`, `web-nextjs: fix dark mode`
- Reference issues: `fixes #123`

**Copilot should never suggest:**
- Force-pushing to shared branches (`main`, `develop`)
- Direct commits to `main` (use `develop` + PR flow)
- `git add .` without reviewing changes

---

## 🎨 Code Style Preferences

### Naming

- **Identifiers:** Clear, full names. `user_category`, not `user_cat`; `navigation_style`, not `nav_st`
- **Files:** `snake_case.ts`, `snake_case.py`, `snake_case.rb`, `snake_case.ex`
- **Exports:** Named exports preferred over defaults (TS/JS)
- **Constants:** `UPPERCASE_WITH_UNDERSCORES`
- **Classes:** `PascalCase`
- **Functions/variables:** `camelCase` (TS/JS), `snake_case` (Python/Ruby/Elixir)

### Comments

- **Only when necessary.** Code should be self-explanatory.
- Comment *why*, not *what*. Good: "Retry only on transient errors; permanent errors fail fast." Bad: "Increment the counter."
- Use TODO, FIXME, NOTE sparingly, with context: `// TODO: switch to async/await once Node 18 LTS is standard (planned Q3 2024)`

### Formatting

- **Indentation:** 2 spaces (all languages)
- **Line length:** Soft limit 100 characters
- **EOL:** LF (Unix-style)
- **Final newline:** Always
- **Trailing whitespace:** None

---

## ❌ Anti-Patterns — Reject These Suggestions

- ❌ Running `npm install` / `bundle install` / `pip install` on the host (except Expo)
- ❌ Abbreviated identifiers (`cat`, `st`, `config` outside file paths)
- ❌ Asserting exact error message text in tests: use `expect(errors[:field]).to be_present`
- ❌ Duplicating code; suggest extracting to functions/components/helpers
- ❌ Using Minitest in Rails (only RSpec)
- ❌ Inline styles when Tailwind can express the value
- ❌ Force-pushing to `main` or `develop`
- ❌ Committing `.env` files or secrets
- ❌ Running migrations on the host (use Docker)
- ❌ Using abbreviations in public APIs / identifiers

---

## ✅ Patterns to Encourage

- ✅ Using Docker for all backend operations: `docker compose exec <service> …`
- ✅ Clear, descriptive naming: `user_authentication_middleware`, not `auth_mid`
- ✅ Extracting repeated logic to functions/components/helpers
- ✅ Asserting behavior in tests, not implementation details
- ✅ Using Tailwind utilities by default for styling
- ✅ Small, focused commits with clear messages
- ✅ Following service-specific conventions (Rails conventions, NestJS modules, Phoenix contexts, etc.)
- ✅ Using TypeScript strict mode where possible
- ✅ Type annotations and validation at system boundaries (external APIs, user input)

---

## 🔐 Security

**Copilot should suggest:**
- Storing secrets in `.env` (local) or environment variables (production)
- Never committing `.env` or real secrets
- Input validation at system boundaries (user input, external APIs)
- Output encoding to prevent XSS (in React/Next.js views)
- SQL parameterization (ORM handles this automatically)
- HTTPS in production URLs
- Rate limiting on public APIs

---

## 📚 Resources

- **Main rules:** See `CLAUDE.md` in repo root
- **Cursor rules:** See `.cursor/rules.md`
- **Tailwind:** https://tailwindcss.com/docs
- **Git Flow:** https://nvie.com/posts/a-successful-git-branching-model/
- **Service docs:** Individual `README.md` in each service directory

---

**Note:** These instructions are enforced for GitHub Copilot in VS Code. Similar principles apply to other AI assistants (Cursor, Claude, etc.).
