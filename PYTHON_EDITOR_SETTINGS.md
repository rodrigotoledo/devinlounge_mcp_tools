# Python Editor Configuration — FastAPI, Django, and Generic Python

Complete VSCode/Cursor settings for Python projects with linting, formatting, and type checking.

---

## 📋 Overview

| Tool | Purpose | Installation | Run Method |
|------|---------|--------------|-----------|
| **Ruff** | Linting + formatting (replaces Black, Flake8, isort) | `pip install ruff` | `docker compose exec api ruff check .` |
| **MyPy** | Type checking (optional, basic mode default) | `pip install mypy` | `docker compose exec api mypy app/` |
| **Pylance** | VSCode language server + type hints | Extension | Built-in |
| **pytest** | Testing framework | `pip install pytest` | `docker compose exec api pytest` |
| **Black** | Code formatter (alternative to Ruff) | `pip install black` | Docker only |
| **autopep8** | Auto-formatting (alternative) | `pip install autopep8` | Docker only |

---

## 🔧 VSCode Settings Configuration

### Global Python Settings (`.vscode/settings.json`)

```json
{
  "_comment_python_core": "Python runtime MUST be via Docker Compose. In-editor tools show hints only.",
  
  "python.enable": true,
  "python.defaultInterpreterPath": "python3",
  "python.terminal.activateEnvironment": false,
  "python.terminal.executeInFileDir": false,
  "python.terminal.focusAfterLaunch": false,
  
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports.ruff": "explicit",
      "source.fixAll.ruff": "explicit"
    },
    "editor.formatOnSaveMode": "file",
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.rulers": [100],
    "editor.wordBasedSuggestions": "off"
  },
  
  "python.languageServer": "Pylance",
  "python.analysis.typeCheckingMode": "basic",
  "pylance.analysis.typeCheckingMode": "basic",
  "python.analysis.logLevel": "Information",
  "python.linting.enabled": false,
  "python.linting.ruffEnabled": false,
  "python.formatting.provider": "none",
  
  "python.analysis.extraPaths": [
    "${workspaceFolder}/backend-fastapi",
    "${workspaceFolder}"
  ],
  
  "python.analysis.stubPath": "${workspaceFolder}/.stubs",
  "python.analysis.ignoreMissingImports": false,
  "python.analysis.diagnosticMode": "workspace",
  
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": false,
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": [
    "tests",
    "--strict-markers"
  ],
  
  "_comment_ruff_editor": "Ruff linting in editor is informational only. Always run: docker compose exec api ruff check . for authoritative results.",
  "ruff.enable": true,
  "ruff.lint.run": "onSave",
  "ruff.format.preview": true,
  "ruff.nativeServer": true,
  
  "_comment_mypy_editor": "MyPy type checking in editor (basic mode). For strict mode, run in Docker: docker compose exec api mypy app/ --strict",
  "mypy.enabled": false,
  "mypy.runUsingActiveInterpreter": false,
  "mypy.dmypyStatus": true,
  
  "files.associations": {
    "*.env": "env",
    "*.env.*": "env",
    "*.pyi": "python",
    "pyproject.toml": "toml",
    "requirements*.txt": "python"
  }
}
```

---

## 🎯 Framework-Specific Settings

### FastAPI Project Configuration

**Directory structure:**
```
backend-fastapi/
├── app/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── dependencies.py
│   └── config.py
├── tests/
├── migrations/
├── pyproject.toml
├── requirements.txt
└── .env.example
```

**Additional `.vscode/settings.json` for FastAPI:**

```json
{
  "python.analysis.extraPaths": [
    "${workspaceFolder}/backend-fastapi/app",
    "${workspaceFolder}/backend-fastapi"
  ],
  
  "python.testing.pytestArgs": [
    "tests",
    "-v",
    "--strict-markers",
    "--tb=short"
  ],
  
  "python.linting.enabled": false,
  
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports.ruff": "explicit",
      "source.fixAll.ruff": "explicit"
    },
    "editor.tabSize": 4
  }
}
```

**`.pylintrc` (if using Pylint instead of Ruff, optional):**

```ini
[MASTER]
load-plugins=pylint_django
django-settings-module=backend-fastapi.settings

[MESSAGES CONTROL]
disable=
    missing-module-docstring,
    missing-function-docstring,
    line-too-long

[FORMAT]
max-line-length=100
indent-string='    '

[DESIGN]
max-attributes=7
max-arguments=5
```

---

### Django Project Configuration

**Directory structure:**
```
backend-django/
├── manage.py
├── project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   ├── products/
│   └── orders/
├── tests/
├── static/
├── templates/
├── requirements.txt
└── .env.example
```

