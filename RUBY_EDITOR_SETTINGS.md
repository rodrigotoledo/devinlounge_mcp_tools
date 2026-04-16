# Ruby Editor Configuration — RuboCop, Rufo, ERB Lint

Complete VSCode/Cursor settings for Ruby on Rails projects with linting and formatting.

---

## 📋 Overview

| Tool | Purpose | Installation | Run Method | In-Editor |
|------|---------|--------------|-----------|-----------|
| **RuboCop** | Ruby linter & style checker | `gem 'rubocop'` | `docker compose exec fullstack bin/rubocop` | Navigation only |
| **Rufo** | Ruby formatter | `gem 'rufo'` | `docker compose exec fullstack bin/rufo` | ❌ Disabled |
| **ERB Lint** | HTML/ERB template linting | `gem 'erb_lint'` | `docker compose exec fullstack bin/erb-lint` | ❌ Disabled |
| **Ruby LSP** | Language server (Shopify) | VSCode extension | Built-in | ✅ Active |
| **Brakeman** | Security scanner | `gem 'brakeman'` | `docker compose exec fullstack bin/brakeman` | Manual |

---

## 🔧 VSCode Settings Configuration

### Global Ruby Settings (`.vscode/settings.json`)

```json
{
  "_comment_ruby_docker": "RuboCop, Rufo, ERB Lint, and Brakeman MUST run via Docker Compose from repo root. In-editor Ruby LSP provides navigation/definition lookup only. All linting/formatting disabled in-editor to prevent bundler conflicts.",
  
  "ruby.enable": true,
  "ruby.useBundler": false,
  "ruby.useLanguageServer": true,
  
  "_comment_ruby_lsp": "Ruby LSP from Shopify: provides go-to definition, hover info, code completion. Does not lint/format.",
  "rubyLsp.enabled": true,
  "rubyLsp.bundleGemfile": "${workspaceFolder}/backend-rails/Gemfile",
  "rubyLsp.useBundlerGemfile": true,
  "rubyLsp.linters": [],
  "rubyLsp.formatter": "none",
  "rubyLsp.logLevel": "error",
  "rubyLsp.customBundlerPath": "bundle",
  
  "_comment_rubocop": "RuboCop disabled in-editor. Run: docker compose exec fullstack bin/rubocop (and auto-fix: docker compose exec fullstack bin/rubocop -A)",
  "ruby.rubocop.enable": false,
  "ruby.rubocop.useBundler": false,
  "ruby.rubocop.configFilePath": "${workspaceFolder}/backend-rails/.rubocop.yml",
  
  "_comment_rufo": "Rufo disabled in-editor. Run: docker compose exec fullstack bin/rufo to format Ruby files",
  "ruby.rufo.enable": false,
  
  "_comment_erb_lint": "ERB Lint disabled in-editor. Run: docker compose exec fullstack bin/erb-lint to lint templates",
  "erb.erb-lint.enable": false,
  "erb.erb-lint.enabled": false,
  
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": false,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.rulers": [100, 120],
    "editor.codeActionsOnSave": {},
    "editor.wordBasedSuggestions": "off"
  },
  
  "[erb]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": false,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.wordBasedSuggestions": "off"
  },
  
  "files.associations": {
    "*.erb": "erb",
    "*.jbuilder": "ruby",
    "Gemfile*": "ruby",
    "Rakefile*": "ruby",
    "*.rake": "ruby",
    "config.ru": "ruby",
    "Procfile*": "yaml",
    ".ruby-version": "yaml",
    "Shopify.ruby-lsp": "ruby"
  },
  
  "emmet.includeLanguages": {
    "erb": "html",
    "haml": "html"
  }
}
```

---

## 📝 RuboCop Configuration

### `.rubocop.yml` (Rails Root)

