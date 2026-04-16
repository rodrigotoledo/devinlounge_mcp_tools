# Ignore Files Best Practices

Comprehensive guide for `.gitignore`, `.dockerignore`, and `.claudeignore` files.

---

## 📋 Overview

| File | Purpose | Impact | Update Frequency |
|------|---------|--------|------------------|
| `.gitignore` | Prevent committing sensitive/unnecessary files | Prevents security issues, keeps repo clean | Per project |
| `.dockerignore` | Reduce Docker image build size | Faster builds, smaller images | Per service |
| `.claudeignore` | Focus Claude Code context | Better token efficiency, faster responses | Per project |

---

## 🔐 .gitignore Best Practices

### Root Project `.gitignore`

```gitignore
# ============================================================================
# ENVIRONMENT & SECRETS (CRITICAL - Never commit)
# ============================================================================
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test

# Credentials & Keys
*.pem
*.key
*.jks
.ssh/
secrets/
keystore

# AWS, API Keys, Tokens
.aws/
.aws-credentials
.credentials
.api-key
.token

# ============================================================================
# DEPENDENCIES (Ignored, auto-installed)
# ============================================================================

# Node
node_modules/
package-lock.json      # Optional: some projects commit this
yarn.lock
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm/

# Python
.venv/
venv/
env/
.Python
*.egg-info/
dist/
build/
__pycache__/
*.pyc
*.pyo
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Ruby
.bundle/
vendor/bundle/
Gemfile.lock           # Usually committed
gems/

# Elixir
_build/
deps/
*.ez

# ============================================================================
# BUILD & ARTIFACTS
# ============================================================================
dist/
build/
.next/
.turbo/
coverage/
htmlcov/
.nyc_output/
*.lcov

# ============================================================================
# IDE & EDITOR
# ============================================================================
.vscode/
.idea/
.sublime-project
.sublime-workspace
*.swp
*.swo
*~
.DS_Store
Thumbs.db
.AppleDouble
.LSOverride
ehthumbs.db

# ============================================================================
# DATABASE & CACHE
# ============================================================================
*.sqlite
*.sqlite3
*.db
.cache/
tmp/
temp/
.tmp/

# ============================================================================
# LOGS
# ============================================================================
logs/
*.log
*.log.*

# ============================================================================
# SYSTEM & OS
# ============================================================================
.DS_Store
.AppleDouble
.LSOverride
Thumbs.db
ehthumbs.db
Desktop.ini

# ============================================================================
# CI/CD & DevOps
# ============================================================================
.github/workflows/secrets.yml
.gitlab-ci.local.yml
.travis.local.yml
.circleci/config.local.yml

# ============================================================================
# LOCAL OVERRIDES (Git-ignored but example files committed)
# ============================================================================
.vscode/settings.local.json
.claude/settings.local.json
.cursor/config.local.json

# ============================================================================
# DO NOT IGNORE - Keep these files tracked
# ============================================================================
# Documentation
!*.md
!docs/

# Configuration templates
!.env.example
!.env.example.*

# Configuration files (track these)
!.editorconfig
!.rubocop.yml
!.eslintrc.json
!tsconfig.json
!.prettierrc
!.gitattributes

# Package managers (lock files usually tracked)
!package-lock.json       # Node
!Gemfile.lock           # Ruby
!mix.lock               # Elixir

# Examples & templates
!.vscode/extensions.json
!.vscode/settings.json
!.cursor/rules.md
```

### Service-Specific `.gitignore`

Each service should inherit root rules. Add service-specific patterns:

**`backend-rails/.gitignore`**

```gitignore
# Inherit parent .gitignore patterns

# Rails-specific
config/master.key
config/credentials.yml.enc
db/*.sqlite3
db/schema.rb              # Optional: can commit
public/uploads/
storage/
tmp/

# Pids
*.pid
*.semafor
pid/

# RSpec
coverage/
.rspec

# bundler
.bundle/
vendor/bundle/
```

**`backend-fastapi/.gitignore`**

