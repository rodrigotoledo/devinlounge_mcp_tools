# Hooks & Agents System

Configure automated behaviors and specialized agents for your project.

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

# Run tests (frontend)
npm --prefix expo-mobile run test -- --bail 2>/dev/null || true

# Docker-based linting
docker compose exec -T nextjs npm run lint 2>/dev/null || true
docker compose exec -T nestjs npm run lint 2>/dev/null || true
```

#### `.husky/pre-push`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Ensure branch is not main or develop (prevent accidental pushes)
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "develop" ]; then
  echo "❌ Cannot push directly to $CURRENT_BRANCH"
  echo "Use git flow: create feature/* branch and submit PR"
  exit 1
fi

# Run type checking
npm --prefix expo-mobile run typecheck 2>/dev/null || true

# Run backend tests before push
docker compose exec -T nestjs npm run test -- --bail 2>/dev/null || true
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

---

## 🤖 Cursor Agents & Hooks

### `.cursor/agents.md`

Define specialized agents for specific tasks:

```markdown
# Cursor Agents Configuration

## Agent: Backend-NestJS-Expert
**Trigger:** When user asks about backend or mentions NestJS
**Tools:** Docker exec, TypeScript LSP, NestJS documentation
**Behavior:** 
- Always use `docker compose exec nestjs …` for installs/tests
- Recommend dependency injection for all services
- Enforce strict TypeScript
- Suggest Guards/Pipes for middleware
- Focus on modular architecture

## Agent: Rails-Expert
**Trigger:** When user works on backend-rails directory
**Tools:** RSpec, RuboCop, Bundle, Git
**Behavior:**
- Always use `docker compose exec fullstack …`
- Enforce RSpec (no Minitest)
- Suggest DatabaseCleaner + Shoulda Matchers
- Recommend Rails conventions
- SimpleCov for coverage tracking
- Run tests before committing

## Agent: Frontend-Mobile-Expert
**Trigger:** When user works on expo-mobile or web-*
**Tools:** TypeScript, Tailwind CSS, Jest
**Behavior:**
- Recommend Expo for mobile (unless native modules needed)
- Default to Tailwind utilities for styling
- Suggest custom hooks for logic extraction
- Recommend TypeScript strict mode
- Focus on small, reusable components

## Agent: Docker-Compose-Manager
**Trigger:** When user asks about running services
**Tools:** Docker Compose, Environment variables
**Behavior:**
- Always suggest Docker Compose from repo root
- Remind: Never run npm/bundle/pip directly on host (except Expo)
- Suggest `docker compose exec <service>` when containers running
- Suggest `docker compose run --rm <service>` for one-shots
- Check .env before suggesting commands

## Agent: Git-Flow-Enforcer
**Trigger:** When user mentions git, branches, commits, PRs
**Tools:** Git, GitHub CLI
**Behavior:**
- Enforce Git Flow: main (prod) ↔ develop (integration)
- Feature branches from develop; PR back to develop
- Hotfixes from main; PR to both main & develop
- Present-tense commit messages
- Include service context: `[backend-nestjs]: add…`
- Prevent direct commits to main/develop

## Agent: Security-Scanner
**Trigger:** Before any code push or release
**Tools:** Brakeman, Bundler-audit, Snyk, npm audit
**Behavior:**
- Run security scans automatically
- Check for secrets in commits (git-secrets)
- Verify no .env or credentials committed
- Scan dependencies for CVEs
- Report findings and block commits if critical
```

### Enable Agents in Cursor

Add to `.cursor/config.json`:

```json
{
  "agents": {
    "backend_nestjs_expert": {
      "enabled": true,
      "trigger": "nestjs|backend-nestjs",
      "mode": "auto_trigger"
    },
    "rails_expert": {
      "enabled": true,
      "trigger": "rails|backend-rails|rspec",
      "mode": "auto_trigger"
    },
    "frontend_mobile_expert": {
      "enabled": true,
      "trigger": "expo|react-native|mobile",
      "mode": "auto_trigger"
    },
    "docker_manager": {
      "enabled": true,
      "trigger": "docker|compose|run|exec",
      "mode": "manual"
    },
    "git_flow_enforcer": {
      "enabled": true,
      "trigger": "git|branch|commit|pr",
      "mode": "auto_trigger"
    },
    "security_scanner": {
      "enabled": true,
      "trigger": "security|vulnerability|secret",
      "mode": "manual"
    }
  }
}
```

---

## 🧠 Claude Agent Tasks

Define specific tasks that Claude Code agents should perform:

### `.claude/agents/BACKEND_NESTJS.md`

```markdown
# Backend NestJS Agent

