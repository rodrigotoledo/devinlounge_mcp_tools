# Project Setup Checklist

Complete this checklist to properly set up your multi-framework, multi-service project.

---

## ✅ Phase 1: Repository Configuration

- [ ] **`.env.example`** — Root environment variables template (defaults for all services)
- [ ] **`.env`** — Local environment file (created from `.env.example`, **never commit**)
  - Run: `cp .env.example .env`
  - Review and customize values if needed
- [ ] **`.gitignore`** — Excludes node_modules, .venv, .env, build artifacts, etc.
- [ ] **`.editorconfig`** — Enforces consistent formatting (2 spaces, UTF-8, LF, etc.)

**Action:** Review all four files; confirm `.gitignore` and `.editorconfig` are committed, `.env` is NOT committed.

---

## ✅ Phase 2: Directory Structure

Create the following directory layout (adjust service names to match your stack):

```
├── expo-mobile/             # Expo (React Native) — host-based
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── app/
│       ├── components/
│       └── hooks/
│
├── web-nextjs/              # Next.js 15 frontend — Docker
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── .env.local           # Local overrides (git-ignored)
│   ├── Dockerfile
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── web-react/               # React 19 SPA — Docker
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│       ├── components/
│       ├── pages/
│       └── hooks/
│
├── backend-nestjs/          # NestJS API — Docker
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── modules/
│
├── backend-fastapi/         # FastAPI API — Docker
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── app/
│       ├── main.py
│       ├── models/
│       ├── routers/
│       └── services/
│
├── backend-rails/           # Rails fullstack — Docker
│   ├── Gemfile
│   ├── Gemfile.lock
│   ├── .env.example
│   ├── Dockerfile
│   ├── config/
│   ├── app/
│   ├── db/
│   │   ├── migrate/
│   │   └── cache_schema.rb
│   └── spec/
│
├── backend-phoenix/         # Phoenix API — Docker
│   ├── mix.exs
│   ├── mix.lock
│   ├── .env.example
│   ├── Dockerfile
│   └── lib/
│       └── app_web/
│
├── docker-compose.yml       # Main orchestration
├── .env.example             # Root env variables
├── .env                     # Local config (git-ignored)
├── .gitignore
├── .editorconfig
├── .vscode/
│   ├── settings.json        # Shared editor config
│   ├── extensions.json      # Recommended extensions
│   └── tasks.json           # VS Code tasks (optional)
├── .cursor/
│   ├── rules.md             # Cursor AI instructions
│   └── config.json          # Cursor configuration
├── .copilot/
│   └── instructions.md      # GitHub Copilot instructions
├── scripts/
│   └── sync-env-from-example.sh  # Setup script
├── CLAUDE.md                # Project guidelines (main reference)
├── GIT_FLOW.md              # Git branching workflow
├── DOCKER_COMPOSE_TEMPLATE.md   # Docker Compose setup guide
├── QUICK_START.md           # Quick start guide
├── README.md                # Project overview
└── PROJECT_SETUP_CHECKLIST.md   # This file
```

**Action:** Create directories for services you're using. Keep unused service directories (they won't break anything).

---

## ✅ Phase 3: Configuration Files

### Root `.env.example`
- [ ] Created with all infrastructure variables (DB, Redis, ports)
- [ ] Contains reasonable defaults for development
- [ ] **Does NOT contain real secrets or passwords**

### Service `.env.example` Files
- [ ] Each service has its own `.env.example` in its directory
- [ ] API keys, credentials are placeholders only (e.g., `dev-secret-key`)

### `.vscode/settings.json`
- [ ] Configured for all languages: TypeScript, Python, Ruby, Elixir
- [ ] Formatters set correctly (Prettier for TS/JS, Ruff for Python, Ruby LSP, etc.)
- [ ] Tailwind CSS intellisense enabled
- [ ] File exclusions configured (node_modules, .venv, __pycache__, etc.)

### `.vscode/extensions.json`
- [ ] Includes all recommended extensions for the stack
- [ ] Lists unwanted conflicting extensions in `unwantedRecommendations`

### `.cursor/rules.md`
- [ ] Comprehensive Cursor AI instructions
- [ ] Per-service guidelines
- [ ] Docker-first rules
- [ ] Token optimization tips

### `.copilot/instructions.md`
- [ ] GitHub Copilot-specific rules
- [ ] Common operations and command suggestions
- [ ] Anti-patterns to avoid

### `.editorconfig`
- [ ] 2-space indentation for all services
- [ ] UTF-8 charset, LF line endings
- [ ] Python: 4-space indentation
- [ ] Final newline enforcement

---