**Additional `.vscode/settings.json` for Django:**

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend-django/venv/bin/python",
  
  "python.analysis.extraPaths": [
    "${workspaceFolder}/backend-django"
  ],
  
  "python.linting.enabled": false,
  
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports.ruff": "explicit",
      "source.fixAll.ruff": "explicit"
    },
    "editor.tabSize": 4
  },
  
  "python.testing.pytestArgs": [
    "tests",
    "-v",
    "--reuse-db",
    "--nomigrations"
  ],
  
  "files.associations": {
    "*.env": "env",
    "manage.py": "python"
  }
}
```

---

## 🚀 Ruff Configuration (`pyproject.toml`)

Ruff is the recommended linter/formatter for Python projects. Configure in `pyproject.toml`:

```toml
[tool.ruff]
target-version = "py311"
line-length = 100
indent-width = 4

[tool.ruff.lint]
select = [
    "E",      # Pycodestyle errors
    "W",      # Pycodestyle warnings
    "F",      # Pyflakes
    "I",      # isort
    "C",      # flake8-comprehensions
    "B",      # flake8-bugbear
    "UP",     # pyupgrade
    "RUF",    # Ruff-specific rules
]
ignore = [
    "E501",   # Line too long (handled by formatter)
    "W191",   # Indentation contains tabs
]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]  # Unused imports in __init__
"tests/**" = ["F841"]     # Unused variables in tests

