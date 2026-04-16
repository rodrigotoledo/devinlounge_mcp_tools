# Rails Setup Guide — Comprehensive

Configuration for Rails 8+ with RSpec, RuboCop, Rufo, SimpleCov, and recommended gems.

**Rails testing baseline:** every Rails project should install and configure `rspec-rails` and `simplecov`, run tests with RSpec, and avoid Minitest as the active project workflow.

**Why Rails still creates Minitest by default:** `rails new` ships with the Rails default test stack unless you explicitly skip it. MCP can guide an AI agent, but it does not change the native behavior of the Rails generator itself.

---

## 📦 Essential Gems for Rails

### Mandatory Questions Before Creating Rails Project

Before running `rails new`, always define these decisions:

1. **Authentication approach**
  - `bcrypt` + custom sessions (default in this template)
  - `devise` only if explicitly requested
  - external/OAuth provider
2. **Authorization library**
  - `cancancan` (ability-based)
  - `pundit` (policy-based)
  - none for very small MVPs
  - choose **one** by default when authorization is needed
3. **CSS strategy**
  - `tailwindcss-rails` (latest, utility-first)
  - `simplecss` (minimal CSS via layout include)
4. **Background jobs**
  - `solid_queue` when keeping jobs DB-backed and simple
  - `sidekiq` when Redis-backed jobs and mature ecosystem are preferred
  - none initially
5. **Pagination**
  - `pagy` (preferred default)
  - `kaminari`
  - none initially
6. **Search/filtering**
  - `ransack` for admin-style filtering/forms
  - `pg_search` for PostgreSQL full-text search
  - none initially
7. **File uploads**
  - Active Storage only
  - Active Storage + `image_processing`
  - `shrine` only if the project explicitly needs it
8. **JSON/API rendering**
  - HTML-first app, no serializer gem yet
  - `jbuilder`
  - `blueprinter`
9. **Admin/backoffice**
  - none initially
  - `activeadmin`
  - `avo`
10. **Auditing/versioning**
  - none initially
  - `paper_trail`
  - `audited`
11. **Multi-tenancy**
  - none initially
  - `acts_as_tenant` when tenant scoping is clearly required

If these are not defined, the agent should ask first instead of assuming defaults.

Prefer asking these questions in two passes to avoid overload:

- **Always ask first:** authentication, authorization, styling, background jobs, pagination, and whether the app is HTML-first or API-heavy.
- **Ask when relevant:** search, uploads, admin/backoffice, auditing, and multi-tenancy.

### Creating a New Rails App Without Minitest

If you want a new Rails app to start with RSpec instead of Minitest, generate it with `--skip-test` and then install the RSpec stack:

```bash
docker compose exec fullstack bin/rails new my_app --skip-test
cd my_app
docker compose exec fullstack bundle add rspec-rails --group "development,test"
docker compose exec fullstack bundle add shoulda-matchers --group "test"
docker compose exec fullstack bundle add simplecov --group "test"
docker compose exec fullstack bundle add guard-rspec --group "development,test"
docker compose exec fullstack bin/rails generate rspec:install
docker compose exec fullstack bundle exec guard init rspec
```

If a project was created without `--skip-test`, Rails will generate `test/` and Minitest files by default. In that case, remove `test/` after installing RSpec.

### Required Testing Workflow

Always bootstrap Rails testing with Docker and keep `rspec-rails` + `simplecov` in the project:

```bash
docker compose exec fullstack bundle add rspec-rails --group "development,test"
docker compose exec fullstack bundle add shoulda-matchers --group "test"
docker compose exec fullstack bundle add simplecov --group "test"
docker compose exec fullstack bundle add guard-rspec --group "development,test"
docker compose exec fullstack bin/rails generate rspec:install
docker compose exec fullstack bundle exec guard init rspec
docker compose exec fullstack rm -rf test/  # optional cleanup if Minitest files were generated
```

Use RSpec as the only Rails test workflow and keep `rspec-rails`, `shoulda-matchers`, `simplecov`, and `guard-rspec` installed and configured by default. `guard-rspec` pulls `guard` as dependency; still run `bundle exec guard init rspec` to generate and configure `Guardfile`.

### Gemfile Template

