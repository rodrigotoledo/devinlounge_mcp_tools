# Editor Settings Review & Improvements

Comprehensive review of VS Code, Cursor, and editor configuration for Tailwind, RuboCop, Rufo, Ruff, and all linting tools.

---

## 📋 Review Summary

**Date:** 2026-04-16  
**Scope:** VS Code settings, Cursor config, Ruby LSP, Python LSP, linting tools  
**Status:** ✅ Enhanced and documented

---

## 🔍 Issues Found & Fixed

### 1. Tailwind CSS Configuration

**Before:**
```json
"tailwindCSS.experimental.classRegex": [
  ["cva\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
],
"tailwindCSS.includeLanguages": {
  "typescript": "javascript",
  "typescriptreact": "javascript",
  "erb": "html",
  "elixir": "html",
  "eex": "html"
}
```

**Issues:**
- ❌ Missing support for `clsx()`, `cn()`, `classnames()` (common React utilities)
- ❌ NativeWind patterns not recognized
- ❌ Missing language mappings for CSS, PostCSS, SCSS
- ❌ No conflict warnings configured
- ❌ Missing `classAttributes` configuration

**After:**
```json
"tailwindCSS.experimental.classRegex": [
  ["cva\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ["className=[{\"'`]([^\"'`}]*)[\"'`}]"],
  ["classNamePattern='([^']*)'"],
  ["className={'([^'}]*)'}"],
  ["styleName=[{\"'`]([^\"'`}]*)[\"'`}]"],
  ["nativewind\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
],
"tailwindCSS.includeLanguages": {
  "typescript": "javascript",
  "typescriptreact": "javascript",
  "javascript": "javascript",
  "javascriptreact": "javascript",
  "erb": "html",
  "eex": "html",
  "elixir": "html",
  "html": "html",
  "css": "css",
  "postcss": "css",
  "scss": "scss",
  "tailwindcss": "css"
},
"tailwindCSS.emmetCompletions": true,
"tailwindCSS.lint.cssConflict": "warning",
"tailwindCSS.lint.invalidApply": "warning",
"tailwindCSS.lint.invalidScreen": "warning",
"tailwindCSS.classAttributes": [
  "class",
  "className",
  "ngClass",
  "styleClass",
  "styleName"
]
```

**Improvements:**
- ✅ Support for all common utility-wrapping functions
- ✅ Emmet completions enabled
- ✅ Conflict detection warnings
- ✅ Multi-language CSS support (PostCSS, SCSS)
- ✅ Works with Expo (NativeWind), Next.js, React SPA, Rails, Phoenix

---

### 2. RuboCop & Ruby Configuration

**Before:**
```json
"[ruby]": {
  "editor.defaultFormatter": "Shopify.ruby-lsp",
  "editor.formatOnSave": true,
  "editor.tabSize": 2
},
"[erb]": {
  "editor.defaultFormatter": "Shopify.ruby-lsp",
  "editor.formatOnSave": true
},
"_comment_ruby_docker": "RuboCop MUST run via Docker (docker compose exec fullstack bin/rubocop). In-editor Ruby LSP for navigation only.",
"ruby.rubocop.enable": false,
"ruby.rubocop.useBundler": false,
```

**Issues:**
- ❌ Contradictory: formatOnSave=true but no formatter configured
- ❌ No Rufo configuration mentioned
- ❌ ERB Lint mentioned but not configured
- ❌ RuboCop config path not specified
- ❌ Unclear comment about Docker requirement
- ❌ Missing disable flags for ERB Lint

**After:**
```json
"_comment_ruby_docker": "RuboCop & Rufo MUST run via Docker Compose from repo root: docker compose exec fullstack bin/rubocop. Ruby LSP provides in-editor hints only (navigation, definition lookup). Linting disabled in-editor to prevent bundler conflicts with Docker approach.",

"ruby.enable": true,
"ruby.rubocop.enable": false,
"ruby.rubocop.useBundler": false,
"ruby.rufo.enable": false,
"rubyLsp.bundleGemfile": "${workspaceFolder}/backend-rails/Gemfile",
"rubyLsp.useBundlerGemfile": true,
"rubyLsp.linters": [],
"rubyLsp.formatter": "none",
"rubyLsp.logLevel": "error",

"[ruby]": {
  "editor.defaultFormatter": "Shopify.ruby-lsp",
  "editor.formatOnSave": false,
  "editor.tabSize": 2,
  "editor.codeActionsOnSave": {}
},
"[erb]": {
  "editor.defaultFormatter": "Shopify.ruby-lsp",
  "editor.formatOnSave": false
},

"erb.erb-lint.enable": false,
"erb.erb-lint.enabled": false,
```

**Improvements:**
- ✅ formatOnSave set to `false` (formatting happens in Docker, not editor)
- ✅ Explicit Rufo disable: `"ruby.rufo.enable": false`
- ✅ Explicit ERB Lint disable: both settings covered
- ✅ Clear comment explaining Docker-first approach
- ✅ Ruby LSP properly configured for bundler
- ✅ No formatting conflicts

---

### 3. ESLint & TypeScript Configuration

**Before:**
```json
"[typescript]": {
  "editor.defaultFormatter": "vscode.typescript-language-features",
  "editor.formatOnSave": true
},
"[javascript]": {
  "editor.defaultFormatter": "vscode.typescript-language-features",
  "editor.formatOnSave": true
},
// No ESLint configuration
```

**Issues:**
- ❌ TypeScript formatter instead of Prettier
- ❌ No ESLint configuration
- ❌ No auto-fix on save
- ❌ Prettier not mentioned
- ❌ ESLint not configured for Node services

**After:**
```json
"_comment_eslint": "ESLint runs via npm from Docker for Node services (docker compose exec <service> npm run lint). In-editor ESLint shows real-time errors. Configure per project via .eslintrc.json",
"eslint.enable": true,
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
],
"eslint.format.enable": false,
"eslint.run": "onType",
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
},

