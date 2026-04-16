# Linting & Code Quality Tools

Comprehensive linting configuration for all frameworks in the project.

---

## 🎯 Overview

| Framework | Primary Linter | Formatter | Type Checker | Coverage |
|-----------|---|---|---|---|
| TypeScript/JavaScript | ESLint | Prettier | TypeScript | Vitest/Jest |
| Python | Ruff | Ruff | MyPy | Pytest/Coverage |
| Ruby | RuboCop | RuboCop | Sorbet (opt) | SimpleCov |
| Elixir | Credo | Mix Format | Dialyzer (opt) | ExUnit |

---

## 📝 TypeScript / JavaScript (Node Services)

### ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2024,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "@typescript-eslint",
    "import",
    "unicorn"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-types": [
      "warn",
      { "allowExpressions": true }
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ],
    "unicorn/prefer-module": "error",
    "unicorn/filename-case": ["error", { "case": "kebabCase" }]
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "extends": ["plugin:jest/recommended"],
      "plugins": ["jest"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### Prettier Configuration

Create `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json}\"",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### Docker Command

```bash
docker compose exec nestjs npm run lint
docker compose exec nestjs npm run lint:fix
docker compose exec nextjs npm run typecheck
```

---

## 🐍 Python (FastAPI)

### Ruff Configuration

Create `pyproject.toml`:

```toml
[tool.ruff]
line-length = 100
target-version = "py312"
select = [
    "E", "F", "W",           # pycodestyle, Pyflakes, warnings
    "C901",                  # McCabe complexity
    "I",                     # isort (imports)
    "UP",                    # pyupgrade
    "B",                     # flake8-bugbear
    "S",                     # bandit (security)
    "A",                     # flake8-builtins
    "C4",                    # flake8-comprehensions
    "DTZ",                   # flake8-datetimez
    "EM",                    # flake8-errmsg
    "ISC",                   # flake8-implicit-str-concat
    "PIE",                   # flake8-pie
    "T20",                   # flake8-print
    "RET",                   # flake8-return
    "SIM",                   # flake8-simplify
    "FURB",                  # refurb
]
ignore = [
    "E501",                  # line too long (handled by formatter)
    "S101",                  # use of assert
    "S104",                  # hardcoded port
]
exclude = [
    ".git", ".venv", "__pycache__",
    "migrations", ".pytest_cache",
    ".mypy_cache", ".ruff_cache"
]

[tool.ruff.per-file-ignores]
"__init__.py" = ["F401"]    # unused imports in __init__
"test_*.py" = ["S101"]      # assert usage in tests
"conftest.py" = ["S101"]

[tool.ruff.isort]
known-first-party = ["app"]
known-third-party = ["fastapi", "pydantic", "sqlalchemy"]

[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
exclude = [
    "tests/", ".venv/", "migrations/"
]

[[tool.mypy.overrides]]
module = "tests.*"
ignore_errors = true

[tool.pytest.ini_options]
testpaths = ["tests/"]
python_files = ["test_*.py"]
addopts = "--cov=app --cov-report=html --cov-report=term-missing"
```

### Docker Commands

```bash
docker compose exec api ruff check .
docker compose exec api ruff check . --fix
docker compose exec api ruff format .
docker compose exec api mypy app/
docker compose exec api pytest
```

---

## 💎 Ruby (Rails)

### RuboCop Configuration

Create `.rubocop.yml` (from RAILS_SETUP_GUIDE.md):

```yaml
inherit_gem:
  rubocop-rails-omakase: rubocop.yml

AllCops:
  TargetRubyVersion: 3.3
  NewCops: enable
  Exclude:
    - 'bin/**/*'
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'

Metrics/MethodLength:
  Max: 25

Metrics/ClassLength:
  Max: 200

Metrics/AbcSize:
  Max: 30

Style/StringLiterals:
  EnforcedStyle: single_quotes

Rails/SkipsModelValidations:
  Enabled: false

Rails/TimeZone:
  Enabled: false
```

### ERB Lint Configuration

Create `.erb_lint.yml` (from RAILS_SETUP_GUIDE.md):

```yaml
rules:
  ClosingErbTagIndent:
    enabled: true
  FinalNewline:
    enabled: true
  SpaceAroundErbTag:
    enabled: true
  TrailingWhitespace:
    enabled: true
  RailsHelpers:
    enabled: true
  RailsLinkToWithoutHref:
    enabled: true
```

### Docker Commands

```bash
docker compose exec fullstack bin/rubocop
docker compose exec fullstack bin/rubocop -A         # Auto-fix
docker compose exec fullstack bin/rufo app/          # Format
docker compose exec fullstack bin/erb-lint app/views # Templates
docker compose exec fullstack brakeman -q            # Security
docker compose exec fullstack bundle-audit check     # CVE check
```

---

## 🧪 Elixir / Phoenix

### Credo Configuration

Create `.credo.exs` (from PHOENIX_ELIXIR_SETUP.md):

```elixir
%{
  configs: [
    %{
      name: "default",
      files: %{
        included: ["lib/", "test/"],
        excluded: ["test/support/"]
      },
      checks: [
        {Credo.Check.Readability.MaxLineLength, priority: :low, max_length: 100},
        {Credo.Check.Readability.ModuleDoc, exclude: [Mix.Tasks]},
        {Credo.Check.Refactor.CyclomaticComplexity, max_complexity: 12},
        {Credo.Check.Refactor.FunctionArity, max_arity: 5},
        {Credo.Check.Refactor.Nesting, max_nesting: 2},
      ]
    }
  ]
}
```

### Docker Commands

```bash
docker compose exec phoenix mix credo
docker compose exec phoenix mix credo --fix
docker compose exec phoenix mix format
docker compose exec phoenix mix format --check-formatted
docker compose exec phoenix mix dialyzer  # Type checking (optional)
```

---

## 🔄 Unified Linting Flow

### Pre-Commit (All Services)

```bash
# From repo root, all at once
docker compose exec -T nextjs npm run lint
docker compose exec -T nestjs npm run lint
docker compose exec -T api ruff check .
docker compose exec -T fullstack bin/rubocop
docker compose exec -T phoenix mix credo
```

### Pre-Push (With Fixing)

```bash
# Fix all issues automatically
docker compose exec -T nestjs npm run lint:fix
docker compose exec -T api ruff check . --fix
docker compose exec -T fullstack bin/rubocop -A
docker compose exec -T phoenix mix credo --fix
docker compose exec -T phoenix mix format
```

### CI/CD Pipeline

See `HOOKS_AND_AGENTS.md` for GitHub Actions configuration.

---

## 📊 Coverage Requirements

| Framework | Tool | Minimum | Target |
|-----------|------|---------|--------|
| JavaScript | Vitest/Jest | 70% | 85%+ |
| Python | Pytest + Coverage | 70% | 85%+ |
| Ruby | RSpec + SimpleCov | 80% | 90%+ |
| Elixir | ExUnit | 70% | 85%+ |

### Check Coverage

```bash
# JavaScript
docker compose exec nestjs npm run test:coverage

# Python
docker compose exec api pytest --cov=app --cov-report=html

# Ruby
docker compose exec fullstack bin/rspec --coverage

# Elixir
docker compose exec phoenix mix test --cover
```

View reports:
- JavaScript: `coverage/index.html`
- Python: `htmlcov/index.html`
- Ruby: `coverage/index.html`
- Elixir: Terminal output

---

## ⚙️ Editor Integration

### VS Code / Cursor Configuration

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    },
    "editor.formatOnSave": true
  },
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports.ruff": "explicit"
    }
  },
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": true
  }
}
```

---

## 🚨 Common Issues & Fixes

### ESLint Error: "Cannot find module"

```bash
docker compose exec nestjs npm install --save-dev @types/node
```

### Ruff: "Module not found"

```bash
docker compose exec api pip install -e .
```

### RuboCop: "Gemfile not found"

```bash
docker compose exec fullstack bundle install
```

### Credo: "Compilation failed"

```bash
docker compose exec phoenix mix compile --force
```

---

## 📋 Enforcement Strategy

1. **Local linting** - Before commit (ESLint, RuboCop, etc.)
2. **Git hooks** - Pre-commit hooks (husky + lint-staged)
3. **CI/CD pipeline** - GitHub Actions on pull request
4. **Code review** - Manual review of style + logic

---

## 🎯 Linting Rules by Severity

### Error (Must Fix)
- Type errors (mypy, TypeScript)
- Security issues (bandit, brakeman)
- Undefined variables
- Unused imports (auto-fix available)

### Warning (Should Fix)
- Complexity (McCabe, cyclomatic)
- Long functions
- Missing documentation
- Deprecated API usage

### Info (Nice to Have)
- Code style preferences
- Naming conventions
- Comment suggestions

---

## ✅ Checklist

- [ ] ESLint configured for Node services
- [ ] Prettier configured for JavaScript
- [ ] Ruff configured for Python
- [ ] MyPy configured for type checking
- [ ] RuboCop configured for Rails
- [ ] ERB Lint configured for templates
- [ ] Credo configured for Elixir
- [ ] All services run lint without errors
- [ ] Coverage checks passing (>70%)
- [ ] Git hooks setup for pre-commit linting
- [ ] CI/CD pipeline configured for linting
- [ ] Team trained on linting tools

---

**Last Updated:** 2026-04-16
**Standard:** ESLint + Ruff + RuboCop + Credo
**Coverage Target:** 85%+
**Enforcement:** Local + CI/CD
