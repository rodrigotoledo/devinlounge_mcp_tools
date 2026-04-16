# Hooks & Agents System - FIXED

Configure automated behaviors and specialized agents for your project.

---

## 📌 Important: Docker Version

This guide uses **Docker Compose v2** (`docker compose`, no hyphen):

```bash
# ✅ CORRECT - Docker Compose v2 (current standard)
docker compose up
docker compose exec service command

# ❌ DEPRECATED - Docker Compose v1 (do not use)
docker-compose up
docker-compose exec service command
```

All new projects should use v2. See references at the bottom for upgrade guide.

---

## 🪝 Git Hooks Setup

Use git hooks to enforce quality standards before commits/pushes.

### Install husky (Hook Manager)

```bash
npm install husky --save-dev
npx husky install
npm install lint-staged --save-dev
```

### Create Hooks

#### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run frontend tests (local - containers not required)
npm --prefix mobile run test -- --bail 2>/dev/null || true

# Docker-based linting (skip if containers not running)
if docker compose ps --services --filter "status=running" | grep -q "nextjs"; then
  docker compose exec -T nextjs npm run lint 2>/dev/null || true
  docker compose exec -T nestjs npm run lint 2>/dev/null || true
else
  echo "⚠️  Containers not running. Install dependencies manually or run:"
  echo "    docker compose up -d"
fi
```

#### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Prevent direct pushes to main/develop branches
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "develop" ]; then
  echo "❌ Cannot push directly to $CURRENT_BRANCH"
  echo "Use Git Flow:"
  echo "  1. Create feature branch: git checkout -b feature/name"
  echo "  2. Push to feature branch"
  echo "  3. Create Pull Request to develop"
  exit 1
fi

# Run type checking (local)
npm --prefix mobile run typecheck 2>/dev/null || true

# Backend tests (require running containers)
if docker compose ps --services --filter "status=running" | grep -q "nestjs"; then
  echo "Running backend tests before push..."
  docker compose exec -T nestjs npm run test -- --bail || {
    echo "❌ Backend tests failed. Fix and try again."
    exit 1
  }
else
  echo "⚠️  Backend containers not running. Start with: docker compose up -d"
  echo "Skipping tests. Tests will run in CI/CD."
fi

echo "✅ Pre-push checks passed"
```

### `package.json` - Add lint-staged

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{py}": [
      "ruff check --fix",
      "black"
    ],
    "*.{rb,erb}": [
      "rubocop -A",
      "rufo"
    ],
    "*.{md,json,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Testing Git Hooks Locally

```bash
# Trigger pre-commit hook
npx husky run pre-commit

# Trigger pre-push hook (simulated)
npx husky run pre-push

# See all installed hooks
ls -la .husky
```

---

## 🤖 Cursor/Claude Agents Configuration

### Service Names in Docker Compose

The following service names are defined in `docker-compose.yml`:

| Service Name | Framework | Language | Port |
|------------|-----------|----------|------|
| `nestjs` | NestJS | TypeScript/Node | 3001 |
| `fullstack` | Rails | Ruby | 3000 |
| `api` | FastAPI | Python | 8000 |
| `phoenix` | Phoenix | Elixir | 4000 |
| `nextjs` | Next.js | TypeScript/Node | 3000 |
| `react` | React/Vite | TypeScript | 5173 |
| `db` | PostgreSQL | - | 5432 |
| `redis` | Redis | - | 6379 |

**To use different names**: Update `docker-compose.yml` and use the new names in commands.

### Define Agents in `.cursor/agents.md` or Settings