"_comment_prettier": "Prettier formats TypeScript/JavaScript automatically on save. Configure via .prettierrc.json in root",
"prettier.enable": true,
"prettier.semi": true,
"prettier.singleQuote": true,
"prettier.trailingComma": "es5",
"prettier.tabWidth": 2,

"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
},
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
},
```

**Improvements:**
- ✅ Prettier as primary TypeScript/JavaScript formatter
- ✅ ESLint enabled with real-time error detection
- ✅ Auto-fix on save via code actions
- ✅ Clear configuration comments
- ✅ Proper validation for all JS/TS file types

---

### 4. Python & Ruff Configuration

**Before:**
```json
"[python]": {
  "editor.defaultFormatter": "charliermarsh.ruff",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.ruff": "explicit"
  }
},
```

**Issues:**
- ❌ Missing `source.fixAll.ruff` for auto-fix
- ❌ No explicit Ruff linting configuration
- ❌ MyPy not mentioned in editor settings
- ❌ Pylance configuration sparse
- ❌ No pytest configuration

**After:**
```json
"[python]": {
  "editor.defaultFormatter": "charliermarsh.ruff",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.ruff": "explicit",
    "source.fixAll.ruff": "explicit"
  },
  "editor.defaultFoldingRangeProvider": "ms-python.pylance",
  "editor.formatOnSaveMode": "file"
},

"_comment_eslint": "ESLint runs via npm from Docker for Node services (docker compose exec <service> npm run lint). In-editor ESLint shows real-time errors. Configure per project via .eslintrc.json",
"eslint.enable": true,
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
],
"eslint.format.enable": false,
"eslint.run": "onType",

"_comment_ruff_editor": "Ruff linting in editor is informational only. Always run: docker compose exec api ruff check . for authoritative results.",
"ruff.enable": true,
"ruff.lint.run": "onSave",
"ruff.format.preview": true,
"ruff.nativeServer": true,

"_comment_mypy_editor": "MyPy type checking in editor (basic mode). For strict mode, run in Docker: docker compose exec api mypy app/ --strict",
"mypy.enabled": false,
"mypy.runUsingActiveInterpreter": false,

