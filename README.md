# Default Settings - Project Template

A comprehensive reference and template for modern multi-stack projects featuring:
- **Backend Frameworks**: NestJS, Rails, FastAPI, Phoenix (Elixir)
- **Frontend Frameworks**: Next.js, React, React Native (Expo)
- **Infrastructure**: PostgreSQL, Redis, Docker Compose
- **Developer Tools**: Git Hooks, Pre-commit Checks, GitHub Actions CI/CD

This is a template directory with best practices, configuration examples, and automated workflows for full-stack development.

---

## 📂 Directory Structure

```text
default_settings/
├── docker-compose.yml           # Master orchestration (all services)
├── .env.example                 # Environment variables template
├── backend-{framework}/         # Backend service directory
│   ├── Dockerfile               # Service container image
│   ├── .env.example             # Service-specific variables
│   └── ...
├── frontend-{framework}/        # Frontend service directory
├── mobile/                      # Mobile app directory
├── scripts/                     # Automation scripts
├── .husky/                      # Git hooks
└── .github/workflows/           # CI/CD pipelines
```

---

## 🚀 Quick Start

### Prerequisites

**Option A: Without Docker**
- Node.js 22 (for frontend/NestJS)
- Python 3.12 (for FastAPI)
- Ruby 3.3 (for Rails)
- Elixir 1.16 (for Phoenix)
- PostgreSQL & Redis locally installed

**Option B: With Docker (Recommended)**
- Docker Engine 24+
- Docker Compose v2 (`docker compose` command, no hyphen)

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Clone and setup environment
git clone <repo>
cd default_settings
cp .env.example .env
cp backend-{framework}/.env.example backend-{framework}/.env

# 2. Start all services
docker compose up --build

# 3. Services are available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001 (or 8000 for FastAPI)
# - Database: localhost:5432
# - Redis: localhost:6379
```

### Option 2: Local Development (No Docker)

```bash
# Backend (NestJS example)
cd backend-nestjs
npm install
npm run dev

# Frontend (Next.js example)
cd frontend-nextjs
npm install
npm run dev

# Mobile (Expo example)
cd mobile
npm install
npm start
```

---

## 📦 Services Available

### Infrastructure
- **PostgreSQL 16**: Database (port 5432)
- **Redis 7**: Cache & queues (port 6379)

### Backend Options

#### NestJS (TypeScript/Node.js)
```bash
docker compose exec nestjs npm run dev        # Start dev server
docker compose exec nestjs npm run test       # Run tests
docker compose exec nestjs npm run lint       # Check code quality
```

#### Rails (Ruby)
```bash
docker compose exec fullstack bin/rails db:migrate     # Run migrations
docker compose exec fullstack bin/rspec               # Run tests
docker compose exec fullstack bin/rubocop -A          # Fix linting
```

#### FastAPI (Python)
```bash
docker compose exec api uvicorn app.main:app --reload  # Start dev server
docker compose exec api pytest                         # Run tests
docker compose exec api ruff check --fix .             # Check code
```

#### Phoenix (Elixir)
```bash
docker compose exec phoenix iex -S mix phx.server      # Start server
docker compose exec phoenix mix test                   # Run tests
docker compose exec phoenix mix format                 # Format code
```

### Frontend Options

#### Next.js (TypeScript)
```bash
docker compose exec nextjs npm run dev         # Start dev server
docker compose exec nextjs npm run test        # Run tests
docker compose exec nextjs npm run lint        # Check code
```

#### React (Vite)
```bash
docker compose exec react npm run dev          # Start dev server
docker compose exec react npm run test         # Run tests
docker compose exec react npm run lint         # Check code
```

#### React Native (Expo)
```bash
cd mobile
npm start                                      # Start Expo dev server
npm run android                                # Run on Android emulator
npm run ios                                    # Run on iOS simulator
```

---

## 🐳 Docker Compose Commands

All Docker Compose commands use **v2** format (`docker compose`, not `docker-compose`):

```bash
# Start all services
docker compose up                 # Foreground (see logs)
docker compose up -d              # Background (detached)
docker compose up --build         # Rebuild images first

# Stop services
docker compose down                # Stop and remove containers
docker compose down -v             # Also remove volumes (data loss!)

# View logs
docker compose logs -f                    # All services
docker compose logs -f nestjs             # Specific service
docker compose logs -f --tail=50 api      # Last 50 lines

# Execute commands
docker compose exec nestjs npm run test   # Run in existing container
docker compose run --rm api pytest        # Run one-shot command

# Database operations
docker compose exec fullstack bin/rails db:migrate
docker compose exec api alembic upgrade head

