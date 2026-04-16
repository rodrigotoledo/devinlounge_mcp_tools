# Project README Templates

Comprehensive README templates for the root project and individual services.

---

## Root Project README

### `README.md` (Repository Root)

```markdown
# Project Name

Brief, compelling description of what this project does.

## Overview

2-3 paragraph overview explaining:
- What the project does
- Who it's for
- Why it's valuable
- Key features

## Technology Stack

### Frontend
- **Expo / React Native** - Mobile app (Expo Router, NativeWind)
- **Next.js** - Web frontend (App Router, Tailwind)
- **React SPA** - Alternative web frontend (Vite, TypeScript)

### Backend
- **NestJS** - Node.js/TypeScript API
- **FastAPI** - Python async API
- **Rails** - Ruby fullstack (Puma + Sidekiq)
- **Phoenix** - Elixir API

### Infrastructure
- **PostgreSQL** - Primary database
- **Redis** - Caching & real-time messaging
- **Docker Compose** - Local development orchestration

### Testing & Quality
- RSpec (Rails), Jest (JavaScript), Pytest (Python), ExUnit (Elixir)
- RuboCop, ESLint, Ruff, Credo (linting)
- SimpleCov, Istanbul (coverage)
- Brakeman, Snyk (security)

## Quick Start

### Prerequisites

- Docker & Docker Compose ([Install](https://docs.docker.com/get-docker/))
- Node.js 22+ & npm (for Expo; [Install](https://nodejs.org/))
- Git ([Install](https://git-scm.com/))

### Setup (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourorg/your-project.git
cd your-project

# 2. Create environment files
./scripts/sync-env-from-example.sh

# 3. Start services (Docker)
docker compose up --build

# 4. In another terminal, start Expo (host)
cd expo-mobile
npm install
npm start
```

**Services available at:**
- Next.js Frontend: http://localhost:3000
- React SPA: http://localhost:5173
- NestJS API: http://localhost:3001
- FastAPI: http://localhost:8000
- Rails: http://localhost:3000
- Phoenix: http://localhost:4000

See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

## Project Structure

```
├── expo-mobile/                  # React Native app (Expo, host-based)
├── web-nextjs/                   # Next.js 15 frontend (Docker)
├── web-react/                    # React SPA with Vite (Docker)
├── backend-nestjs/               # NestJS API (Docker)
├── backend-fastapi/              # FastAPI (Docker)
├── backend-rails/                # Rails fullstack (Docker)
├── backend-phoenix/              # Phoenix/Elixir API (Docker)
├── docker-compose.yml            # Services orchestration
├── .env.example                  # Environment variables template
├── scripts/                      # Utility scripts
└── docs/                         # Documentation (project-level)
```

## Running Services

### All Services (Docker)

```bash
# Start all services in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Individual Services (Docker)

```bash
# Run command in service
docker compose exec <service> <command>

# Examples:
docker compose exec nextjs npm run test
docker compose exec nestjs npm run start:dev
docker compose exec api pytest
docker compose exec fullstack bin/rspec

# One-shot command (service doesn't need to be running)
docker compose run --rm nestjs npm install <package>
```

### Expo Mobile (Host)

```bash
cd expo-mobile

# Install dependencies
npm install

# Start dev server
npm start

# Run tests
npm run test

# Type checking
npm run typecheck
```

## Development

### Making Changes

1. **Create feature branch:** `git checkout -b feature/short-description`
2. **Make changes** following code style guidelines
3. **Write tests** for new functionality
4. **Run tests & linting** (see below)
5. **Commit** with clear message: `backend-nestjs: add user validation`
6. **Push & open PR** to `develop`

### Running Tests

```bash
# Frontend
npm --prefix expo-mobile run test

# Backend services (Docker)
docker compose exec nextjs npm run test
docker compose exec nestjs npm run test
docker compose exec react npm run test
docker compose exec api pytest
docker compose exec fullstack bin/rspec
docker compose exec phoenix mix test
```

### Code Quality

```bash
# Linting (Docker)
docker compose exec nextjs npm run lint
docker compose exec nestjs npm run lint
docker compose exec api ruff check .
docker compose exec fullstack bin/rubocop
docker compose exec phoenix mix credo

# Type checking
npm --prefix expo-mobile run typecheck
docker compose exec nextjs npm run typecheck