## ✅ Phase 4: Docker Setup

### `docker-compose.yml`
- [ ] Created at repo root
- [ ] Services defined: db (PostgreSQL), redis, and your backend/frontend services
- [ ] Environment variables passed from `.env`
- [ ] Health checks configured for db and redis
- [ ] Volumes for persistence (postgres_data, redis_data, bind mounts for live reload)
- [ ] Networks configured for service-to-service communication
- [ ] Dependencies configured (`depends_on` with `condition: service_healthy`)

### Dockerfile (per service)
- [ ] Node services: `node:22-alpine` base, npm ci, expose port
- [ ] Python services: `python:3.12-slim` base, pip install from requirements.txt
- [ ] Ruby services: `ruby:3.3-alpine` base, bundle install
- [ ] Elixir services: `elixir:1.16-alpine` base, mix deps.get

### Scripts
- [ ] `scripts/sync-env-from-example.sh` — Creates .env files from examples

**Action:** Use `DOCKER_COMPOSE_TEMPLATE.md` as reference when creating your docker-compose.yml.

---

## ✅ Phase 5: Documentation

### `CLAUDE.md` — Main Reference
- [ ] Updated with your actual service directories
- [ ] Updated commands match your docker-compose.yml service names
- [ ] All sections reviewed and customized

### `GIT_FLOW.md` — Git Workflow
- [ ] Read and understood by all team members
- [ ] Commit message format documented and enforced
- [ ] Branch naming conventions clear

### `QUICK_START.md` — Onboarding
- [ ] Reviewed and tested with a fresh clone
- [ ] Prerequisites correct for your OS (macOS/Linux/Windows)
- [ ] Troubleshooting section covers common issues

### `DOCKER_COMPOSE_TEMPLATE.md`
- [ ] Reference for setting up docker-compose.yml
- [ ] Dockerfile templates available for each language

### `README.md` (Project-Specific)
- [ ] Project overview and purpose
- [ ] Link to QUICK_START.md
- [ ] Link to CLAUDE.md for detailed guidelines
- [ ] Any special setup instructions for your project

---

## ✅ Phase 6: Service Setup (per service)

For each service you're using:

### All Services
- [ ] Created service directory (e.g., `backend-nestjs/`)
- [ ] Created `.env.example` with service-specific variables
- [ ] Git is initialized (inherit from repo root)
- [ ] `.gitignore` configured (specific to language/framework)

### Node Services (Next.js, React, NestJS)
- [ ] `package.json` created (npm init or framework create-app)
- [ ] `tsconfig.json` set to strict mode
- [ ] ESLint configured
- [ ] Prettier configured (2 spaces)
- [ ] `npm run dev` works (or `npm start`)
- [ ] `npm run test` works
- [ ] `npm run lint` works
- [ ] `npm run build` works
- [ ] `npm run typecheck` works (TypeScript)

### Python Services (FastAPI)
- [ ] `requirements.txt` created with pinned versions
- [ ] Virtual environment (local testing; Docker for shared dev)
- [ ] Ruff configured for linting
- [ ] MyPy configured for type checking
- [ ] Pytest configured for testing
- [ ] `app/main.py` created
- [ ] Database ORM configured (SQLAlchemy, Alembic)

### Ruby Services (Rails)
- [ ] `Gemfile` with essential gems (Rails, RSpec, RuboCop)
- [ ] Migrations created in `db/migrate/`
- [ ] RSpec installed and configured
- [ ] RuboCop configured
- [ ] `bin/rails` commands work
- [ ] Tests pass: `docker compose exec fullstack bin/rspec`
- [ ] Solid Cache configured (if using Rails fragment caching)

### Elixir Services (Phoenix)
- [ ] `mix.exs` with dependencies
- [ ] Phoenix installed and configured
- [ ] Database (Ecto) configured
- [ ] Migrations in `priv/repo/migrations/`
- [ ] Tests pass: `docker compose exec phoenix mix test`
- [ ] Credo configured for linting

---

## ✅ Phase 7: Git Configuration

### Local Git Setup
- [ ] Git initialized at repo root: `git init`
- [ ] Initial commit: `git add . && git commit -m "initial settings"`
- [ ] Remote added: `git remote add origin <url>`

### Branches
- [ ] Created `main` branch (production-ready)
- [ ] Created `develop` branch from `main` (feature integration)
- [ ] Set `main` and `develop` as protected branches (require PR reviews)

### Configuration
- [ ] Read `GIT_FLOW.md` (all team members)
- [ ] Commit hooks configured (optional but recommended for linting/tests pre-push)

---

## ✅ Phase 8: Editor Integration