```yaml
require:
  - rubocop-rails
  - rubocop-rspec

inherit_from: https://relaxed.ruby-lang.org/rubocop.yml

AllCops:
  TargetRubyVersion: 3.3
  TargetRailsVersion: 8.0
  NewCops: enable
  Exclude:
    - "bin/**/*"
    - "db/schema.rb"
    - "db/migrate/*.rb"
    - "vendor/**/*"
    - "node_modules/**/*"
    - ".git/**/*"
    - "tmp/**/*"
    - "coverage/**/*"

# Style rules
Layout/LineLength:
  Max: 100
  Exclude:
    - "db/migrate/*.rb"
    - "Gemfile"

Layout/IndentationWidth:
  Width: 2

Layout/MultilineArrayBraceLayout:
  EnforcedStyle: new_line

Layout/MultilineHashBraceLayout:
  EnforcedStyle: new_line

Layout/MultilineMethodCallBraceLayout:
  EnforcedStyle: new_line

# Naming rules
Naming/VariableNumber:
  EnforcedStyle: snake_case

Naming/MethodParameterName:
  MinNameLength: 2

# Style enforcement
Style/StringLiterals:
  EnforcedStyle: single_quotes
  Exclude:
    - "app/views/**/*"
    - "db/migrate/*.rb"

Style/StringLiteralsInInterpolation:
  EnforcedStyle: double_quotes

Style/Documentation:
  Enabled: false

Style/MethodDefParentheses:
  EnforcedStyle: require_parentheses

Style/TrailingCommaInArrayLiteral:
  EnforcedStyleForMultiline: trailing_comma

Style/TrailingCommaInHashLiteral:
  EnforcedStyleForMultiline: trailing_comma

# Performance
Performance/StringReplacement:
  Enabled: true

Performance/ReverseEach:
  Enabled: true

# Rails-specific
Rails/SkipsModelValidations:
  Blacklist:
    - update_all
    - delete_all
  Whitelist:
    - increment!
    - decrement!

Rails/CreateTableWithTimestamps:
  Enabled: false

Rails/ReflectionClassName:
  Enabled: true

Rails/AssertNothingRaised:
  Enabled: true

Rails/BulkChangeTable:
  Enabled: true

Rails/UniqBeforePluck:
  Enabled: true

Rails/SafeNavigation:
  ConvertTry: true

# RSpec specific
RSpec/ExpectActual:
  Enabled: true

RSpec/Focus:
  Enabled: true

RSpec/BeEql:
  Enabled: true

RSpec/DuplicateModuleOrConstantName:
  Enabled: true

RSpec/ImplicitSubject:
  EnforcedStyle: single_statement_only

RSpec/LeakyConstantDeclaration:
  Enabled: true

RSpec/VariableName:
  EnforcedStyle: snake_case

RSpec/FactoryBot/CreateList:
  Enabled: true

# Disabled rules that may conflict with developer intent
Metrics/BlockLength:
  Enabled: false

Metrics/ClassLength:
  Enabled: false

Metrics/MethodLength:
  Enabled: false

Metrics/ModuleLength:
  Enabled: false

Metrics/PerceivedComplexity:
  Enabled: false

Metrics/CyclomaticComplexity:
  Enabled: false

Lint/AmbiguousBlockAssociation:
  Exclude:
    - "spec/**/*"
```

---

## 🎨 Rufo Configuration

Rufo is opinionated (minimal config). Add to `Gemfile`:

```ruby
gem 'rufo', require: false  # In development group
```

**Usage:**
```bash
# Format all Ruby files
docker compose exec fullstack bin/rufo

# Format specific file
docker compose exec fullstack bin/rufo app/models/user.rb

# Check without modifying
docker compose exec fullstack bin/rufo --check

# Diff output
docker compose exec fullstack bin/rufo --diff
```

---

## 📄 ERB Lint Configuration

### `.erb-lint.yml` (Rails Root)

```yaml
---
# ERB Lint configuration
enableDefaultLinters: true

linters:
  Indentation:
    enabled: true
    indent_size: 2
    indent_char: " "

  ClosingErbTag:
    enabled: true

  ClosingErbTagIndent:
    enabled: true

  ExtraNewline:
    enabled: true

  SpaceAroundErbTag:
    enabled: true

  SpaceIndentation:
    enabled: true
    indent_size: 2

  TrailingWhitespace:
    enabled: true

  ParserErrors:
    enabled: true

  SelfClosingTag:
    enabled: false  # Too strict for Rails conventions

  MultilineTags:
    enabled: true

  BogusComments:
    enabled: true

exclude:
  - "vendor/**/*"
  - "node_modules/**/*"
  - "tmp/**/*"
```

**Usage:**
```bash
# Lint all ERB files
docker compose exec fullstack bin/erb-lint

# Lint specific file
docker compose exec fullstack bin/erb-lint app/views/users/index.html.erb

# Auto-fix issues
docker compose exec fullstack bin/erb-lint --autocorrect

# Check specific linters
docker compose exec fullstack bin/erb-lint --linter Indentation
```

---

## 🔍 Brakeman Security Scanner

Brakeman detects Rails security vulnerabilities.

**Usage:**
```bash
# Run security scan
docker compose exec fullstack bin/brakeman -q

# Generate HTML report
docker compose exec fullstack bin/brakeman -o report.html

# Only show high severity
docker compose exec fullstack bin/brakeman --confidence-level 2

# Ignore specific checks
docker compose exec fullstack bin/brakeman -i SQL,CommandInjection
```