# Security scanning
docker compose exec fullstack brakeman -q
docker compose exec fullstack bundle-audit check
```

## Git Workflow

This project uses **Git Flow** for version control:

- **`main`** - Production releases (always deployable)
- **`develop`** - Integration branch for features
- **`feature/*`** - Feature branches (from `develop`, PR back to `develop`)
- **`hotfix/*`** - Production fixes (from `main`, PR to both `main` & `develop`)
- **`release/*`** - Release preparation (from `develop`, final testing)

See [GIT_FLOW.md](./GIT_FLOW.md) for detailed instructions.

## Documentation

### Getting Started
- [Quick Start Guide](./QUICK_START.md) - Setup instructions
- [Docker Compose Guide](./DOCKER_COMPOSE_TEMPLATE.md) - Service orchestration

### Architecture & Design
- [CLAUDE.md](./CLAUDE.md) - Project guidelines & rules
- [Rails Setup Guide](./RAILS_SETUP_GUIDE.md) - Rails-specific configuration
- [React Native Setup](./REACT_NATIVE_SETUP.md) - Mobile development

### Development
- [Documentation Structure](./DOCUMENTATION_STRUCTURE.md) - How to document code
- [Hooks & Agents](./HOOKS_AND_AGENTS.md) - Automation & CI/CD
- [Git Flow Guide](./GIT_FLOW.md) - Branching & commits

### Configuration
- [VS Code Settings](./. vscode/settings.json) - Editor configuration
- [Cursor Rules](./. cursor/rules.md) - AI assistant rules
- [Copilot Instructions](./. copilot/instructions.md) - Copilot configuration

### Service Documentation

Each service has its own `docs/` directory:

- [Expo Documentation](./expo-mobile/docs/)
- [Next.js Documentation](./web-nextjs/docs/)
- [React Documentation](./web-react/docs/)
- [NestJS Documentation](./backend-nestjs/docs/)
- [FastAPI Documentation](./backend-fastapi/docs/)
- [Rails Documentation](./backend-rails/docs/)
- [Phoenix Documentation](./backend-phoenix/docs/)

## Common Tasks

### Install a Package

```bash
# Node services
docker compose exec nextjs npm install <package-name>
docker compose exec nestjs npm install <package-name>

# Python
docker compose exec api pip install <package-name>
docker compose exec api pip freeze > requirements.txt

# Ruby
docker compose exec fullstack bundle add gem-name

# Elixir
docker compose exec phoenix mix ecto.gen.migration migration_name
```

### Create Database Migration

```bash
# Rails
docker compose exec fullstack bin/rails generate migration AddFieldToUsers

# NestJS (TypeORM)
docker compose exec nestjs npm run migration:create

# FastAPI (Alembic)
docker compose exec api alembic revision --autogenerate -m "description"

# Phoenix (Ecto)
docker compose exec phoenix mix ecto.gen.migration create_table_name
```

### Debug in Docker

```bash
# Rails console
docker compose exec fullstack bin/rails console

# Python REPL
docker compose exec api python

# NestJS REPL
docker compose exec nestjs node

# Phoenix console
docker compose exec phoenix iex -S mix

# Bash shell
docker compose exec <service> bash  # or: sh
```

## Troubleshooting

### Services Won't Start

```bash
# Check service logs
docker compose logs <service>

# Rebuild without cache
docker compose build --no-cache <service>

# Remove all volumes and restart
docker compose down -v
docker compose up --build
```

### Port Already in Use

Edit `.env`:
```
NEXTJS_PORT=3001    # Change from 3000 to 3001
RAILS_PORT=3002     # If using multiple services
```

Then restart: `docker compose up -d --build`

### Tests Failing

```bash
# Clear test caches
docker compose exec fullstack rm -rf tmp/cache

# Reset test database
docker compose exec fullstack bin/rails db:test:prepare

# Rerun tests
docker compose exec fullstack bin/rspec --format progress
```

See [QUICK_START.md](./QUICK_START.md#troubleshooting) for more troubleshooting.

## Deployment

### Staging

Automated via GitHub Actions on `develop` push:

```bash
git push origin feature/my-feature  # Triggers CI
# → Tests run → Deploy to staging if passing
```

### Production

Manual release process:

```bash
# 1. Create release branch
git checkout -b release/v1.2.3

# 2. Update version numbers everywhere
# → package.json, requirements.txt, mix.exs, etc.

# 3. Commit & push
git push origin release/v1.2.3

# 4. Open PR to main
# → After merge: tag release & deploy
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for details.

## Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for project guidelines
2. Follow [Git Flow](./GIT_FLOW.md) for branching
3. Write tests for new functionality
4. Run linting & tests before pushing
5. Use clear commit messages (present tense, lowercase)
6. Link related issues in PR description

## Code of Conduct

We are committed to a welcoming and inclusive environment for all contributors.

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

## Support & Communication

- **Issues:** Report bugs in [GitHub Issues](https://github.com/yourorg/project/issues)
- **Questions:** Ask in [Discussions](https://github.com/yourorg/project/discussions)
- **Chat:** Join us on [Slack](link)

## Team

- **Engineering Lead:** @name
- **Frontend Lead:** @name
- **Backend Lead:** @name

## Resources

- **Documentation:** See `docs/` directories in each service
- **Dashboard:** [Link to monitoring/analytics]
- **Architecture Diagrams:** [Link to diagrams]
- **API Documentation:** [OpenAPI/Swagger link]

---

**Last Updated:** 2026-04-16  
**Version:** 1.0.0  
**Status:** Active Development
```

---

## Individual Service README

### Service-Level `README.md` Example (NestJS)

```markdown
# Backend API — NestJS

Node.js/TypeScript backend API using NestJS framework.

## Overview

This service provides the REST API for the application, handling:
- User authentication & authorization
- Data management (CRUD operations)
- Business logic
- Integration with external services

## Technology Stack

- **Framework:** NestJS 10
- **Language:** TypeScript 5
- **Database:** PostgreSQL 16
- **ORM:** TypeORM or Prisma
- **Testing:** Jest
- **Linting:** ESLint
- **Runtime:** Node.js 22

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local development)

### Setup

```bash
# From repo root (where docker-compose.yml lives)

# Install dependencies
docker compose exec nestjs npm install

# Run database migrations
docker compose exec nestjs npm run migration:run

# Start development server
docker compose exec nestjs npm run start:dev

# Run tests
docker compose exec nestjs npm run test
```

Service runs on `http://localhost:3001`

## Directory Structure

```
src/
├── main.ts                      # Entry point
├── app.module.ts                # Root module
├── common/                      # Shared utilities, decorators, middleware
│   ├── decorators/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   └── pipes/
├── modules/                     # Feature modules (organized by domain)
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── repositories/
│   │   └── __tests__/
│   ├── authentication/
│   ├── products/
│   └── [feature-module]/
├── database/
│   ├── entities/               # TypeORM entities
│   ├── migrations/             # Database migrations
│   └── seeders/                # Data seeders
└── config/                      # Configuration files
    ├── database.config.ts
    ├── jwt.config.ts
    └── [service].config.ts
```

## API Documentation

### OpenAPI / Swagger

Automatically generated from code:

```
http://localhost:3001/api/docs
```

### Key Endpoints

**Users:**
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

**Authentication:**
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token

See `/docs` for complete API reference.

## Development

### Running Tests

```bash
# All tests
docker compose exec nestjs npm run test

# Specific test file
docker compose exec nestjs npm run test -- users.service.spec.ts

# Watch mode
docker compose exec nestjs npm run test:watch

# Coverage
docker compose exec nestjs npm run test:cov
```

### Database Migrations

```bash
# Create migration
docker compose exec nestjs npm run migration:create -- CreateUsersTable

# Run pending migrations
docker compose exec nestjs npm run migration:run

# Revert last migration
docker compose exec nestjs npm run migration:revert

# Generate from entity changes
docker compose exec nestjs npm run migration:generate -- ChangeUsers
```

### Code Quality

```bash
# Linting
docker compose exec nestjs npm run lint

# Auto-fix linting issues
docker compose exec nestjs npm run lint:fix

# Type checking
docker compose exec nestjs npm run typecheck
```

### Creating a New Feature

1. Generate module: `docker compose exec nestjs nest generate module features/user-profile`
2. Generate controller: `docker compose exec nestjs nest generate controller features/user-profile`
3. Generate service: `docker compose exec nestjs nest generate service features/user-profile`
4. Implement logic in service
5. Wire up endpoints in controller
6. Write tests (co-located: `*.spec.ts`)
7. Test manually: `curl http://localhost:3001/user-profile`

## Architecture Decisions

See [docs/DECISIONS.md](./docs/DECISIONS.md) for architecture decision records.

### Key Patterns

**Dependency Injection:** Use NestJS DI for all dependencies. No singletons.

**Module Organization:** One module per domain (users, products, orders, etc.)

**Error Handling:** Custom exceptions with proper HTTP status codes.

**Validation:** Class-validator for request DTOs.

**Authentication:** JWT tokens in Authorization header.

## Deployment

### Development

```bash
docker compose up --build
```

### Production

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

```bash
# Build image
docker build -t backend-nestjs:latest .

# Push to registry
docker push <registry>/backend-nestjs:latest

# Deploy (varies by platform)
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow
- [Testing Strategy](./docs/TESTING.md) - How we test
- [API Reference](./docs/API.md) - Detailed endpoint docs
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues
- [Refactoring Ideas](./docs/REFACTORING_IDEAS.md) - Future improvements

## Troubleshooting

### Port 3001 already in use

Change in `.env`: `NESTJS_PORT=3002`

### Database connection refused

Check PostgreSQL is running: `docker compose ps db`

### Tests failing

```bash
docker compose exec nestjs npm run test:reset
docker compose exec nestjs npm run test
```

## Support

- **Issues:** Report in [GitHub Issues](link)
- **Questions:** Ask in [Slack](link)
- **API Docs:** http://localhost:3001/api/docs (when running)

## Contributing

See [/CLAUDE.md](../../CLAUDE.md) for project guidelines.

---

**Status:** Production  
**Last Updated:** 2026-04-16  
**Maintainers:** @backend-team
```

---

## Key Rules for All READMEs

✅ **DO:**
- Write in English
- Use complete words (no abbreviations)
- Include code examples
- Provide links to related documentation
- Keep sections concise but complete
- Update when code changes
- Include prerequisites clearly

❌ **DON'T:**
- Use abbreviations (cat, config → category, configuration)
- Make assumptions about reader knowledge
- Write extremely long sections
- Include outdated information
- Mix languages
- Use "etc." without specifics