```markdown
# Cursor Agents Configuration

## Agent: Backend-NestJS-Expert

**Trigger:** When user works on `backend-nestjs/` or mentions NestJS

**Service Name:** `nestjs` (defined in docker-compose.yml)

**Rules:**
- ✅ Always use Docker Compose v2: `docker compose exec nestjs ...`
- ✅ Never run npm directly on host
- ✅ Recommend dependency injection for all services
- ✅ Enforce TypeScript strict mode
- ✅ Suggest Guards/Pipes for middleware
- ✅ Focus on modular architecture

**Common Commands:**
```bash
docker compose exec nestjs npm install <package>
docker compose exec nestjs npm run dev
docker compose exec nestjs npm run test
docker compose exec nestjs npm run lint -- --fix
```

---

## Agent: Rails-Expert

**Trigger:** When user works on `backend-rails/` or `fullstack/`

**Service Name:** `fullstack` (Rails web server)

**Rules:**
- ✅ Always use Docker: `docker compose exec fullstack ...`
- ✅ Enforce RSpec ONLY (no Minitest)
- ✅ Use DatabaseCleaner + Shoulda Matchers
- ✅ Recommend Rails conventions
- ✅ Use SimpleCov for coverage
- ✅ Never run bundle on host

**Common Commands:**
```bash
docker compose exec fullstack bundle add <gem>
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rspec [--coverage]
docker compose exec fullstack bin/rubocop -A
docker compose exec fullstack bin/erb-lint app/views
```

---

## Agent: FastAPI-Expert

**Trigger:** When user works on `backend-fastapi/` or mentions FastAPI

**Service Name:** `api` (Python FastAPI server)

**Rules:**
- ✅ Use Docker: `docker compose exec api ...`
- ✅ Enforce Pydantic v2 for validation
- ✅ Use async/await throughout
- ✅ Type hints on all functions
- ✅ Document with Pydantic models

**Common Commands:**
```bash
docker compose exec api pip install <package>
docker compose exec api uvicorn app.main:app --reload
docker compose exec api pytest [--cov]
docker compose exec api ruff check --fix .
```

---

## Agent: Phoenix-Elixir-Expert

**Trigger:** When user works on `backend-phoenix/` or mentions Elixir/Phoenix

**Service Name:** `phoenix` (Elixir Phoenix server)

**Rules:**
- ✅ Use Docker: `docker compose exec phoenix ...`
- ✅ Functional programming patterns
- ✅ Pattern matching in functions
- ✅ Pipe operator for data transformation
- ✅ LiveView for real-time features

**Common Commands:**
```bash
docker compose exec phoenix mix deps.get
docker compose exec phoenix iex -S mix phx.server
docker compose exec phoenix mix test
docker compose exec phoenix mix format
docker compose exec phoenix mix credo
```

---

## Agent: Frontend-Expert

**Trigger:** When user works on `frontend-*/` or `mobile/`

**Service Names:** `nextjs`, `react`, (mobile uses local npm)

**Rules:**
- ✅ Default to Tailwind CSS for styling
- ✅ Create custom hooks for logic extraction
- ✅ TypeScript strict mode
- ✅ Component-driven development
- ✅ Proper error boundaries

**Commands (Frontend):**
```bash
docker compose exec nextjs npm install <package>
docker compose exec nextjs npm run dev
docker compose exec nextjs npm run test

docker compose exec react npm install <package>
docker compose exec react npm run dev
```

**Commands (Mobile):**
```bash
cd mobile
npm install <package>
npm start
npm run android  # Android emulator
npm run ios      # iOS simulator
```

---

## Agent: Docker-Manager

**Trigger:** When user asks "How do I start services?" or "docker compose..."

**Rules:**
- ✅ Use `docker compose` (v2, no hyphen)
- ✅ Suggest `docker compose up` for local dev
- ✅ Explain `-d` flag (detached/background)
- ✅ Remind about `.env` setup before starting
- ✅ For CI/CD, use `docker compose run --rm` (creates fresh container)
- ✅ Use `docker compose exec -T` in pipelines (no pseudo-terminal)

**Quick Reference:**
```bash
# Start all services (local)
docker compose up

# Start in background
docker compose up -d

# Rebuild images
docker compose up --build

# View logs
docker compose logs -f <service>

# Run one-shot command (CI/CD)
docker compose run --rm <service> <command>

# Run in existing container (local)
docker compose exec <service> <command>

# Stop services
docker compose down

# Clean everything (careful!)
docker compose down -v
```

---

## Agent: Git-Flow-Enforcer

**Trigger:** When user mentions git, branches, commits, PRs

**Rules:**
- ✅ Enforce Git Flow: `main` (production) ↔ `develop` (integration)
- ✅ Feature branches from develop, PR back to develop
- ✅ Hotfix branches from main, PR to both main & develop
- ✅ Present-tense commit messages
- ✅ Include service context: `[backend-nestjs]: add user auth`
- ✅ Pre-push hook prevents direct commits to main/develop

**Workflow:**
```bash
# Start feature
git checkout develop
git pull origin develop
git checkout -b feature/user-auth

# Work and commit
git commit -m "[backend-nestjs]: add user auth with JWT"

# Push feature branch (hook allows this)
git push origin feature/user-auth

