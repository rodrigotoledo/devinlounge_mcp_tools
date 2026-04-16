# Git Flow Workflow

This project uses **Git Flow** for branching and release management. Read this document before creating branches or opening pull requests.

---

## 📋 Branch Structure

### `main` — Production-Ready Code

- **Always stable and deployable.**
- Protected branch: require PR review before merge.
- Merge only from `release/` and `hotfix/` branches.
- Tag releases with version: `git tag -a v1.2.3 -m "Release v1.2.3"`
- **Never commit directly.** Use PR flow.

### `develop` — Integration Branch

- **Base for feature development.**
- Merge completed features from `feature/` branches here.
- Used to create `release/` branches when preparing a release.
- Should be stable enough for integration testing.
- **Protected:** require PR review before merge.

### `feature/*` — Feature & Bug Fix Branches

- Branch from: `develop`
- Merge back to: `develop` (via PR)
- Naming: `feature/user-authentication`, `feature/dark-mode-toggle`, `feature/fix-timeout-bug`
- Include service context in name: `feature/backend-nestjs/jwt-validation`, `feature/web-nextjs/ssr-cache`
- Delete after merge (keep history clean)

### `hotfix/*` — Critical Production Fixes

- Branch from: `main`
- Merge back to: **both `main` (via PR) and `develop` (via PR)**
- Naming: `hotfix/session-expiry-crash`, `hotfix/database-connection-leak`
- Delete after merge

### `release/*` — Release Preparation

- Branch from: `develop`
- Merge back to: **`main` (via PR)** and back to `develop` (via PR)
- Naming: `release/v1.2.3`, `release/1.2.0-beta`
- Use for final testing, version bumps, changelog updates
- Should not include new features; only bugfixes and version metadata
- Delete after merge

---

## 🔄 Workflow Examples

### Creating a Feature

```bash
# 1. Start from develop, pull latest
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/user-authentication

# 3. Make commits (see "Commit Messages" section below)
git add .
git commit -m "backend-nestjs: add JWT authentication middleware"

# 4. When ready, push and open PR to develop
git push -u origin feature/user-authentication
# Open PR on GitHub/GitLab: feature/user-authentication → develop
```

### Creating a Hotfix

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/session-crash

# 3. Make commits and fix the issue
git add .
git commit -m "fix: prevent session expiry crash on Redis timeout"

# 4. Push and open PR to main
git push -u origin hotfix/session-crash
# Open PR: hotfix/session-crash → main

# 5. AFTER merge to main, also merge to develop
git checkout develop
git pull origin develop
git merge --no-ff hotfix/session-crash
git push origin develop

# 6. Clean up
git branch -d hotfix/session-crash
git push origin --delete hotfix/session-crash
```

### Creating a Release

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/v1.2.3

# 3. Update version numbers (package.json, requirements.txt, mix.exs, etc.)
# Update CHANGELOG if you maintain one

git add package.json requirements.txt ...
git commit -m "chore: bump version to 1.2.3"

# 4. Final testing in this branch; if bugs found, commit fixes here (not in new feature branches)
git add .
git commit -m "fix: correct timeout edge case discovered in release testing"

# 5. Merge to main
git push -u origin release/v1.2.3
# Open PR: release/v1.2.3 → main

# 6. AFTER merge to main, tag the release
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# 7. Merge back to develop
git checkout develop
git pull origin develop
git merge --no-ff release/v1.2.3
git push origin develop

# 8. Clean up
git branch -d release/v1.2.3
git push origin --delete release/v1.2.3
```

---

## 💬 Commit Message Format

### Structure

```
<scope>: <description>

<optional body>

<optional footer>
```

### Rules

- **Tense:** Present tense ("add user auth", not "added…")
- **Case:** Lowercase
- **Scope:** Service/package affected; e.g., `backend-nestjs`, `web-nextjs`, `backend-rails`, `expo`
- **Description:** What was done (under 50 characters)
- **Body:** Why it was done, any context (optional; wrap at 72 characters)
- **Footer:** Reference issues: `fixes #123`, `relates to #456` (optional)

### Examples

**Good:**
```
backend-nestjs: add JWT validation middleware

Validates incoming requests against HS256-signed tokens.
Rejects expired tokens with 401; malformed tokens with 403.
Allows public endpoints via @Public() decorator.

fixes #42
```

```
web-nextjs: fix dark mode toggle persistence

Previously toggled state was lost on page refresh.
Now uses localStorage to persist preference.
```

