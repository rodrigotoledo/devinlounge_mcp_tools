# Documentation Review and Fixes

## Overview

This document reviews the current documentation files in the default_settings template and identifies issues with hooks/rules, README clarity, and Docker command consistency.

---

## 📋 Issues Identified

### 1. **README.md - Identity Crisis**

**Issue**: README presents this as an actual multi-stack project (clients/workers platform) rather than uma template/reference directory.

**Current Content**:
```markdown
# Multi-stack
A comprehensive platform for connecting clients with workers through job postings and services.
```

**Problems**:
- [ ] Confuses template users about the project's purpose
- [ ] Has project-specific paths (api, expo, fullstack-rails)
- [ ] Mix of Portuguese and English
- [ ] References specific FastAPI, Rails, and React Native implementations as if required

**Impact**: Users don't understand they're working with a template.

---

### 2. **Docker Command Inconsistency**

**Issue**: Docker commands across documentation use inconsistent formats.

**Examples of Inconsistency**:

```bash
# OLD FORMAT (Docker Compose v1) - in README
docker-compose up --build
docker-compose down

# NEW FORMAT (Docker Compose v2) - in DOCKER_COMPOSE_TEMPLATE.md
docker compose build
docker compose up --build
docker compose down
```

**Problems**:
- [ ] `docker-compose` (v1) is deprecated
- [ ] `docker compose` (v2) is current standard
- [ ] README mixes both formats
- [ ] HOOKS_AND_AGENTS.md uses v2 format mostly but needs verification

**All commands should use v2 format**:
```bash
# ✅ CORRECT - Docker Compose v2 (no hyphen)
docker compose up
docker compose down
docker compose exec
docker compose logs
docker compose build

# ❌ DEPRECATED - Docker Compose v1 (with hyphen)
docker-compose up
docker-compose down
```

---

### 3. **HOOKS_AND_AGENTS.md - Service Name Hardcoding**

**Issue**: Hooks reference specific service names that may not match user's setup.

**Current Examples**:
```bash
docker compose exec nestjs npm run test
docker compose exec fullstack bin/rails db:migrate
docker compose exec api pip install -r requirements.txt
```

**Problems**:
- [ ] Users might have different service names
- [ ] No explanation of what these services are
- [ ] CI/CD examples use `-T` (correct for rootless) but regular examples don't mention it
- [ ] No fallback for different configurations

**Better Approach**: Explain service names and make them configurable.

---

### 4. **Outdated Git Hook References**

**Issue**: Pre-commit/pre-push hooks reference old service names and setup.

**Current Examples**:
```bash
docker compose exec -T nextjs npm run lint
docker compose exec -T nestjs npm run test
docker compose exec -T fullstack bin/rails db:migrate
```

**Problems**:
- [ ] Assumes all services are always running
- [ ] No error handling if services don't exist
- [ ] Uses `2>/dev/null || true` to suppress errors (masks real issues)
- [ ] Should fail if critical checks fail

---

### 5. **README - Mixed Language Content**

**Issue**: README switches between English and Portuguese without clear sections.

**Current Structure**:
```markdown
## Backend API

Backend em FastAPI para...  # Portuguese

### Visao geral            # Portuguese

### Stack usada           # Portuguese

### Estrutura principal   # Portuguese
```

**Problems**:
- [ ] Inconsistent audience
- [ ] Harder to maintain
- [ ] Not professional for open source
- [ ] Users might be confused about target audience

**Fix**: Choose one language (recommend English for templates) or create separate files.

---

### 6. **README - Project-Specific Content in Template**

**Issue**: README treats this as a specific project implementation rather than a template.

**Examples**:
```markdown
api/
fullstack-rails/
expo/
```

**Better for Template**:
```markdown
backend-{framework}/     # e.g., backend-nestjs, backend-rails, backend-fastapi
frontend-{framework}/    # e.g., frontend-nextjs, frontend-react
mobile/
```

---

### 7. **Inconsistent Docker Healthcheck Usage**

**Issue**: Some commands assume services are healthy before running.

**Current**:
```yaml
depends_on:
  db:
    condition: service_healthy
```