```gitignore
# Python virtual environment
.venv/
venv/
env/

# FastAPI
app/__pycache__/
__pycache__/
*.pyc

# Alembic migrations (git-tracked)
alembic/versions/

# Database
instance/
test.db

# VSCode Python
.venv/
.pytest_cache/

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# Ruff
.ruff_cache/
```

**`expo-mobile/.gitignore`**

```gitignore
# Node
node_modules/
.npm

# Expo
.expo/
.expo-shared/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# IDE
.idea
.vscode
*.swp
*.swo
*~

# Env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 🐳 .dockerignore Best Practices

### Purpose

Exclude files from Docker build context. Reduces:
- Build time
- Image size
- Attack surface

### Root Project `.dockerignore`

```dockerfile
# Version Control (not needed in image)
.git
.gitignore
.gitattributes
.github/
.gitlab-ci.yml
.circleci/

# Documentation (keep Dockerfile, remove markdown)
*.md
docs/
LICENSE

# IDE & Editor
.vscode/
.idea/
*.swp
*~
.DS_Store

# Node dev
node_modules/
npm-debug.log
yarn.lock
.next/              # In image only, not build context
.turbo/

# Python dev
.venv/
__pycache__/
.pytest_cache/
.mypy_cache/
.ruff_cache/
*.pyc

# Ruby dev
.bundle/
vendor/
.cache/

# Build artifacts to not include
dist/
build/
coverage/

# Environment
.env                 # Never in image
.env.local
.env.*

# Docker
docker-compose*.yml  # Don't include unless needed
Dockerfile.dev

# CI/CD local files
.gitlab-ci.local.yml
.travis.local.yml

# Logs
logs/
*.log

# Temporary
tmp/
temp/

# OS
.DS_Store
Thumbs.db
```

### Key Rules

**✅ Include in Build Context:**
- `package.json`, `package-lock.json`
- `Gemfile`, `Gemfile.lock`
- `requirements.txt` (pinned versions)
- `mix.exs`, `mix.lock`
- Source code
- Static assets

**❌ Exclude from Build Context:**
- `.git/` (history not needed)
- `node_modules/`, `vendor/` (installed in container)
- `.env` (secrets never in image)
- `docs/` (unless serving in app)
- IDE configuration
- Development tools

### Service-Specific Patterns

**`backend-nestjs/Dockerfile`**

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

Uses root `.dockerignore` + service patterns.

**`backend-fastapi/Dockerfile`**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

---

## 🤖 .claudeignore Best Practices

### Purpose

- Reduce token usage by excluding large generated files
- Keep Claude focused on source code, not build artifacts
- Prevent timeout on large codebases

### Strategy

**Exclude (Large, Auto-Generated):**
- `node_modules/` (1000s of files)
- `__pycache__/` (compiled Python)
- `dist/`, `build/` (build artifacts)
- Coverage reports
- `.next/` (Next.js build)

**Include (Important Context):**
- `CLAUDE.md` (project rules)
- `.env.example` (configuration template)
- `package.json`, `requirements.txt` (dependencies)
- Configuration files (`.rubocop.yml`, `tsconfig.json`)
- Actual source code

### Root `.claudeignore`

```
# ============================================================================
# EXCLUDE - Large generated files (waste tokens)
# ============================================================================

# Dependencies
node_modules/
.venv/
venv/
vendor/bundle/
deps/
__pycache__/

# Build artifacts
dist/
build/
.next/
.turbo/
_build/
tmp/

# Cache
.cache/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.eslintcache/

# Database
*.sqlite
*.sqlite3
*.db

# Logs
logs/
*.log

# Coverage
coverage/
htmlcov/
.nyc_output/

# IDE (usually not needed for understanding code)
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Secrets
.env
.env.local

# ============================================================================
# INCLUDE - Important for Claude to understand project
# ============================================================================

# Keep configuration
!.editorconfig
!.rubocop.yml
!.eslintrc.json
!tsconfig.json
!.prettierrc
!jest.config.js

# Keep templates
!.env.example
!package.json
!Gemfile
!mix.exs
!pyproject.toml
!requirements.txt

# Keep documentation
!CLAUDE.md
!.cursor/rules.md
!.copilot/instructions.md
!README.md