**Configuration** (`.brakeman.yml`):

```yaml
---
:skip_checks:
  - NestedAttributesBypass
  - SelectVulnerability

:skip_files:
  - config/initializers/authentication.rb
  - app/controllers/admin_controller.rb

:safe_methods:
  - sanitize_sql
  - encode

:whitelisted_routes: []

:check_arguments: true

:assume_routes_protected: false

:faster_checks: true

:output_files:
  - report.html
  - report.json

:quiet: false
```

---

## 🚀 Command Reference

### RuboCop (Linting & Auto-fix)

```bash
# Check for issues
docker compose exec fullstack bin/rubocop

# Auto-fix issues
docker compose exec fullstack bin/rubocop -A

# Only specific cops
docker compose exec fullstack bin/rubocop --only Style/StringLiterals

# Show only offenses (no summary)
docker compose exec fullstack bin/rubocop -o

# Verbose output
docker compose exec fullstack bin/rubocop -v

# Generate report
docker compose exec fullstack bin/rubocop --format json > rubocop-report.json

# Check specific file/folder
docker compose exec fullstack bin/rubocop app/models/
```

### Rufo (Formatting)

```bash
# Format all files
docker compose exec fullstack bin/rufo

# Check without formatting
docker compose exec fullstack bin/rufo --check

# Show diff
docker compose exec fullstack bin/rufo --diff

# Format specific file
docker compose exec fullstack bin/rufo app/models/user.rb
```

### ERB Lint

```bash
# Check all ERB files
docker compose exec fullstack bin/erb-lint

# Auto-fix
docker compose exec fullstack bin/erb-lint --autocorrect

# Specific file
docker compose exec fullstack bin/erb-lint app/views/users/index.html.erb

# Only specific linters
docker compose exec fullstack bin/erb-lint --linter Indentation,TrailingWhitespace

# Show rules
docker compose exec fullstack bin/erb-lint --list-linters
```

### Brakeman (Security)

```bash
# Run security check
docker compose exec fullstack bin/brakeman -q

# Generate HTML report
docker compose exec fullstack bin/brakeman -o report.html

# Check with details
docker compose exec fullstack bin/brakeman --no-quiet

# Only high confidence
docker compose exec fullstack bin/brakeman --confidence-level 2
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Could not find gem in any source" (Bundler Error)

**Cause:** Ruby LSP trying to use system Bundler instead of Docker

**Solution:**
```json
{
  "rubyLsp.useBundlerGemfile": true,
  "rubyLsp.bundleGemfile": "${workspaceFolder}/backend-rails/Gemfile",
  "ruby.useBundler": false
}
```

### Issue: RuboCop Shows Errors, But Docker Run Passes

**Cause:** In-editor config differs from `.rubocop.yml`

**Solution:** Trust Docker result, update `.rubocop.yml`:
```bash
docker compose exec fullstack bin/rubocop --generate-todos
```

### Issue: "ERB Lint not found" in Editor

**Cause:** ERB Lint is disabled (correct), but VSCode extension still tries to run it

**Solution:**
```json
{
  "erb.erb-lint.enable": false,
  "erb.erb-lint.enabled": false
}
```

### Issue: Rufo & RuboCop Conflicts

**Cause:** Both tools trying to format at once

**Solution:** Use RuboCop only, disable Rufo in-editor:
```json
{
  "ruby.rufo.enable": false,
  "[ruby]": {
    "editor.formatOnSave": false
  }
}
```

---

## 📦 Gems to Install

**Gemfile (`backend-rails/Gemfile`):**

```ruby
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'shoulda-matchers'
  gem 'database_cleaner-active_record'
  
  # Linting & code quality
  gem 'rubocop-rails-omakase', require: false
  gem 'rubocop-rspec', require: false
  gem 'rufo', require: false
  gem 'erb_lint', '~> 0.6', require: false
  gem 'brakeman', require: false
  gem 'bundler-audit', require: false
end
```

**Install:**
```bash
docker compose exec fullstack bundle install
```

---

## 🎯 Pre-commit Hook Setup

**`.git/hooks/pre-commit` (Ruby linting):**

```bash
#!/bin/bash

echo "🔍 Running RuboCop linting..."
docker compose exec fullstack bin/rubocop app config lib --force-exclusion || exit 1

echo "✅ Running ERB Lint..."
docker compose exec fullstack bin/erb-lint --autocorrect app/views || exit 0  # Warning only