[tool.ruff.lint.isort]
known-first-party = ["app", "tests"]
known-django = ["django"]
sections = ["FUTURE", "STDLIB", "DJANGO", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"
```

---

## 📝 MyPy Configuration (Optional, for Type Checking)

For strict type checking, configure MyPy in `pyproject.toml`:

```toml
[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = false
disallow_incomplete_defs = false
check_untyped_defs = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
strict_equality = true

[tool.mypy-tests.*]
ignore_errors = true

[tool.mypy-migrations.*]
ignore_errors = true
```

**Run locally (in Docker):**
```bash
docker compose exec api mypy app/ --strict
```

---

## 🧪 Pytest Configuration

Configure Pytest in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short --strict-markers"
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "slow: Slow running tests",
    "django: Django-specific tests",
]
filterwarnings = [
    "ignore::DeprecationWarning",
    "ignore::PendingDeprecationWarning",
]
```

**Run tests:**
```bash
# All tests
docker compose exec api pytest

# Specific test file
docker compose exec api pytest tests/test_users.py

# With coverage
docker compose exec api pytest --cov=app --cov-report=html

# Watch mode (if pytest-watch installed)
docker compose exec api ptw
```

---

## 🔍 Linting Command Reference

### Ruff

```bash
# Check for linting errors
docker compose exec api ruff check .

# Auto-fix fixable errors
docker compose exec api ruff check . --fix

# Format code
docker compose exec api ruff format .

# Detailed output
docker compose exec api ruff check . --show-fixes --statistics

# Specific rule
docker compose exec api ruff check . --select E,W,F
```

### MyPy

```bash
# Basic type checking
docker compose exec api mypy app/

# Strict mode
docker compose exec api mypy app/ --strict

# Specific file
docker compose exec api mypy app/models.py

# Show error codes
docker compose exec api mypy app/ --show-error-codes
```

### Pytest

```bash
# Run all tests
docker compose exec api pytest

# Verbose output
docker compose exec api pytest -v

# Show print statements
docker compose exec api pytest -s

# Specific test
docker compose exec api pytest tests/test_users.py::test_create_user

# Coverage report
docker compose exec api pytest --cov=app --cov-report=html

# Markers
docker compose exec api pytest -m unit

# Stop on first failure
docker compose exec api pytest -x

# Last N failures
docker compose exec api pytest --lf
```

---

## 🛠️ Common Issues & Solutions

### Issue: "ModuleNotFoundError" in Editor

**Cause:** Pylance can't find Python modules

**Solution:**
```json
{
  "python.analysis.extraPaths": [
    "${workspaceFolder}/backend-fastapi",
    "${workspaceFolder}/backend-fastapi/app"
  ]
}
```

### Issue: Ruff Linter Disabled in Editor

**Cause:** Settings have `"ruff.enable": false`

**Solution:**
```json
{
  "ruff.enable": true,
  "ruff.lint.run": "onSave"
}
```

### Issue: Formatter Conflicts (Black vs Ruff)

**Cause:** Multiple formatters configured

**Solution:** Use only Ruff:
```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  }
}
```

### Issue: MyPy Shows Too Many Errors

**Cause:** Type checking mode set to "strict"

**Solution:** Use "basic" mode:
```json
{
  "python.analysis.typeCheckingMode": "basic",
  "pylance.analysis.typeCheckingMode": "basic"
}
```

### Issue: Pytest Discovery Not Working

**Cause:** Wrong path or naming convention

**Solution:**
```json
{
  "python.testing.pytestArgs": [
    "tests",
    "-v",
    "--tb=short"
  ],
  "python.testing.pytestEnabled": true
}
```

---

## 📦 Extensions to Install

Essential VSCode extensions for Python development:

```json
{
  "extensions.recommendations": [
    "ms-python.python",
    "ms-python.pylance",
    "charliermarsh.ruff",
    "ms-python.black-formatter",
    "ms-python.vscode-pylance",
    "ms-azuretools.vscode-docker",
    "ms-azuretools.vscode-azureappservice",
    "github.copilot",
    "eamodio.gitlens",
    "sonarsource.sonarlint-vscode"
  ]
}
```

**Installation:**
```bash
code --install-extension ms-python.python
code --install-extension ms-python.pylance
code --install-extension charliermarsh.ruff
```

---

## 🎯 Pre-commit Hook Setup

Add pre-commit linting to prevent bad commits:

**`.git/hooks/pre-commit` (in Docker):**

```bash
#!/bin/bash

echo "Running Ruff linting..."
docker compose exec api ruff check . || exit 1

echo "Running MyPy type checking..."
docker compose exec api mypy app/ --no-error-summary || exit 0  # Warning only

echo "Running tests..."
docker compose exec api pytest --tb=short || exit 1

echo "✓ All checks passed!"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## ✅ Checklist for Python Project Setup

- [ ] Ruff installed: `pip install ruff`
- [ ] pytest installed: `pip install pytest`
- [ ] VSCode Pylance extension installed
- [ ] VSCode Ruff extension installed
- [ ] `pyproject.toml` configured with Ruff settings
- [ ] `pyproject.toml` configured with pytest settings
- [ ] `.vscode/settings.json` Python section configured
- [ ] `[python]` language defaults set in VSCode
- [ ] Interpreter path points to virtual environment
- [ ] Extra paths configured for module discovery
- [ ] Linting command works: `docker compose exec api ruff check .`
- [ ] Formatting command works: `docker compose exec api ruff format .`
- [ ] Tests run: `docker compose exec api pytest`
- [ ] Type checking (optional): `docker compose exec api mypy app/`
- [ ] Pre-commit hooks configured
- [ ] No linting/formatting conflicts in editor

---

## 🚀 Recommended Workflow

### For FastAPI Development

```bash
# Terminal 1: Start FastAPI dev server
docker compose exec api uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Run tests in watch mode
docker compose exec api ptw

# VSCode: File changes trigger auto-formatting and linting hints
```

### For Django Development

```bash
# Terminal 1: Start Django dev server
docker compose exec django python manage.py runserver 0.0.0.0:8000

# Terminal 2: Run tests in watch mode
docker compose exec django pytest --watch

# VSCode: File changes trigger auto-formatting and linting hints
```

---

## 📊 Performance Tips

1. **Disable slow linters in editor:**
   - MyPy in editor: `"mypy.enabled": false`
   - Only run strict checks via Docker: `docker compose exec api mypy app/ --strict`

2. **Use Ruff instead of Pylint:**
   - Ruff is 20-100x faster
   - Replaces multiple tools: Flake8, Black, isort, etc.

3. **Pylance analysis mode:**
   - Use "basic" for fastest response
   - "strict" mode slow for large codebases

4. **Exclude heavy directories:**
   ```json
   {
     "python.analysis.exclude": ["**/node_modules", "**/.venv", "**/dist"]
   }
   ```

---

## 📚 Reference Commands

| Task | Command |
|------|---------|
| Lint code | `docker compose exec api ruff check .` |
| Fix linting | `docker compose exec api ruff check . --fix` |
| Format code | `docker compose exec api ruff format .` |
| Type check | `docker compose exec api mypy app/ --strict` |
| Run tests | `docker compose exec api pytest` |
| Test with coverage | `docker compose exec api pytest --cov=app` |
| Install deps | `docker compose exec api pip install -r requirements.txt` |
| Create migration | `docker compose exec api alembic revision --autogenerate -m "description"` |
| Run migrations | `docker compose exec api alembic upgrade head` |

---

**Last Updated:** 2026-04-16  
**Scope:** FastAPI, Django, generic Python projects  
**Python Version:** 3.11+  
**Key Tools:** Ruff, Pylance, pytest, MyPy (optional)