```ruby
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.0' # or your target version

# Core Rails
gem 'rails', '~> 8.1'
gem 'puma', '>= 5.0'
gem 'propshaft'
gem 'importmap-rails'
gem 'turbo-rails'
gem 'stimulus-rails'

# Database
gem 'trilogy', '~> 2.0'
gem 'sqlite3', '>= 2.1'

# Styling
# Choose one CSS strategy:
# gem 'tailwindcss-rails'            # Tailwind latest via gem
# (or) use simplecss via CDN in layout (no gem)
gem 'rails-i18n', '~> 8.0'

# Caching & Queues
gem 'solid_cache'
gem 'solid_queue'
gem 'redis', '~> 5.0'

# API & Serialization
gem 'blueprinter', '~> 1.0'
gem 'jwt'
gem 'rack-cors'

# Authentication & Authorization
gem 'bcrypt', '~> 3.1.7'
# Choose one authorization library:
# gem 'cancancan', '~> 3.6'
# gem 'pundit', '~> 2.4'

# Multi-tenancy
gem 'acts_as_tenant', '~> 0.6'

# Data handling
gem 'pagy', '~> 9.0'           # Pagination
gem 'ransack'                  # Search/filtering
gem 'image_processing', '~> 1.2' # Image resizing

# Deployment
gem 'kamal', require: false
gem 'thruster', require: false

# Performance
gem 'bootsnap', require: false

group :development, :test do
  # Security scanning
  gem 'brakeman', require: false       # Security vulnerabilities
  gem 'bundler-audit', require: false  # CVE audit

  # Code quality
  gem 'rubocop-rails-omakase', require: false  # Omakase style
  gem 'rufo', require: false                    # Code formatter
  gem 'erb_lint', '~> 0.6', require: false     # Template linting
  gem 'prosopite', require: false              # N+1 detection

  # Testing
  gem 'rspec-rails', '~> 7.0'            # Required Rails test framework
  gem 'rails-controller-testing'
  gem 'factory_bot_rails', '~> 6.4'
  gem 'faker', '~> 3.5'
  gem 'guard-rspec', '~> 4.7', require: false

  # Debugging
  gem 'debug', platforms: %i[ mri windows ], require: 'debug/prelude'
  gem 'pry', '~> 0.15.0'
  gem 'binding_of_caller'
  gem 'better_errors'

  # Environment
  gem 'dotenv-rails'
end

group :development do
  gem 'web-console'
  gem 'letter_opener_web', '~> 3.0'  # Email preview
end

group :test do
  gem 'shoulda-matchers', '~> 7.0'   # One-liner tests
  gem 'simplecov', '~> 0.22', require: false  # Required coverage tool
  gem 'database_cleaner-active_record', '~> 2.2'
  gem 'webmock', '~> 3.24'           # HTTP stubbing
  gem 'vcr', '~> 6.3'                # Record HTTP interactions
  gem 'rspec_junit_formatter', '~> 0.6'  # CI reporting
  gem 'rspec-json_expectations'      # JSON assertions
end
```

---

## 🎯 RuboCop Configuration

### `.rubocop.yml`

```yaml
# Inherit Omakase Ruby styling for Rails
inherit_gem: { rubocop-rails-omakase: rubocop.yml }

AllCops:
  TargetRubyVersion: 3.3
  NewCops: enable
  Exclude:
    - 'bin/**/*'
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'
    - 'vendor/**/*'
    - 'tmp/**/*'
    - 'log/**/*'

# Disable noisy cops
Layout/EmptyLinesAroundBlockBody:
  Enabled: false

Layout/MultilineMethodCallIndentation:
  Enabled: false

# Metrics (reasonable limits)
Metrics/MethodLength:
  Max: 25

Metrics/BlockLength:
  Exclude:
    - 'spec/**/*'
    - 'config/routes.rb'

Metrics/ClassLength:
  Max: 200

Metrics/AbcSize:
  Max: 30

Metrics/CyclomaticComplexity:
  Max: 10

Metrics/PerceivedComplexity:
  Max: 10

# Style preferences
Style/Documentation:
  Enabled: false

Style/StringLiterals:
  EnforcedStyle: single_quotes

Style/FrozenStringLiteralComment:
  Enabled: false

Style/GuardClause:
  Enabled: false

Style/IfUnlessModifier:
  Enabled: false

# Rails-specific
Rails/SkipsModelValidations:
  Enabled: false

Rails/HasManyOrHasOneDependent:
  Enabled: false

Rails/OutputSafety:
  Enabled: false

Rails/TimeZone:
  Enabled: false

# Naming
Naming/VariableNumber:
  Enabled: false

Naming/PredicateMethod:
  Enabled: false

# Linting
Lint/UnusedMethodArgument:
  Enabled: false
```

---

## 🧪 RSpec Configuration

### `.rspec`

```
--require spec_helper
--format progress
--format RspecJunitFormatter --out rspec.xml
```

### `spec/spec_helper.rb`