echo "🛡️ Running Brakeman security scan..."
docker compose exec fullstack bin/brakeman -q || exit 0  # Warning only

echo "✓ All checks passed!"
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## ✅ Checklist for Ruby/Rails Setup

- [ ] RuboCop gem installed: `gem 'rubocop-rails-omakase'`
- [ ] Rufo gem installed: `gem 'rufo'`
- [ ] ERB Lint gem installed: `gem 'erb_lint'`
- [ ] Brakeman gem installed: `gem 'brakeman'`
- [ ] VSCode Ruby LSP extension installed
- [ ] `.rubocop.yml` configured in `backend-rails/`
- [ ] `.erb-lint.yml` configured in `backend-rails/`
- [ ] `.vscode/settings.json` Ruby section configured
- [ ] RuboCop disabled in-editor: `"ruby.rubocop.enable": false`
- [ ] Rufo disabled in-editor: `"ruby.rufo.enable": false`
- [ ] ERB Lint disabled in-editor: `"erb.erb-lint.enable": false`
- [ ] Linting command works: `docker compose exec fullstack bin/rubocop`
- [ ] Auto-fix works: `docker compose exec fullstack bin/rubocop -A`
- [ ] Format works: `docker compose exec fullstack bin/rufo`
- [ ] ERB Lint works: `docker compose exec fullstack bin/erb-lint`
- [ ] Security scan works: `docker compose exec fullstack bin/brakeman -q`
- [ ] Tests pass: `docker compose exec fullstack bin/rspec`
- [ ] Pre-commit hooks configured

---

## 🚀 Recommended Workflow

### Daily Development

```bash
# Terminal 1: Start Rails dev server
docker compose exec fullstack bin/rails server -b 0.0.0.0 -p 3000

# Terminal 2: Run tests in watch mode
docker compose exec fullstack bin/guard

# VSCode: 
# - Ruby LSP provides navigation/hints (no linting)
# - Manual checks before commit: RuboCop, Rufo, ERB Lint
```

### Before Committing

```bash
# 1. RuboCop linting
docker compose exec fullstack bin/rubocop

# 2. Auto-fix issues
docker compose exec fullstack bin/rubocop -A

# 3. Format with Rufo
docker compose exec fullstack bin/rufo

# 4. Lint ERB templates
docker compose exec fullstack bin/erb-lint --autocorrect

# 5. Security scan
docker compose exec fullstack bin/brakeman -q

# 6. Run full test suite
docker compose exec fullstack bin/rspec

# 7. Commit (pre-commit hook will run again)
git commit -m "backend-rails: add user authentication"
```

---

## 📊 Performance Tips

1. **Ruby LSP Responsiveness:**
   - Set `rubyLsp.logLevel: "error"` to reduce noise
   - Disable unused features: `rubyLsp.linters: []`, `rubyLsp.formatter: "none"`

2. **Avoid In-Editor Linting:**
   - All linting disabled in-editor (correct approach)
   - Run via Docker for authoritative results

3. **Quick RuboCop Checks:**
   ```bash
   # Only check files you changed
   docker compose exec fullstack bin/rubocop app/models/user.rb
   
   # Auto-fix and format in one command
   docker compose exec fullstack bin/rubocop -A && docker compose exec fullstack bin/rufo
   ```

4. **Faster Feedback:**
   - Use `--fail-fast` with RuboCop to stop on first error
   - Run specific cops: `bin/rubocop --only Style/StringLiterals app/`

---

## 📚 Reference Commands

| Task | Command |
|------|---------|
| Lint code | `docker compose exec fullstack bin/rubocop` |
| Auto-fix | `docker compose exec fullstack bin/rubocop -A` |
| Format code | `docker compose exec fullstack bin/rufo` |
| Lint ERB | `docker compose exec fullstack bin/erb-lint` |
| Auto-fix ERB | `docker compose exec fullstack bin/erb-lint --autocorrect` |
| Security scan | `docker compose exec fullstack bin/brakeman -q` |
| Run tests | `docker compose exec fullstack bin/rspec` |
| Database migrate | `docker compose exec fullstack bin/rails db:migrate` |
| Database seed | `docker compose exec fullstack bin/rails db:seed` |
| Rails console | `docker compose exec fullstack bin/rails console` |

---

**Last Updated:** 2026-04-16  
**Scope:** Rails 8+, Ruby 3.3+  
**Key Tools:** RuboCop, Rufo, ERB Lint, Brakeman  
**Recommended Gems:** rubocop-rails-omakase, rspec-rails, factory_bot_rails