**But hooks run commands without checking**:
```bash
docker compose exec nestjs npm run test  # What if service is down?
```

---

## ✅ Recommended Fixes

### Fix 1: Update README.md Header

**Replace**:
```markdown
# Multi-stack

A comprehensive platform for connecting clients with workers...
```

**With**:
```markdown
# Default Settings - Project Template

A comprehensive template and reference guide for multi-stack projects with:
- **Backend Frameworks**: NestJS, Rails, FastAPI, Phoenix
- **Frontend Frameworks**: Next.js, React, React Native (Expo)
- **Infrastructure**: PostgreSQL, Redis, Docker Compose
- **CI/CD**: GitHub Actions, Pre-commit hooks

This is a reference directory showing best practices, hooks, agents, and Docker configurations.
```

---

### Fix 2: Standardize Docker Commands to v2

**Audit and Update**:

```bash
# ❌ OLD (v1 - deprecated)
docker-compose up
docker-compose exec service command
docker-compose down -v

# ✅ NEW (v2 - current standard)
docker compose up
docker compose exec service command
docker compose down -v

# With flags
docker compose up -d          # detach (background)
docker compose up --build     # rebuild images
docker compose logs -f        # follow logs
docker compose run --rm service command  # one-shot
```

**Apply to**:
- [ ] README.md
- [ ] HOOKS_AND_AGENTS.md
- [ ] All documentation files
- [ ] Script files in `scripts/` directory

---

### Fix 3: Make Hooks Resilient to Missing Services

**Before**:
```bash
docker compose exec -T nestjs npm run test 2>/dev/null || true
docker compose exec -T fullstack bin/rspec 2>/dev/null || true
```

**After**:
```bash
#!/bin/sh
set -e  # Exit on first error

# Check if containers are running
if ! docker compose ps --services | grep -q "nestjs"; then
  echo "⚠️  nestjs service not found. Skipping tests."
else
  echo "Running NestJS tests..."
  docker compose exec -T nestjs npm run test || {
    echo "❌ Tests failed"
    exit 1
  }
fi
```

Or simpler approach:
```bash
# For CI/CD (containers must exist)
docker compose run --rm nestjs npm run test

# For local dev (containers should be running)
docker compose exec nestjs npm run test 2>/dev/null || \
  echo "⚠️  nestjs not running. Start with: docker compose up"
```

---

### Fix 4: Create Service Name Configuration

**Create `docker-compose.env`**:
```env
# Service names (customize if needed)
SERVICE_BACKEND_NODE=nestjs
SERVICE_BACKEND_RAILS=fullstack
SERVICE_BACKEND_PYTHON=api
SERVICE_BACKEND_ELIXIR=phoenix
SERVICE_DB=db
SERVICE_REDIS=redis
```

**Use in scripts**:
```bash
source docker-compose.env

docker compose exec -T $SERVICE_BACKEND_NODE npm run test
docker compose exec -T $SERVICE_BACKEND_RAILS bin/rspec
```

---

### Fix 5: Separate Language Content

**Option A: Create separate language files**
```
README.md              # English
README_PT-BR.md        # Portuguese
HOOKS_AND_AGENTS.md    # English
```

**Option B: Use language-specific sections**
```markdown
## English Section
Description in English...

---

## Seção em Português
Descrição em português...
```

**Recommended**: Option A (clearer, easier to maintain)

---

### Fix 6: Update HOOKS_AND_AGENTS.md Service Naming

**Before**:
```markdown
## Agent: Backend-NestJS-Expert
**Behavior:** 
- Always use `docker compose exec nestjs …`
```

**After**:
```markdown
## Agent: Backend-NestJS-Expert

**Trigger:** When user works on `backend-nestjs/` or mentions NestJS

**Service Name:** `nestjs` (configurable in docker-compose.yml)

**Behavior:**
- Use `docker compose exec nestjs npm install <pkg>` (or configure service name)
- Never run npm directly on host
- Recommend dependency injection for all services
```

---

### Fix 7: Clarify CI/CD vs Local Usage

**Create separate sections in HOOKS_AND_AGENTS.md**:

```markdown
## Local Development Hooks

Running on developer machine with services already started:
```bash
docker compose exec nestjs npm run test
```

## CI/CD Hooks

Running in GitHub Actions or CI pipeline:
```bash
docker compose run --rm nestjs npm run test
```

The `-T` flag removes pseudo-terminal allocation (needed in CI).
```

---

## 📝 Files to Update

| File | Changes | Priority |
|------|---------|----------|
| README.md | Change title, fix Docker v2, clarify template purpose | HIGH |
| HOOKS_AND_AGENTS.md | Standardize Docker commands, clarify service names | HIGH |
| DOCKER_COMPOSE_TEMPLATE.md | Already good, minor updates | MEDIUM |
| scripts/ | Audit all scripts for Docker v1 usage | MEDIUM |
| PHOENIX_ELIXIR_SETUP.md | Update any Docker v1 commands | LOW |
| RAILS_SETUP_GUIDE.md | Update any Docker v1 commands | LOW |
| All other guides | Audit for Docker v1 commands | LOW |

---

## 🔍 Audit Checklist

Run these commands to find Docker v1 references:

```bash
# Find docker-compose (v1) usage
grep -r "docker-compose" .

# Find docker compose (v2) - should be standard
grep -r "docker compose" .

# Count occurrences
echo "Docker v1 references:"
grep -r "docker-compose" . | wc -l

echo "Docker v2 references:"
grep -r "docker compose" . | wc -l
```

**Expected result**: Only v2 (`docker compose`) should be found.

---

## 🎯 Recommended Action Plan

1. **Phase 1 (High Priority)**
   - [ ] Update README.md title and purpose
   - [ ] Replace all `docker-compose` with `docker compose`
   - [ ] Update HOOKS_AND_AGENTS.md with clearer service explanations

2. **Phase 2 (Medium Priority)**
   - [ ] Add error handling to hook scripts
   - [ ] Create docker-compose.env for configurable service names
   - [ ] Add separate Portuguese documentation files

3. **Phase 3 (Low Priority)**
   - [ ] Audit all other guides for Docker v1 references
   - [ ] Create quick reference card
   - [ ] Add troubleshooting section

---

## 📚 Reference

### Docker Compose v1 vs v2

| Feature | v1 | v2 |
|---------|----|----|
| Command | `docker-compose` | `docker compose` |
| Status | Deprecated | Current standard |
| Installation | Separate | Built into Docker |
| Performance | Good | Better |
| Best for | Older projects | New projects |

**All new projects should use v2.**

---

## 🚀 Quick Fix Script

```bash
#!/bin/bash
# Fix Docker v1 to v2 in all documentation

echo "Updating docker-compose to docker compose..."

# Backup originals
find . -name "*.md" -exec cp {} {}.bak \;

# Replace in all markdown files
find . -name "*.md" -exec sed -i 's/docker-compose/docker compose/g' {} \;

# Replace in shell scripts
find . -name "*.sh" -exec sed -i 's/docker-compose/docker compose/g' {} \;

echo "✅ Replacement complete. Original files backed up with .bak extension"
```

---

## Questions for Users/Maintainers

1. **Should this template focus on one primary language?**
   - Recommend: English for broader audience
   - Alternative: Keep Portuguese but mark clearly

2. **Should service names be configurable or fixed?**
   - Fixed: Simpler, less configuration
   - Configurable: More flexible for different setups

3. **Should hooks fail hard (exit 1) or warn softly (echo + continue)?**
   - Fail hard: Catches problems early
   - Warn soft: More forgiving, better for optional steps

4. **Should CI/CD use `docker compose run` or `docker compose exec`?**
   - `run`: Creates new container (safe, clean)
   - `exec`: Uses existing container (faster, but requires running services)

---

## Summary

**Main Issues**:
- ✅ Docker v1 (`docker-compose`) commands need updating to v2 (`docker compose`)
- ✅ README needs clarification that this is a template, not a specific project
- ✅ HOOKS_AND_AGENTS.md needs better service name documentation
- ✅ Mixed language content should be separated or standardized
- ✅ Error handling in hooks could be more robust

**Severity**: HIGH (breaks user experience with deprecated commands)

**Estimated Fix Time**: 1-2 hours for complete update