```ruby
require 'simplecov'
require 'simplecov_json_formatter'

SimpleCov.start 'rails' do
  add_filter '/channels/'
  add_filter '/jobs/'
  add_filter '/mailers/'
  add_group 'Models', 'app/models'
  add_group 'Controllers', 'app/controllers'
  add_group 'Services', 'app/services'
  add_group 'Helpers', 'app/helpers'
  add_group 'Policies', 'app/policies'
end

if ENV['CI']
  SimpleCov.formatters = [
    SimpleCov::Formatter::HTMLFormatter,
    SimpleCov::Formatter::JSONFormatter
  ]
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
end
```

### `spec/rails_helper.rb`

```ruby
require 'spec_helper'
require File.expand_path('../config/environment', __dir__)

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'
require 'database_cleaner/active_record'
require 'webmock/rspec'

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].each { |f| require f }

RSpec.configure do |config|
  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  # Database Cleaner setup
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:each, type: :system) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  # Shoulda Matchers
  Shoulda::Matchers.configure do |m|
    m.integrate do |with|
      with.test_framework :rspec
      with.library :rails
    end
  end
end
```

---

## 📝 ERB Lint Configuration

### `.erb_lint.yml`

```yaml
---
exclude:
  - app/views/layouts/admin.html.erb
  - node_modules

rules:
  # Spacing & formatting
  BogusCommentDisallowed:
    enabled: true
  ClosingErbTagIndent:
    enabled: true
  ErbSafetyComments:
    enabled: false
  FinalNewline:
    enabled: true
  HardCodedString:
    enabled: false
  IndexedSearchAttributes:
    enabled: true
  InlineComments:
    enabled: false
  MultilineCond:
    enabled: true
  MultilineStatement:
    enabled: true
  NoJsTagsInPartials:
    enabled: false
  ParallelAssignment:
    enabled: false
  RailsHelpers:
    enabled: true
  RailsLinkToWithoutHref:
    enabled: true
  SelfClosingTag:
    enabled: true
  SpaceAroundErbTag:
    enabled: true
  SpaceInErbTag:
    enabled: true
  TrailingWhitespace:
    enabled: true
  UnusedIgnoreComment:
    enabled: true
```

---

## 🔧 VS Code / Cursor Setup for Rails

### `.vscode/settings.json` (Rails-specific additions)

```json
{
  "[ruby]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.codeActionsOnSave": {
      "source.fixAll.rubocop": "explicit"
    }
  },
  "[erb]": {
    "editor.defaultFormatter": "Shopify.ruby-lsp",
    "editor.formatOnSave": true
  },
  "ruby.rubocop.enable": false,
  "ruby.rubocop.useBundler": false,
  "rubyLsp.bundleGemfile": "${workspaceFolder}/backend-rails/Gemfile",
  "rubyLsp.useBundlerGemfile": true,
  "rubyLsp.linters": [],
  "rubyLsp.formatter": "none",
  "rubyLsp.logLevel": "error",
  "erb.erb-lint.enabled": false
}
```

---

## 🚀 Common Rails Development Commands

All via Docker Compose from repo root:

```bash
# Dependencies
docker compose exec fullstack bundle install
docker compose exec fullstack bundle add bcrypt

# Database
docker compose exec fullstack bin/rails db:create
docker compose exec fullstack bin/rails db:migrate
docker compose exec fullstack bin/rails db:seed
docker compose exec fullstack bin/rails generate migration AddFieldToUsers

# Code quality
docker compose exec fullstack bin/rubocop                    # Lint
docker compose exec fullstack bin/rubocop -A                 # Auto-fix
docker compose exec fullstack bin/rufo app/                  # Format (via Rufo)
docker compose exec fullstack bin/erb-lint app/views         # Template lint
docker compose exec fullstack brakeman -q                    # Security scan
docker compose exec fullstack bundle-audit check             # CVE audit

# Testing
docker compose exec fullstack bin/rspec                      # All tests
docker compose exec fullstack bin/rspec spec/models          # Models only
docker compose exec fullstack bin/rspec --format progress    # Progress format
docker compose exec fullstack bin/rspec --coverage           # With SimpleCov
docker compose exec fullstack bin/rspec spec/requests        # Requests only

# Console & debugging
docker compose exec fullstack bin/rails console
docker compose exec fullstack bin/rails routes               # View routes
docker compose exec fullstack bin/rails assets:precompile    # Compile assets

# Generation
docker compose exec fullstack bin/rails generate model User email:string
docker compose exec fullstack bin/rails generate controller Users index show
docker compose exec fullstack bin/rails generate migration CreateUsers

# Optional authorization setup (choose one)
docker compose exec fullstack bundle add cancancan
# or
docker compose exec fullstack bundle add pundit
```