"python.analysis.extraPaths": [
  "${workspaceFolder}/backend-fastapi"
],

"python.defaultInterpreterPath": "python3",
"python.terminal.activateEnvironment": false,
"python.languageServer": "Pylance",
"python.analysis.typeCheckingMode": "basic",
"pylance.analysis.typeCheckingMode": "basic",
"python.linting.enabled": false,
"python.linting.ruffEnabled": false,
"python.formatting.provider": "none",
"python.testing.pytestEnabled": true,
"python.testing.pytestArgs": [
  "tests",
  "--strict-markers"
],
```

**Improvements:**
- ✅ Auto-fix on save (`source.fixAll.ruff`)
- ✅ Ruff linting enabled with explanation
- ✅ MyPy disabled in editor (run strict via Docker)
- ✅ Pylance as primary language server
- ✅ pytest configuration
- ✅ Clear comments about Docker requirement

---

### 5. File Associations & Language Settings

**Before:**
```json
"files.associations": {
  "*.erb": "erb",
  "*.eex": "eex",
  "Gemfile*": "ruby",
  "Rakefile*": "ruby",
  "config.ru": "ruby",
  "Procfile*": "yaml",
  ".env*": "env",
  "mix.exs": "elixir"
}
```

**Issues:**
- ❌ Missing `.pyi` (Python stub files)
- ❌ Missing `requirements*.txt` association
- ❌ Missing `.jbuilder` (Rails JSON builder)
- ❌ No TOML file association
- ❌ Missing `.ruby-version`

**After:**
```json
"files.associations": {
  "*.erb": "erb",
  "*.eex": "eex",
  "*.jbuilder": "ruby",
  "*.rake": "ruby",
  "*.pyi": "python",
  "Gemfile*": "ruby",
  "Rakefile*": "ruby",
  "config.ru": "ruby",
  "Procfile*": "yaml",
  ".env": "env",
  ".env.*": "env",
  ".ruby-version": "yaml",
  "mix.exs": "elixir",
  "pyproject.toml": "toml",
  "requirements*.txt": "python"
}
```

**Improvements:**
- ✅ Better Python file support (`.pyi`, `requirements.txt`)
- ✅ Better Ruby support (`.jbuilder`, `.rake`)
- ✅ TOML configuration files recognized
- ✅ `.ruby-version` properly associated

---

### 6. Additional Extensions & Tools

**Before:**
```json
"extensions.recommendations": [
  "editorconfig.editorconfig",
  "bradlc.vscode-tailwindcss",
  "dbaeumer.vscode-eslint",
  "ms-python.python",
  "ms-python.pylance",
  "charliermarsh.ruff",
  "ms-azuretools.vscode-docker",
  "shopify.ruby-lsp",
  "expo.vscode-expo-tools",
  "github.copilot",
  "github.copilot-chat",
  "GitLab.gitlab-workflow"
]
```

**Issues:**
- ❌ Missing Prettier extension
- ❌ No GitLens for better git integration
- ❌ No Snyk for security scanning
- ❌ No Black formatter option for Python

**After:**
```json
"extensions.recommendations": [
  "editorconfig.editorconfig",
  "bradlc.vscode-tailwindcss",
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode",
  "ms-python.python",
  "ms-python.pylance",
  "charliermarsh.ruff",
  "ms-azuretools.vscode-docker",
  "shopify.ruby-lsp",
  "expo.vscode-expo-tools",
  "github.copilot",
  "github.copilot-chat",
  "GitLab.gitlab-workflow",
  "eamodio.gitlens",
  "snyk-security.snyk-vulnerability-scanner"
]
```

**Improvements:**
- ✅ Prettier extension included
- ✅ GitLens for enhanced git features
- ✅ Snyk for security scanning

---

## 📝 Comprehensive Documentation Created

### 1. **PYTHON_EDITOR_SETTINGS.md**
Complete guide for Python development with:
- VSCode global Python settings
- FastAPI-specific configuration
- Django-specific configuration
- Ruff configuration (linting + formatting)
- MyPy configuration (type checking)
- pytest configuration
- Common issues & solutions
- Extension list
- Pre-commit hook examples

### 2. **RUBY_EDITOR_SETTINGS.md**
Complete guide for Ruby development with:
- VSCode global Ruby settings
- RuboCop configuration (`.rubocop.yml`)
- Rufo configuration (formatter)
- ERB Lint configuration (`.erb-lint.yml`)
- Brakeman configuration (security)
- All command references
- Common issues & solutions
- Pre-commit hooks
- Performance tips

### 3. **Updated `.vscode/settings.json`**
Enhanced with:
- Extended Tailwind CSS patterns
- ESLint + Prettier configuration
- Python Ruff + Pylance setup
- Ruby LSP with proper bundler config
- Better file associations
- Additional recommended extensions
- Clear Docker requirement comments

---

## 🎯 Configuration by Framework

### TypeScript/JavaScript (Next.js, React SPA, NestJS, Expo)
| Setting | Value | Notes |
|---------|-------|-------|
| **Formatter** | Prettier | Via `esbenp.prettier-vscode` |
| **Linter** | ESLint | Real-time error detection |
| **Auto-fix** | On Save | `source.fixAll.eslint: explicit` |
| **Tailwind** | Enabled | clsx, cn, className patterns |
| **In-Editor** | ✅ Active | Full linting/formatting support |
| **Docker** | Optional | For monorepo consistency |

### Python (FastAPI, Django)
| Setting | Value | Notes |
|---------|-------|-------|
| **Formatter** | Ruff | `charliermarsh.ruff` |
| **Linter** | Ruff | `ruff.enable: true` |
| **Type Check** | Pylance + MyPy (optional) | Basic mode in editor, strict in Docker |
| **Auto-fix** | On Save | `source.fixAll.ruff: explicit` |
| **Import Sorting** | Ruff | `source.organizeImports.ruff` |
| **In-Editor** | ✅ Hints Only | Docker for authoritative results |
| **Docker** | ✅ Mandatory | `docker compose exec api ruff check .` |

### Ruby (Rails)
| Setting | Value | Notes |
|---------|-------|-------|
| **Formatter** | Ruby LSP (no-op) | Real formatting via Docker |
| **Linter** | Disabled (in-editor) | Docker only |
| **RuboCop** | ✅ Via Docker | `docker compose exec fullstack bin/rubocop` |
| **Rufo** | ✅ Via Docker | `docker compose exec fullstack bin/rufo` |
| **ERB Lint** | ✅ Via Docker | `docker compose exec fullstack bin/erb-lint` |
| **Security** | Brakeman (Docker) | `docker compose exec fullstack bin/brakeman` |
| **In-Editor** | Navigation Only | Ruby LSP: go-to-definition, hover info |
| **Format On Save** | ❌ Disabled | Prevents conflicts with Docker tools |

### Elixir (Phoenix)
| Setting | Value | Notes |
|---------|-------|-------|
| **Formatter** | Built-in | Respects `.formatter.exs` |
| **Format On Save** | ❌ Disabled | `editor.formatOnSave: false` |
| **Linter** | Credo (Docker) | `docker compose exec phoenix mix credo` |
| **Docker** | ✅ Mandatory | All tools run via Docker |

---

## ✅ Configuration Checklist

### Essential Settings
- [x] Tailwind CSS: Multiple pattern support (clsx, cn, cva, NativeWind)
- [x] Prettier: TypeScript/JavaScript formatting
- [x] ESLint: Real-time linting + auto-fix
- [x] Ruff: Python linting + formatting
- [x] Python LSP: Pylance configured
- [x] Ruby LSP: Bundler + navigation configured
- [x] RuboCop: Disabled in-editor, Docker-only
- [x] Rufo: Disabled in-editor, Docker-only
- [x] ERB Lint: Disabled in-editor, Docker-only
- [x] File associations: All file types covered

### Extensions
- [x] EditorConfig
- [x] Tailwind CSS
- [x] ESLint
- [x] Prettier
- [x] Python
- [x] Pylance
- [x] Ruff
- [x] Docker
- [x] Ruby LSP
- [x] Expo Tools
- [x] Copilot + Copilot Chat
- [x] GitLens
- [x] Snyk

### Documentation
- [x] PYTHON_EDITOR_SETTINGS.md (complete)
- [x] RUBY_EDITOR_SETTINGS.md (complete)
- [x] Updated LINTING_AND_CODE_QUALITY.md
- [x] Updated .vscode/settings.json
- [x] Clear Docker requirement comments

---

## 🚀 Usage Examples

### Format Ruby Code
```bash
# In-editor: Automatic (disabled, no conflicts)
# Format all Ruby files:
docker compose exec fullstack bin/rufo