## Scope
Handles all NestJS backend development, testing, and deployment.

## Environment
- Service: `backend-nestjs`
- Container command: `docker compose exec nestjs`
- Database: PostgreSQL (service: `db`)
- Cache: Redis (service: `redis`)

## Key Responsibilities
1. Implement NestJS modules, controllers, services
2. Run tests: `npm run test`
3. Enforce linting: `npm run lint`
4. Manage migrations: `npm run migration:run`
5. Handle dependency installs: `npm install <package>`

## Rules
- ✅ Always use Docker Compose
- ✅ Dependency injection for everything
- ✅ Guards for authentication/authorization
- ✅ TypeScript strict mode
- ✅ Comprehensive error handling
- ❌ Never skip Docker
- ❌ No singleton patterns
- ❌ No hardcoded secrets

## Tools Available
- Docker Compose (run services)
- TypeScript language server (code intelligence)
- NestJS CLI (generation, migrations)
- Jest (testing framework)
- ESLint (linting)

## Decision Tree
```
User asks about NestJS
├─ If: Installation/dependencies
│  └─ Suggest: docker compose exec nestjs npm install <pkg>
├─ If: Creating new feature
│  ├─ Step 1: Generate module: docker compose exec nestjs nest generate module feature_name
│  ├─ Step 2: Create controller, service
│  ├─ Step 3: Write tests
│  └─ Step 4: Run linting & tests before commit
├─ If: Running/debugging
│  └─ Suggest: docker compose exec nestjs npm run start:dev
└─ If: Testing
   └─ Suggest: docker compose exec nestjs npm run test --watch
```
```

### `.claude/agents/RAILS.md`

```markdown
# Rails Backend Agent

## Scope
Handles all Rails fullstack development, testing, deployment.

## Environment
- Services: `fullstack` (web), `fullstack-worker` (Sidekiq)
- Container command: `docker compose exec fullstack`
- Database: PostgreSQL (with Solid Cache in separate schema)
- Queue: Sidekiq (Redis-backed)
- Cache: Action Cable (WebSocket, Redis)

## Key Responsibilities
1. Implement models, controllers, views, helpers
2. Create migrations & manage schema
3. Write RSpec tests (ONLY RSpec, no Minitest)
4. Run quality checks: RuboCop, erb-lint
5. Manage gems: bundle add, bundle install

## Rules
- ✅ Always use Docker Compose
- ✅ RSpec ONLY for tests
- ✅ Solid Cache for fragment caching
- ✅ Helpers for view-specific logic
- ✅ SimpleCov for coverage tracking
- ✅ Shoulda Matchers for one-liners
- ✅ DatabaseCleaner for test isolation
- ❌ Never run bundle on host
- ❌ Never assert exact error messages
- ❌ No Minitest in this project

## Tools Available
- Docker Compose (runtime)
- Bundle (gem management)
- Rails generators (scaffolding)
- RSpec (testing)
- RuboCop + Rufo (formatting/linting)
- SimpleCov (coverage)