---

## 📊 RSpec Structure

### Model Spec Example

```ruby
# spec/models/user_spec.rb
require 'rails_helper'

describe User do
  describe 'associations' do
    it { should have_many(:posts).dependent(:destroy) }
    it { should belong_to(:company) }
  end

  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
  end

  describe '#full_name' do
    it 'returns combined first and last name' do
      user = build(:user, first_name: 'John', last_name: 'Doe')
      expect(user.full_name).to eq('John Doe')
    end
  end
end
```

### Request Spec Example

```ruby
# spec/requests/users_spec.rb
require 'rails_helper'

describe 'Users API' do
  describe 'GET user_path' do
    context 'when user exists' do
      let(:user) { create(:user) }

      it 'returns the user' do
        get user_path(user)
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to include('email' => user.email)
      end
    end

    context 'when user does not exist' do
      it 'returns not found' do
        get user_path(999)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
```

---

## 🔍 SimpleCov Configuration

Coverage reports are generated in `coverage/` directory. View `coverage/index.html` in browser.

**Min coverage threshold** (optional, in `spec/spec_helper.rb`):

```ruby
SimpleCov.minimum_coverage 80
SimpleCov.minimum_coverage_by_file 75
```

---

## ⚙️ Rufo Configuration

Rufo is a Ruby formatter. Configure in `Gemfile`:

```ruby
group :development, :test do
  gem 'rufo', require: false
end
```

**Usage:**
```bash
docker compose exec fullstack bin/rufo app/models/user.rb       # Format single file
docker compose exec fullstack bin/rufo app/                      # Format directory
docker compose exec fullstack bin/rufo --check app/              # Check only
```

---

## 👮 Brakeman (Security Scanning)

Identify security vulnerabilities in Rails app:

```bash
docker compose exec fullstack brakeman -q                # Quiet output
docker compose exec fullstack brakeman -f json -o report.json  # JSON report
docker compose exec fullstack brakeman --ignore-model-output   # Fewer warnings
```

---

## 🛡️ Bundler Audit (CVE Checking)

Check Gemfile.lock for known CVEs:

```bash
docker compose exec fullstack bundle-audit check
docker compose exec fullstack bundle-audit update   # Update database
docker compose exec fullstack bundle-audit check --ignore CVE-XXXX  # Ignore specific CVE
```

---

## 🚨 Guard RSpec (Automatic Tests)

Auto-run tests when files change (development mode):

```bash
docker compose exec fullstack bundle exec guard
```

Configure in `Guardfile`:

```ruby
guard :rspec, cmd: 'bundle exec rspec' do
  watch('spec/spec_helper.rb') { 'spec' }
  watch(%r{^app/(.+)\.rb$}) { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^spec/(.+)_spec\.rb$})
end
```

---

## 📋 Best Practices

1. **Test-Driven Development:** Write tests first, then implementation
2. **Factory Bot:** Use factories in specs, not fixtures
3. **Faker:** Generate realistic test data
4. **WebMock/VCR:** Stub external API calls
5. **Database Cleaner:** Isolate tests with transaction rollback
6. **SimpleCov:** Always install it and aim for >80% code coverage
7. **Rubocop:** Fix style issues before committing
8. **Brakeman:** Run before each release
9. **Keep tests focused:** One behavior per test (GIVEN/WHEN/THEN pattern)
10. **Don't assert error messages:** Assert presence of error, not exact text
11. **Do not keep Minitest active:** Standardize on `rspec-rails` + `simplecov` for every Rails app
12. **Define auth/authorization first:** Decide `bcrypt` and `cancancan`/`pundit` before scaffolding user flow
13. **Define CSS first:** Decide `tailwindcss-rails` or `simplecss` before generating layout/components
14. **Prefer request specs:** Avoid controller specs for endpoint behavior unless there is a specific reason
15. **Use path helpers in specs:** Prefer `root_path`/`user_path(user)` over hardcoded route strings

---

## 🔗 Reference

- **RSpec:** https://rspec.info/
- **RuboCop:** https://rubocop.org/
- **SimpleCov:** https://github.com/simplecov-ruby/simplecov
- **Factory Bot:** https://github.com/thoughtbot/factory_bot
- **Shoulda Matchers:** https://github.com/thoughtbot/shoulda-matchers
- **Brakeman:** https://brakemanscanner.org/
- **Rails Guides:** https://guides.rubyonrails.org/