```
expo: extract navigation logic to custom hook

Removes boilerplate from screens; simplifies testing.
```

**Bad:**
```
Updated stuff
fix bug
Add feature
WIP: trying something
```

---

## 📋 Pull Request Checklist

Before opening or merging a PR:

- [ ] Branch created from correct base (`develop` for features, `main` for hotfixes)
- [ ] All commits have clear, descriptive messages (present tense, service context)
- [ ] No merge commits; history is clean
- [ ] Tests pass (run via Docker): `docker compose exec <service> npm run test` / `pytest` / `rspec`
- [ ] Linting passes: `docker compose exec <service> npm run lint` / `ruff check .` / `rubocop`
- [ ] Type checking passes (if applicable): `npm run typecheck` / `mypy`
- [ ] `.env.example` updated if new env vars added
- [ ] Database migrations created (if schema changed)
- [ ] No secrets or `.env` files committed
- [ ] PR title includes service context: `[backend-nestjs] add…` or `[web-nextjs] fix…`
- [ ] PR description summarizes changes and links related issues
- [ ] Branch will be deleted after merge (toggle in GitHub/GitLab)

---

## 🔄 Code Review Guidelines

**When reviewing a PR:**

1. Check that branch is from correct base and targets correct branch
2. Review commit messages for clarity and conventions
3. Request changes if code violates project style (abbreviations, Docker rules, Tailwind usage, etc.)
4. Verify tests & linting pass
5. Check that migration/seed files are sound (if DB changes)
6. Approve once all feedback is addressed
7. Merge using **squash or rebase** to keep `develop` history clean (avoid merge commits for feature branches)

**Merge strategy:**
- **Feature PRs (feature/* → develop):** Squash or rebase
- **Hotfix PRs (hotfix/* → main):** Merge commit (preserves history)
- **Release PRs (release/* → main/develop):** Merge commit

---

## 🚀 Release Checklist

Before releasing to production:

1. [ ] `release/vX.Y.Z` branch created from `develop`
2. [ ] Version bumped in all relevant files:
   - `web-nextjs/package.json` + `package-lock.json`
   - `backend-nestjs/package.json` + `package-lock.json`
   - `backend-fastapi/requirements.txt` (version in setup.py if present)
   - `backend-rails/Gemfile.lock` (version in `config/initializers/version.rb`)
   - `backend-phoenix/mix.exs` + `mix.lock`
   - `expo-mobile/package.json` + `package-lock.json`
3. [ ] Changelog updated (if maintained)
4. [ ] All bugfixes from release testing committed
5. [ ] PR created: `release/vX.Y.Z` → `main`
6. [ ] PR reviewed and approved
7. [ ] Merged to `main`
8. [ ] Git tag created: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
9. [ ] Tag pushed: `git push origin vX.Y.Z`
10. [ ] Release merged back to `develop`
11. [ ] Release branch deleted

---

## ⚠️ Do Not

- ❌ **Commit directly to `main` or `develop`.** Always use feature/hotfix branches and PRs.
- ❌ **Force-push to shared branches.** `git push --force` on `main` or `develop` will anger teammates.
- ❌ **Merge without squashing feature branches.** Keep history clean.
- ❌ **Leave merge commits in your feature branch history.** Rebase instead.
- ❌ **Commit secrets, `.env`, or large binaries.**
- ❌ **Open PR without running tests & linting first.**

---

## 🎓 Useful Commands

```bash
# See all branches (local and remote)
git branch -a

# Delete local branch (after merge)
git branch -d feature/user-auth

# Delete remote branch
git push origin --delete feature/user-auth

# Sync develop with latest
git checkout develop && git pull origin develop

# See commits since last release
git log v1.0.0..HEAD --oneline

# Rebase current branch on latest develop
git fetch origin
git rebase origin/develop

# Squash multiple commits (interactive rebase)
git rebase -i HEAD~3   # Last 3 commits
# Mark commits as 'squash' or 's'
```

---

## 📚 Further Reading

- **Original Git Flow article:** https://nvie.com/posts/a-successful-git-branching-model/
- **Atlassian Git Flow guide:** https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
- **GitHub Flow (alternative, simpler):** https://guides.github.com/introduction/flow/ (this project uses Git Flow, not GitHub Flow)

---

**Last updated:** 2026-04-16  
**Workflow:** Git Flow (strict)  
**Main branch:** `main` (production-ready)  
**Integration branch:** `develop` (for features)