# Rebuild specific service
docker compose build nestjs
docker compose up --build nextjs
```

**Key Differences from v1**:
- `docker compose` (no hyphen) - v2
- `docker-compose` (with hyphen) - v1 (deprecated)

---

## 🔧 Configuration

### Environment Variables

**Global** (`.env` in project root):
```env
NODE_ENV=development
POSTGRES_USER=app_user
POSTGRES_PASSWORD=dev_password
POSTGRES_DATABASE=app_db
REDIS_PUBLISH_PORT=6379
NESTJS_PORT=3001
RAILS_PORT=3000
NEXTJS_PORT=3000
```

**Per-Service** (`.env` in service directory):
```env
# backend-nestjs/.env
NESTJS_JWT_SECRET=dev-secret-key
NESTJS_DATABASE_HOST=db
NESTJS_REDIS_URL=redis://redis:6379/0

# backend-rails/.env
RAILS_ENV=development
REDIS_URL=redis://redis:6379/1

# frontend-nextjs/.env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🪝 Git Hooks & Automation

Pre-commit and pre-push hooks ensure code quality:

```bash
# Install hooks (from project root)
npm install husky --save-dev
npx husky install
npm install lint-staged --save-dev
```

**Pre-commit hooks will**:
- Run linters (ESLint, RuboCop, Ruff, etc.)
- Run tests (Jest, RSpec, Pytest, ExUnit)
- Format code (Prettier, Black, Rubocop -A)

**Pre-push hooks will**:
- Prevent pushes to main/develop (use feature branches)
- Run type checks (TypeScript, MyPy)
- Run backend tests

See `HOOKS_AND_AGENTS.md` for detailed configuration.

---

## 📋 Common Tasks

### Database

```bash
# Create database
docker compose exec fullstack bin/rails db:create
docker compose exec api alembic upgrade head

# Run migrations
docker compose exec fullstack bin/rails db:migrate
docker compose run --rm api alembic upgrade head

# Seed data
docker compose exec fullstack bin/rails db:seed

# Reset database
docker compose exec fullstack bin/rails db:reset
```

### Testing

```bash
# All services
docker compose exec nestjs npm run test
docker compose exec fullstack bin/rspec
docker compose exec api pytest
docker compose exec phoenix mix test

# With coverage
docker compose exec fullstack bin/rspec --coverage
docker compose exec api pytest --cov
docker compose exec phoenix mix test --cover
```

### Linting & Formatting

```bash
# Check
docker compose exec nestjs npm run lint
docker compose exec fullstack bin/rubocop
docker compose exec api ruff check .
docker compose exec phoenix mix format --check-formatted

# Fix
docker compose exec nestjs npm run lint -- --fix
docker compose exec fullstack bin/rubocop -A
docker compose exec api ruff check --fix .
docker compose exec phoenix mix format
```

### Dependency Management

```bash
# Node services
docker compose exec nestjs npm install <package>
docker compose exec nextjs npm update

# Python
docker compose exec api pip install <package>
docker compose exec api pip install -r requirements.txt

# Ruby
docker compose exec fullstack bundle add <gem>
docker compose exec fullstack bundle update

# Elixir
docker compose exec phoenix mix deps.get
docker compose exec phoenix mix deps.update <package>
```

---

## 🔒 Security Checklist

- [ ] `.env` is in `.gitignore` (never commit secrets)
- [ ] `.env.example` has placeholder values only
- [ ] Secrets are environment variables
- [ ] Pre-commit hooks check for accidental secret commits
- [ ] Database passwords are strong in production
- [ ] No API keys in repository

---

## 🛠 Troubleshooting

### Containers won't start
```bash
# Check logs
docker compose logs -f

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

### Port conflicts
```bash
# Check what's using a port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
NEXTJS_PORT=3001  # Use different port
```

### Database connection issues
```bash
# Wait for database to be ready
docker compose up -d db redis
sleep 5
docker compose up
```

### Out of disk space
```bash
# Remove old images and volumes
docker compose down -v
docker system prune -a
docker volume prune
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| HOOKS_AND_AGENTS.md | Git hooks, pre-commit checks, agents |
| DOCKER_COMPOSE_TEMPLATE.md | Complete docker-compose.yml example |
| GIT_FLOW.md | Git workflow and branching strategy |
| PROJECT_SETUP_CHECKLIST.md | Full setup verification checklist |
| IMPLEMENTATION_CHECKLIST.md | Feature implementation tasks |
| TOKEN_OPTIMIZATION.md | Token efficiency tips |
| DOCUMENTATION_REVIEW_AND_FIXES.md | Issues and fixes (this review) |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `docker compose up`
3. Run tests before committing (hooks will enforce)
4. Push to feature branch and create a pull request to `develop`

See `GIT_FLOW.md` for detailed branching strategy.

---

## 📞 Support

For issues or questions:
1. Check the relevant documentation file
2. Review Docker logs: `docker compose logs -f <service>`
3. Verify `.env` configuration
4. Search existing issues/discussions

---

## 📄 License

This template is provided as-is for reference and educational purposes.

---

**Last Updated**: April 2026

**Docker Compose Version**: v2 (recommended)

**Node Version**: 22

**Python Version**: 3.12

**Ruby Version**: 3.3

**Elixir Version**: 1.16