### VS Code / Cursor
- [ ] Installed from `.vscode/extensions.json` recommendations
- [ ] Settings auto-loaded from `.vscode/settings.json`
- [ ] Tailwind CSS intellisense working
- [ ] Python analyzer (Pylance) enabled
- [ ] Format-on-save enabled and working

### Cursor-Specific
- [ ] `.cursor/rules.md` present and loaded
- [ ] `.cursor/config.json` reviewed
- [ ] Rules enforced in Cursor chats

---

## ✅ Phase 9: Local Development Verification

### Start Docker Services
```bash
docker compose up --build
```
- [ ] All services start without errors
- [ ] `docker compose ps` shows all running (healthy)
- [ ] Logs are clean (no persistent errors)

### Test Frontends
- [ ] Next.js dev server responds: `curl http://localhost:3000`
- [ ] React SPA responds: `curl http://localhost:5173`
- [ ] Expo runs on host: `cd expo-mobile && npm start`

### Test APIs
- [ ] NestJS responds: `curl http://localhost:3001/health`
- [ ] FastAPI OpenAPI: `curl http://localhost:8000/docs`
- [ ] Rails responds: `curl http://localhost:3000`
- [ ] Phoenix responds: `curl http://localhost:4000`

### Run Tests (All Services)
```bash
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test
```
- [ ] All tests pass (or expected failures documented)

### Run Linting (All Services)
```bash
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec api ruff check .
docker compose exec fullstack bin/rubocop
docker compose exec phoenix mix credo
```
- [ ] No linting errors
- [ ] Code style is consistent

---

## ✅ Phase 10: Team Onboarding

For each team member:

- [ ] Clone repository
- [ ] Read `QUICK_START.md`
- [ ] Run `./scripts/sync-env-from-example.sh`
- [ ] Run `docker compose up --build`
- [ ] Verify all services start and tests pass
- [ ] Read `CLAUDE.md` (main project guidelines)
- [ ] Read `GIT_FLOW.md` (branching and commits)
- [ ] Read `.cursor/rules.md` (if using Cursor)
- [ ] Read `.copilot/instructions.md` (if using Copilot)
- [ ] Create their first feature branch and open a PR

---

## ✅ Phase 11: CI/CD Preparation (Optional)

- [ ] GitHub Actions (or similar) configured for:
  - Running tests on all services
  - Linting checks
  - Type checking
  - Docker image builds (optional for production)
- [ ] Secrets configured in CI/CD system (never in git)
- [ ] Deployment pipeline defined (if applicable)

---

## ✅ Phase 12: Documentation & Handoff

- [ ] `README.md` complete (project overview, links to guides)
- [ ] Team members trained on Git Flow workflow
- [ ] CLAUDE.md reviewed and customized for your project
- [ ] Troubleshooting section in QUICK_START.md covers your specific setup
- [ ] Any service-specific README files created (if custom setup)

---

## 📋 Final Checklist

Run this before considering the project "ready":

- [ ] `docker compose up --build` starts all services without errors
- [ ] All tests pass: `docker compose exec <service> npm run test` / `pytest` / `rspec`
- [ ] All linting passes: `docker compose exec <service> npm run lint` / `ruff check .` / `rubocop`
- [ ] Frontends load in browser: http://localhost:3000, http://localhost:5173
- [ ] APIs respond to health checks: `curl http://localhost:3001/health`
- [ ] Expo starts on host: `cd expo-mobile && npm start`
- [ ] `.env` is git-ignored; `.env.example` is committed
- [ ] `CLAUDE.md`, `GIT_FLOW.md`, `QUICK_START.md` are complete and accurate
- [ ] Team members can clone, set up, and run locally (test with fresh clone)
- [ ] Git branches are configured: `main` and `develop` protected
- [ ] All `.vscode/`, `.cursor/`, `.copilot/` files are committed

---

## 🚀 You're Ready!

Once all boxes are checked, your project is set up to:
- ✅ Run all services in Docker (except Expo on host)
- ✅ Enforce consistent code style across multiple languages
- ✅ Follow Git Flow branching workflow
- ✅ Work smoothly with VS Code, Cursor, and Copilot
- ✅ Onboard new team members quickly
- ✅ Maintain token efficiency with AI assistants

---

**Questions?** Refer to:
- **Setup:** `QUICK_START.md`
- **Guidelines:** `CLAUDE.md`
- **Git:** `GIT_FLOW.md`
- **Cursor:** `.cursor/rules.md`
- **Copilot:** `.copilot/instructions.md`
- **Docker:** `DOCKER_COMPOSE_TEMPLATE.md`

Happy building! 🚀
