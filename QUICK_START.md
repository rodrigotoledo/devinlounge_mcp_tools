# Quick Start Guide

Get the project running locally in minutes.

---

## Prerequisites

- **Docker & Docker Compose** (https://docs.docker.com/get-docker/)
- **Node.js 22+ & npm** (for Expo; https://nodejs.org/)
- **Git** (https://git-scm.com/)
- **Terminal/CLI** (bash, zsh, or equivalent)

---

## 1️⃣ Clone & Setup

```bash
# Clone repository
git clone <repo-url> && cd <repo-name>

# Create environment files from examples
./scripts/sync-env-from-example.sh

# Review and update .env with your local config (optional for dev)
# .env defaults work fine for local development
```

---

## 2️⃣ Start Infrastructure & Services

```bash
# From repo root, build and start all services
docker compose up --build

# Or start detached (run in background)
docker compose up -d --build

# Check status
docker compose ps
```

**Services will be available at:**
- **Next.js frontend:** http://localhost:3000
- **React SPA:** http://localhost:5173
- **NestJS API:** http://localhost:3001
- **FastAPI:** http://localhost:8000
- **Rails:** http://localhost:3000 (change port if Next.js also running)
- **Phoenix:** http://localhost:4000
- **PostgreSQL:** localhost:5432 (inside Docker; use `db` from containers)
- **Redis:** localhost:6379 (inside Docker; use `redis` from containers)

---

## 3️⃣ Initialize Databases

```bash
# Run migrations for Rails
docker compose exec fullstack bin/rails db:migrate

# Seed data (if seed file exists)
docker compose exec fullstack bin/rails db:seed

# Phoenix migrations
docker compose exec phoenix mix ecto.migrate

# NestJS migrations (if TypeORM is set up)
docker compose exec nestjs npm run migration:run

# FastAPI migrations (if Alembic is set up)
docker compose exec api alembic upgrade head
```

---

## 4️⃣ Start Expo (React Native) on Host

```bash
# In a new terminal (separate from docker compose)
cd expo-mobile

# Install dependencies
npm install

# Start dev server
npm start
# or: npx expo start

# Open in emulator/simulator or scan QR code with Expo app on phone
```

---

## 5️⃣ Verify Everything Works

```bash
# Run tests in all services
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test

# Run linting
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec api ruff check .
docker compose exec fullstack bin/rubocop
docker compose exec phoenix mix credo
```

---

## 🔗 Common Tasks

### View Logs

```bash
# Tail logs for specific service
docker compose logs -f nestjs      # NestJS
docker compose logs -f api         # FastAPI
docker compose logs -f fullstack   # Rails
docker compose logs -f nextjs      # Next.js

# View all logs
docker compose logs -f
```

### Run Commands in Containers

```bash
# Rails console
docker compose exec fullstack bin/rails console

# Python REPL (FastAPI)
docker compose exec api python

# NestJS TypeScript REPL
docker compose exec nestjs node

# Phoenix console
docker compose exec phoenix iex -S mix

# Bash shell in service
docker compose exec nestjs bash
docker compose exec api sh
```

### Restart Services

```bash
# Restart specific service
docker compose restart nestjs

# Restart all
docker compose restart

# Stop all
docker compose down

# Start again
docker compose up -d
```

### Install Dependencies

```bash
# Node services
docker compose exec nextjs npm install <package>
docker compose exec nestjs npm install <package>

# Python
docker compose exec api pip install <package>
docker compose exec api pip freeze > backend-fastapi/requirements.txt

# Ruby
docker compose exec fullstack bundle add <gem>

# Elixir
docker compose exec phoenix mix ecto.gen.migration migration_name
```

### Create Database Migrations

```bash
# Rails
docker compose exec fullstack bin/rails generate migration AddFieldToUsers

# NestJS (TypeORM)
docker compose exec nestjs npm run migration:generate src/database/migrations/CreateUserTable

# FastAPI (Alembic)
docker compose exec api alembic revision --autogenerate -m "Add user table"

# Phoenix (Ecto)
docker compose exec phoenix mix ecto.gen.migration create_users
```

---

## 🐛 Troubleshooting

### Port Already in Use

If you get "Bind for 0.0.0.0:3000 failed":

1. Check `.env` for `NEXTJS_PORT`, `RAILS_PORT`, etc.
2. Change to a different port: `NEXTJS_PORT=3001 docker compose up --build`
3. Or kill the process on that port (macOS): `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Docker Compose Won't Start

```bash
# Clean up volumes and containers
docker compose down -v

# Rebuild all images
docker compose build --no-cache

# Start fresh
docker compose up --build
```

### Database Connection Error

```bash
# Check if PostgreSQL is healthy
docker compose ps db

# If unhealthy, check logs
docker compose logs db

# Reset database
docker compose down -v      # Remove all volumes
docker compose up --build   # Start fresh
```

### Can't Connect to Services

- From **host:** Use `localhost:<PORT>` (e.g., `localhost:3001` for NestJS)
- From **inside container:** Use service name (e.g., `nestjs:3000`)

### Changes Not Reflecting

```bash
# Rebuild services (if code changes)
docker compose build --no-cache <service>

# Restart service
docker compose restart <service>

# Full reset
docker compose down && docker compose up --build
```

---

## 📚 Next Steps

1. Read **`CLAUDE.md`** for detailed project structure and rules
2. Read **`GIT_FLOW.md`** for branching strategy
3. Read **`.cursor/rules.md`** for AI assistant configuration
4. Check individual service README files (if they exist)
5. See `.env.example` for all available configuration options

---

## 🎯 Common Dev Workflows

### Start Working on a Feature

```bash
# Start services
docker compose up -d --build

# Create feature branch
git checkout develop && git pull origin develop
git checkout -b feature/my-feature

# Make changes, test them
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec

# Commit and push
git add .
git commit -m "backend-nestjs: add new validation"
git push -u origin feature/my-feature

# Open PR to `develop`
```

### Deploy / Release

```bash
# Create release branch
git checkout -b release/v1.2.3
# Update version numbers in all service files
docker compose exec fullstack bin/rails db:migrate
# Final testing
docker compose down

# Merge to main, tag, and push
git checkout main && git merge --no-ff release/v1.2.3
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin main v1.2.3

# Merge back to develop
git checkout develop && git merge --no-ff release/v1.2.3
git push origin develop
```

---

## ✅ Checklist

- [ ] Docker & Docker Compose installed
- [ ] Node.js 22+ installed
- [ ] Cloned repository
- [ ] Ran `./scripts/sync-env-from-example.sh`
- [ ] Started `docker compose up --build`
- [ ] Verified services are healthy: `docker compose ps`
- [ ] Ran database migrations (Rails, NestJS, Phoenix, FastAPI)
- [ ] Verified tests pass: `docker compose exec <service> npm run test`
- [ ] Started Expo on host: `cd expo-mobile && npm start`
- [ ] Read `CLAUDE.md`, `GIT_FLOW.md`, `.cursor/rules.md`

---

## 📞 Support

- Docker Compose issues: https://docs.docker.com/compose/troubleshooting/
- Service-specific docs: See `README.md` in each service directory
- Project guidelines: See `CLAUDE.md`
- Git workflow: See `GIT_FLOW.md`

---

**Happy coding! 🚀**