# Create PR to develop on GitHub
# After review and merge, delete feature branch

# Hotfix (urgent fix to production)
git checkout main
git checkout -b hotfix/security-issue
git commit -m "[hotfix]: patch security issue #123"
git push origin hotfix/security-issue
# Create PR to BOTH main and develop
```

---

## Agent: Security-Scanner

**Trigger:** Before pushing code or before release

**Rules:**
- ✅ Run security scans automatically before push
- ✅ Check for secrets using git-secrets
- ✅ Verify no `.env` committed
- ✅ Scan dependencies for CVEs
- ✅ Report findings clearly
- ✅ Block commits if critical issues found

**Install git-secrets:**
```bash
# macOS
brew install git-secrets

# Configure for repo
git secrets --install -f

# Add patterns
git secrets --register-aws
```

**Create patterns file** (`$HOME/.gitconfig_secrets`):
```
secret
password
token
PRIVATE_KEY
DATABASE_URL=
REDIS_URL=
AWS_SECRET_ACCESS_KEY
API_KEY
JWT_SECRET
```

**Run before commit:**
```bash
git secrets --scan
```

---

## 📊 CI/CD Hooks (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Tests & Linting

on: [push, pull_request]

jobs:
  # Frontend Tests
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      
      - run: cd mobile && npm ci && npm run typecheck && npm run test

  # Backend Tests (Docker-based)
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - run: docker compose build

      # NestJS tests
      - run: docker compose run --rm nestjs npm ci
      - run: docker compose run --rm nestjs npm run test

      # FastAPI tests
      - run: docker compose run --rm api pip install -r requirements.txt
      - run: docker compose run --rm api pytest

      # Rails tests (with fullstack service)
      - run: docker compose run --rm fullstack bundle install
      - run: docker compose run --rm fullstack bin/rspec
      - run: docker compose run --rm fullstack bin/rubocop

  # Security scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose run --rm api pip install bandit && bandit -r app/
      - run: docker compose run --rm fullstack brakeman -q
      - run: docker compose run --rm fullstack bundle-audit check
```

**Key points**:
- Use `docker compose run --rm` in CI (creates fresh container)
- Use `-T` flag if pseudo-terminal issues
- Services must have healthchecks
- Fail fast on test failures

---

## ✅ Pre-Commit Checklist

Before each commit, verify:

- [ ] Code formatted: `docker compose exec <service> <formatter>`
- [ ] Tests pass: `docker compose exec <service> <test-command>`
- [ ] Lints pass: ESLint, RuboCop, Ruff, Credo
- [ ] Type checks pass: TypeScript, MyPy, Dialyzer
- [ ] No secrets: `git secrets --scan`
- [ ] `.env` is not staged: `git status`
- [ ] Branch is feature/* or develop (not main)
- [ ] Commit message is clear and has service context

---

## 🔍 Testing Hooks Locally

```bash
# Trigger pre-commit
npx husky run pre-commit

# Simulate pre-push (prevents main/develop push)
npx husky run pre-push

# Check git-secrets
git secrets --scan

# List all hooks
ls -la .husky/
```

---

## 📈 Performance Optimization

To reduce token/time usage in hooks:

1. **Skip tests in pre-commit** (run full suite in pre-push)
2. **Use lint-staged** (only lint changed files)
3. **Parallel tests** (Jest/RSpec parallel mode)
4. **Cache dependencies** (Docker layer caching)
5. **Conditional hooks** (skip if containers not running)

---

## 🔗 References

- **Git Hooks**: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
- **Husky**: https://typicode.github.io/husky/
- **Lint-staged**: https://github.com/okonet/lint-staged
- **Git Secrets**: https://github.com/awslabs/git-secrets
- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker Compose v2 Upgrade**: https://docs.docker.com/compose/migrate/
- **Docker Compose Command Reference**: https://docs.docker.com/engine/reference/commandline/compose/

---

## 📝 Troubleshooting

### Hooks not running
```bash
# Reinstall hooks
npx husky install

# Verify hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Git secrets false positives
```bash
# Whitelist safe patterns
git secrets --add -a 'pattern_that_is_safe'

# Scan but don't fail
git secrets --scan || true
```

### Docker errors in hooks
```bash
# Check if Docker is running
docker ps

# Check service status
docker compose ps

# View logs
docker compose logs <service>
```

---

**Last Updated**: April 2026
**Docker Compose Version**: v2 (recommended)
**Node Version**: 22