# Keep Docker
!docker-compose.yml
!Dockerfile
!.dockerignore
```

### Impact

**Without `.claudeignore`:**
- Claude reads entire `node_modules/` (millions of files)
- 100,000+ tokens wasted on garbage
- Slow responses

**With `.claudeignore`:**
- Claude sees only source code & config
- 10,000-20,000 tokens per context window
- 5-10x faster responses

---

## 📋 Checklist for Each Service

For every service directory:

### Git

- [ ] `.gitignore` excludes node_modules, __pycache__, .env, vendor, etc.
- [ ] `.gitignore` includes `.env.example`, config templates
- [ ] Secrets never committed (check: git log --all --oneline — env)
- [ ] Lock files tracked: `package-lock.json`, `Gemfile.lock`, `mix.lock`

### Docker

- [ ] `.dockerignore` created at service root (or use root `.dockerignore`)
- [ ] Excludes node_modules, __pycache__, .git, docs, .env
- [ ] Image size < 500MB (check with `docker images`)
- [ ] Build time < 2 minutes (check with `docker build`)

### Claude Code

- [ ] Root `.claudeignore` configured
- [ ] Excludes large generated directories
- [ ] Includes `.env.example`, config files
- [ ] Includes CLAUDE.md, .cursor/rules.md

---

## 🚨 Security Checklist

### Critical (Never Commit)

- [ ] `.env` with real secrets
- [ ] `*.pem`, `*.key` (private keys)
- [ ] `credentials.json` (service accounts)
- [ ] `aws-credentials`, `.aws/config`
- [ ] Database passwords (if in code)
- [ ] API keys (if in code)

### Verify

```bash
# Check if any secrets might be in git history
git log -p | grep -i "password\|secret\|api_key\|token"

# Check current files
git status | grep -E "\.env|\.key|credential"

# Scan with git-secrets
git secrets --scan
```

---

## 🔄 Updating Ignore Files

### When to Update

- New dependency added → update `.gitignore`
- New build output → update `.dockerignore`
- New large directory → update `.claudeignore`

### Standard Pattern

1. Identify the file/directory that shouldn't be tracked
2. Add pattern to appropriate `.ignore` file
3. Remove from git if already tracked: `git rm --cached <file>`
4. Commit the change

---

## 📊 Example Repository Structure

```
project/
├── .gitignore           # Repo-level (dependencies, secrets, cache)
├── .dockerignore        # Repo-level (build context excludes)
├── .claudeignore        # Repo-level (Claude context excludes)
│
├── backend-nestjs/
│   ├── .gitignore       # Service-level (inherits parent, adds service-specific)
│   ├── .dockerignore    # Optional (inherits parent)
│   └── Dockerfile
│
├── backend-rails/
│   ├── .gitignore       # Rails-specific: tmp/, log/, storage/
│   └── Dockerfile
│
├── expo-mobile/
│   ├── .gitignore       # Expo-specific: .expo/, dist/, web-build/
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## ✅ Validation

### Test .gitignore

```bash
# Files that should be ignored
git add .env        # Should fail (in .gitignore)
git status          # Should show nothing added

# Files that should be tracked
git add .env.example
git status          # Should show .env.example ready to commit
```

### Test .dockerignore

```bash
# Build image and check size
docker build -t app:test .
docker images app:test  # Size should be < 500MB

# Check what's included
docker run --rm app:test ls -la  # Should NOT see node_modules, .git, etc.
```

### Test .claudeignore

```bash
# In Cursor/Claude Code:
# Open file browser — should not show node_modules, dist, coverage
# Should see: source files, config, documentation
```

---

## 🎓 Best Practices Summary

| File | Golden Rule |
|------|-------------|
| `.gitignore` | Never commit secrets; always commit templates |
| `.dockerignore` | Exclude all node_modules; include all source + config |
| `.claudeignore` | Exclude generated; include source + documentation |

---

## 📚 References

- **gitignore templates:** https://github.com/github/gitignore
- **Docker best practices:** https://docs.docker.com/develop/dev-best-practices/
- **Claude Code context:** See TOKEN_OPTIMIZATION.md