## Decision Tree
```
User asks about Rails
├─ If: Creating model/scaffold
│  └─ docker compose exec fullstack bin/rails generate model UserProfile user:references
├─ If: Database change
│  └─ docker compose exec fullstack bin/rails generate migration AddFieldToUsers
├─ If: Writing tests
│  ├─ ✅ Use RSpec (spec/models, spec/requests, spec/services)
│  ├─ ✅ Use Factory Bot (factories/users.rb)
│  ├─ ✅ Use Shoulda Matchers for validations
│  ├─ ✅ Assert behavior, not error message text
│  └─ Run: docker compose exec fullstack bin/rspec
├─ If: Running tests
│  └─ docker compose exec fullstack bin/rspec [--coverage]
├─ If: Code quality
│  ├─ Linting: docker compose exec fullstack bin/rubocop -A
│  ├─ Formatting: docker compose exec fullstack bin/rufo app/
│  ├─ Templates: docker compose exec fullstack bin/erb-lint app/views
│  └─ Security: docker compose exec fullstack brakeman -q
└─ If: Gem installation
   └─ docker compose exec fullstack bundle add devise
```
```

---

## 📊 CI/CD Hooks (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Tests & Linting

on: [push, pull_request]

jobs:
  # Frontend Tests
  frontend-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: cd expo-mobile && npm ci
      - run: cd expo-mobile && npm run typecheck
      - run: cd expo-mobile && npm run test

  # Docker-based tests
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

    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3

      # NestJS tests
      - run: docker compose exec -T nestjs npm ci
      - run: docker compose exec -T nestjs npm run test

      # FastAPI tests
      - run: docker compose exec -T api pip install -r requirements.txt
      - run: docker compose exec -T api pytest

      # Rails tests
      - run: docker compose exec -T fullstack bundle install
      - run: docker compose exec -T fullstack bin/rspec
      - run: docker compose exec -T fullstack bin/rubocop

  # Security scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose run --rm api pip install bandit && bandit -r app/
      - run: docker compose run --rm fullstack brakeman -q
      - run: docker compose run --rm fullstack bundle-audit check
```

---

## ✅ Pre-Commit Hook Checklist

Before each commit, the following should pass:

- [ ] Lint passes: ESLint, RuboCop, Ruff, Credo
- [ ] Type checks pass: TypeScript, MyPy
- [ ] Tests pass: Jest, RSpec, Pytest, ExUnit
- [ ] No secrets in code
- [ ] `.env` is not committed
- [ ] Commit message is clear and descriptive
- [ ] Branch is correct (`feature/*` or `hotfix/*`, never `main`/`develop`)

---

## 🔒 Security Hooks

### Prevent Secrets in Commits

Install git-secrets:

```bash
brew install git-secrets  # macOS

# Or clone from GitHub
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
./install.sh

# Configure for repo
git secrets --install -f

# Add patterns to detect
git secrets --register-aws
git secrets --add-provider -- cat $HOME/.gitconfig_secrets
```

Create `$HOME/.gitconfig_secrets` (patterns to detect):

```
(.*)secret(.*)
(.*)password(.*)
(.*)token(.*)
PRIVATE_KEY
DATABASE_URL=.*
REDIS_URL=.*
AWS_SECRET_ACCESS_KEY
API_KEY
JWT_SECRET
```

---

## 📈 Agent Performance Optimization

Hooks to reduce token usage:

1. **Cache dependencies:** Docker layer caching
2. **Parallel tests:** Jest/RSpec parallel execution
3. **Smart linting:** Only lint changed files (lint-staged)
4. **Reuse specs:** Factory Bot factories, shared contexts
5. **Summary-based responses:** Agent summarizes findings, not full output

---

## 🚀 Agent Triggers & Automation

| Trigger | Agent | Action |
|---------|-------|--------|
| `git commit` | All linters | Run pre-commit checks |
| `git push` | Git Flow Enforcer | Block pushes to main/develop |
| `npm install` | Docker Manager | Remind: Use Docker |
| `rails test` | Rails Expert | Run RSpec via Docker |
| `POST /api/*` | Security Scanner | Check auth/validation |
| `@claude create` | Appropriate expert | Spawn specialized agent |
| `Release/v*` | Security Scanner | Full security audit |

---

## 📝 Custom Agent Example

Create `.claude/agents/CUSTOM_API_VALIDATOR.md`:

```markdown
# Custom API Validator Agent

**Trigger:** When validating API responses
**Scope:** All backend services
**Mode:** Manual (user invokes: @api-validator check response)

## Checks
1. Response schema matches OpenAPI spec
2. Status codes are correct
3. Error messages are helpful
4. CORS headers present (if applicable)
5. Rate limiting configured
6. Input validation present

## Output
- ✅ Validates against schema
- ⚠️ Warnings for missing validations
- ❌ Errors if critical issues found
```

Invoke in Cursor:

```
@api-validator check the user list endpoint response
```

---

## 🔗 References

- **Husky:** https://typicode.github.io/husky/
- **Lint-staged:** https://github.com/okonet/lint-staged
- **Git Secrets:** https://github.com/awslabs/git-secrets
- **GitHub Actions:** https://docs.github.com/en/actions