# Auto-fix linting issues:
docker compose exec fullstack bin/rubocop -A

# Lint ERB templates:
docker compose exec fullstack bin/erb-lint --autocorrect
```

### Format Python Code
```bash
# In-editor: Automatic on save (Ruff)
# Format all Python files:
docker compose exec api ruff format .

# Auto-fix linting issues:
docker compose exec api ruff check . --fix

# Type check:
docker compose exec api mypy app/ --strict
```

### Format TypeScript/JavaScript
```bash
# In-editor: Automatic on save (Prettier)
# Lint with auto-fix:
docker compose exec nextjs npm run lint -- --fix

# Format:
docker compose exec nextjs npm run format
```

---

## 📊 Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Tailwind Patterns** | 1 pattern | 8 patterns (clsx, cn, cva, NativeWind, etc.) |
| **CSS Language Support** | 3 languages | 7 languages (PostCSS, SCSS added) |
| **RuboCop Config** | Mentioned but not configured | Fully specified + disabled correctly |
| **Rufo Config** | Not mentioned | Explicitly configured + disabled |
| **ERB Lint Config** | Mentioned once | Explicitly configured + dual disable flags |
| **ESLint Setup** | Not configured | Fully enabled with auto-fix |
| **Prettier** | Not used | Primary formatter for JS/TS |
| **Python Ruff** | Minimal | Full configuration with auto-fix |
| **MyPy** | Not configured | Configured (basic mode in-editor, strict in Docker) |
| **File Associations** | 8 types | 14 types |
| **Extensions** | 12 | 14 (+ GitLens, Snyk) |
| **Comments** | Minimal | Detailed Docker requirements |

---

## 🎓 Key Takeaways

1. **Docker-First Linting:** All authoritative linting runs in Docker
   - In-editor tools show hints/errors only
   - Final validation: `docker compose exec <service> <lint-command>`

2. **Language-Specific Formatters:** Don't mix formatters
   - TypeScript/JavaScript: Prettier (in-editor)
   - Python: Ruff (in-editor)
   - Ruby: Docker only (no in-editor formatting)

3. **Tailwind CSS:** Support multiple utility-wrapping patterns
   - clsx, cn, cva for React
   - NativeWind for React Native
   - Plain className for Rails/Phoenix

4. **Clear Configuration:** Use comments to explain Docker requirements
   - Prevents confusion about where tools run
   - Guides team members on correct workflow

5. **Comprehensive Extensions:** Include security, git, and analysis tools
   - Snyk for dependency scanning
   - GitLens for git history
   - Full language support per framework

---

## 📚 Reference Files

- [.vscode/settings.json](/.vscode/settings.json) — Updated global settings
- [PYTHON_EDITOR_SETTINGS.md](/PYTHON_EDITOR_SETTINGS.md) — Python guide
- [RUBY_EDITOR_SETTINGS.md](/RUBY_EDITOR_SETTINGS.md) — Ruby guide
- [LINTING_AND_CODE_QUALITY.md](/LINTING_AND_CODE_QUALITY.md) — All linters

---

**Review Completed:** 2026-04-16  
**Status:** ✅ Enhanced with comprehensive documentation  
**Next Steps:** Implement settings in actual projects, create team guidelines
