# Ruby Gems Strategy — Comprehensive Reference

Best practices and recommended gems for Ruby projects across different domains and use cases.

---

## 📊 Gem Categories Overview

| Category | Purpose | Example Gems | When to Use |
|----------|---------|--------------|------------|
| **Web Framework** | HTTP server, routing, middleware | Rails, Sinatra, Hanami | Full-stack applications |
| **Database** | Data persistence, ORM | ActiveRecord, Sequel, DataMapper | Any data-driven application |
| **Authentication** | User identity, sessions | bcrypt, devise, omniauth | User management |
| **Authorization** | Access control, permissions | pundit, cancancan, rolify | Role-based features |
| **API Building** | REST/GraphQL endpoints, serialization | blueprinter, fast_jsonapi, graphql | API services |
| **Testing** | Test frameworks, factories, mocks | rspec, minitest, factory_bot | Quality assurance |
| **Code Quality** | Linting, formatting, analysis | rubocop, rufo, brakeman | Development workflow |
| **Performance** | Caching, optimization, monitoring | redis, memcached, skylight | Production stability |
| **Background Jobs** | Async processing, scheduling | sidekiq, good_job, sucker_punch | Async tasks |
| **File Storage** | Upload handling, cloud storage | aws-sdk-s3, shrine, carrierwave | Media management |
| **Search** | Full-text search, indexing | opensearch, elasticsearch, pg_search | Advanced search |
| **Validation** | Data validation, constraints | dry-validation, activemodel-validator | Input validation |
| **HTTP Client** | External API calls, requests | faraday, httparty, httpclient | API integration |
| **Logging** | Application logs, monitoring | logger, lograge, semantic_logger | Debugging, observability |
| **Deployment** | Release automation, servers | kamal, capistrano, puma | Production release |
| **Development** | Debugging, console tools | pry, byebug, binding_of_caller | Local development |

---

## 🎯 Core Ruby Gems by Use Case

### Web Framework

**Rails 8+ (Full-Stack)**
```ruby
gem 'rails', '~> 8.1'
gem 'puma', '>= 5.0'
gem 'propshaft'              # Asset pipeline
gem 'importmap-rails'        # JavaScript bundling
gem 'turbo-rails'            # Single-page app experience
gem 'stimulus-rails'         # JavaScript framework
```

**Sinatra (Lightweight API)**
```ruby
gem 'sinatra', '~> 4.0'
gem 'sinatra-contrib'        # Extensions
gem 'puma', '>= 5.0'
gem 'rack-cors'              # CORS middleware
```

**Hanami (Modular)**
```ruby
gem 'hanami', '~> 2.1'
gem 'hanami-router'
gem 'hanami-controller'
gem 'hanami-view'
```

---

### Database & ORM

**PostgreSQL (Recommended)**
```ruby
gem 'pg', '~> 1.5'           # PostgreSQL adapter
gem 'activerecord', '~> 8.0' # Rails ORM (if using Rails)
gem 'sequel', '~> 5.0'       # Alternative lightweight ORM
```

**Database Tools**
```ruby
gem 'pagy', '~> 9.0'         # Pagination (fast, lightweight)
gem 'kaminari'               # Alternative pagination
gem 'ransack'                # Search & filtering
gem 'paranoia'               # Soft deletes
gem 'paper_trail'            # Audit trail, versioning
gem 'migrations'             # Migration management
```

---

### Authentication & Authorization

**Authentication (Choose One)**
```ruby
gem 'bcrypt', '~> 3.1.7'     # Password hashing (minimal)
gem 'devise'                 # Full-featured auth system
gem 'rodauth'                # Lightweight, secure auth
gem 'warden'                 # Low-level authentication
```

**Authorization**
```ruby
gem 'pundit', '~> 2.4'       # Policy-based authorization
gem 'cancancan'              # Role-based access control (RBAC)
gem 'rolify', '~> 6.0'       # Dynamic role management
```

**OAuth/Multi-tenant**
```ruby
gem 'omniauth'               # Multi-provider authentication
gem 'oauth2'                 # OAuth 2.0 client
gem 'acts_as_tenant'         # Multi-tenancy
gem 'apartment'              # Database-level multi-tenancy
```

---

### API Building & Serialization

**Serialization (Choose One)**
```ruby
gem 'blueprinter', '~> 1.0'  # Fast, JSON serialization (recommended)
gem 'fast_jsonapi'           # High-performance serializer
gem 'jbuilder'               # JSON template builder (Rails)
gem 'rabl'                   # Template-based serialization
```

**API Documentation**
```ruby
gem 'rswag'                  # OpenAPI/Swagger documentation
gem 'grape-swagger'          # Swagger for Grape APIs
```

**API Framework (If Not Rails)**
```ruby
gem 'grape'                  # Lightweight REST API framework
gem 'sinatra'                # Minimalist web framework
```

---

### Testing

**Core Testing**
```ruby
gem 'rspec', '~> 3.13'       # Behavior-driven testing
gem 'rspec-rails'            # Rails integration
gem 'minitest'               # Rails default (lightweight)
```

**Factories & Fixtures**
```ruby
gem 'factory_bot', '~> 6.4'        # Object factory
gem 'factory_bot_rails'            # Rails integration
gem 'faker', '~> 3.5'              # Fake data generation
gem 'fixtures'                     # Database fixtures
```

**Mocking & Stubbing**
```ruby
gem 'webmock', '~> 3.24'     # HTTP stubbing
gem 'vcr'                    # HTTP recording/playback
gem 'sinon'                  # Spying on calls (JS-like)
gem 'mocha'                  # Mocking/stubbing library
```

**Matchers & Assertions**
```ruby
gem 'shoulda-matchers', '~> 7.0'  # One-liner tests
gem 'rspec-json_expectations'     # JSON assertion helpers
```

**Test Data Cleanup**
```ruby
gem 'database_cleaner-active_record'  # Clean test DB
```

---

### Code Quality & Linting

**Linting**
```ruby
gem 'rubocop', '~> 1.60'            # Ruby linter
gem 'rubocop-rails'                 # Rails-specific rules
gem 'rubocop-rails-omakase'         # DHH recommended style
gem 'rubocop-rspec'                 # RSpec linting
```

**Formatting**
```ruby
gem 'rufo'                   # Ruby formatter
gem 'syntax_tree'            # Ruby parser/formatter (newer)
```

**Template Linting**
```ruby
gem 'erb_lint', '~> 0.6'     # ERB/HTML linting
gem 'slim_lint'              # Slim template linting
```

**Security & Analysis**
```ruby
gem 'brakeman'               # Rails security scanner
gem 'bundler-audit'          # CVE vulnerability audit
gem 'fasterer'               # Performance anti-patterns
gem 'prosopite'              # N+1 query detection
```

**Debugging**
```ruby
gem 'debug'                  # Ruby 3.1+ debugger
gem 'pry', '~> 0.15.0'       # Interactive console
gem 'byebug'                 # Breakpoint debugging
gem 'binding_of_caller'      # Call stack inspection
gem 'better_errors'          # Enhanced error pages
```

---

### Performance & Caching

**Caching Stores**
```ruby
gem 'redis', '~> 5.0'              # Redis client
gem 'solid_cache'                  # PostgreSQL-backed cache
gem 'memcached'                    # Memcached client
gem 'dalli'                        # Memcached with pooling
```

**Performance Monitoring**
```ruby
gem 'skylight'               # Application monitoring
gem 'new_relic'              # APM monitoring
gem 'datadog'                # Observability platform
```

**Caching Helpers**
```ruby
gem 'cache_digests'          # Cache busting via digests
gem 'actionpack-page_caching' # Full-page caching
```

---

### Background Jobs & Scheduling

**Job Processors (Choose One)**
```ruby
gem 'sidekiq', '~> 7.0'      # High-performance job processor
gem 'good_job'               # Active Job based, no Redis
gem 'solid_queue'            # Rails 8 built-in, PostgreSQL-backed
gem 'delayed_job'            # Lightweight, database-backed
gem 'sucker_punch'           # In-process job processor
```

**Job Scheduling**
```ruby
gem 'sidekiq-scheduler'      # Scheduler for Sidekiq
gem 'rufus-scheduler'        # Standalone scheduler
gem 'whenever'               # Cron job abstraction
```

---

### File Storage & Upload

**File Upload**
```ruby
gem 'shrine'                 # Modern file upload system
gem 'aws-sdk-s3'             # AWS S3 integration
gem 'google-cloud-storage'   # Google Cloud Storage
```

**Image Processing**
```ruby
gem 'image_processing', '~> 1.2'  # Image manipulation
gem 'vips'                        # VIPS backend (fast)
gem 'imagemagick-ruby'            # ImageMagick (more features)
```

---

### Search & Full-Text

**Full-Text Search**
```ruby
gem 'opensearch-ruby'        # Opensearch client
gem 'elasticsearch'          # Elasticsearch client
gem 'pg_search'              # PostgreSQL full-text search
gem 'sunspot'                # Solr integration
```

**Indexing Helpers**
```ruby
gem 'searchkick'             # Elasticsearch wrapper
gem 'chewy'                  # Elasticsearch ORM
```

---

### HTTP & External APIs

**HTTP Client**
```ruby
gem 'faraday', '~> 2.0'      # HTTP client with middleware
gem 'httparty'               # HTTP client with friendly API
gem 'http'                   # Pure Ruby HTTP client
gem 'httpclient'             # Feature-rich HTTP client
```

**HTTP Utilities**
```ruby
gem 'rest-client'            # Simple REST client
gem 'typhoeus'               # Parallel HTTP requests
gem 'httpclient'             # Advanced features
```

---

### Data Validation

**Validation**
```ruby
gem 'dry-validation'         # Schema validation
gem 'activemodel'            # Rails validation
gem 'json-schema'            # JSON schema validation
```

**Type Checking**
```ruby
gem 'dry-types'              # Type system
gem 'sorbet-runtime'         # Gradual typing
```

---

### Logging & Monitoring

**Logging**
```ruby
gem 'rails_semantic_logger'  # Structured logging
gem 'lograge'                # Rails log formatter
gem 'semantic_logger'        # Semantic logging
```

**Error Tracking**
```ruby
gem 'sentry-ruby'            # Error tracking & reporting
gem 'airbrake'               # Error monitoring
gem 'raygun4ruby'            # Raygun crash reporting
```

---

### Deployment & Servers

**Application Server**
```ruby
gem 'puma', '>= 5.0'         # Default, thread-based
gem 'unicorn'                # Process-based (legacy)
gem 'thin'                   # EventMachine-based
```

**Deployment**
```ruby
gem 'kamal'                  # Docker deployment (Rails 8+)
gem 'capistrano'             # SSH-based deployment
gem 'mina'                   # Fast deployment
```

**Web Server (Rack)**
```ruby
gem 'rack', '~> 3.0'
gem 'rack-cors'              # CORS middleware
gem 'rack-timeout'           # Request timeout
```

---

### Utilities & Helpers

**Date & Time**
```ruby
gem 'activesupport'          # Rails utilities
gem 'tzinfo'                 # Timezone support
gem 'chronic'                # Natural date parsing
gem 'ice_cube'               # Recurring events
```

**Slugs & Identifiers**
```ruby
gem 'friendly_id'            # SEO-friendly slugs
gem 'nanoid'                 # Tiny unique IDs
gem 'ulid'                   # Sortable unique IDs
```

**Encryption & Security**
```ruby
gem 'bcrypt'                 # Password hashing
gem 'argon2'                 # Modern password hashing
gem 'aes'                    # AES encryption
```

**Environment Variables**
```ruby
gem 'dotenv-rails'           # .env support
gem 'figaro'                 # Config management
```

---

## 🚀 Recommended Gem Groups by Project Type

### RESTful API (No UI)

```ruby
# Core
gem 'rails', '~> 8.1'
gem 'pg'
gem 'puma'

# API
gem 'blueprinter'
gem 'rack-cors'

# Authentication
gem 'bcrypt'
gem 'jwt'
gem 'pundit'

# Jobs
gem 'sidekiq'

# Performance
gem 'redis'

# HTTP Client
gem 'faraday'

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'webmock'
  gem 'rubocop-rails-omakase'
  gem 'brakeman'
end
```

### Full-Stack Web Application

```ruby
# Core
gem 'rails', '~> 8.1'
gem 'pg'
gem 'puma'
gem 'propshaft'
gem 'importmap-rails'
gem 'turbo-rails'
gem 'stimulus-rails'

# Styling
gem 'tailwindcss-rails'

# Authentication & Authorization
gem 'bcrypt'
gem 'devise'
gem 'pundit'
gem 'rolify'

# Search & Filtering
gem 'ransack'

# Pagination
gem 'pagy'

# File Upload
gem 'shrine'
gem 'aws-sdk-s3'
gem 'image_processing'

# Caching
gem 'solid_cache'
gem 'redis'

# Jobs
gem 'solid_queue'

# Utilities
gem 'friendly_id'
gem 'pagy'

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'shoulda-matchers'
  gem 'database_cleaner-active_record'
  gem 'rubocop-rails-omakase'
  gem 'erb_lint'
  gem 'brakeman'
end

group :development do
  gem 'web-console'
  gem 'letter_opener_web'
  gem 'pry'
  gem 'better_errors'
end
```

### Lightweight Background Job Service

```ruby
# Core
gem 'rails', '~> 8.1'
gem 'pg'
gem 'puma'

# Jobs
gem 'sidekiq'
gem 'sidekiq-scheduler'

# Logging
gem 'rails_semantic_logger'

# Error Tracking
gem 'sentry-ruby'

# HTTP
gem 'faraday'

group :development, :test do
  gem 'rspec-rails'
  gem 'webmock'
  gem 'rubocop-rails-omakase'
end
```

---

## 📋 Gem Selection Criteria

When choosing a gem, consider:

1. **Maturity** — Years in development, stable API, active maintenance
2. **Community** — GitHub stars, usage in production apps, StackOverflow activity
3. **Size** — Minimal dependencies, reasonable bundle size impact
4. **Performance** — Benchmarks, memory usage, query efficiency
5. **Maintenance** — Active development, security updates, responsive maintainers
6. **License** — MIT/Apache preferred, avoid GPL for libraries
7. **Security** — No known CVEs, regular audits, security disclosure policy

---

## ⚠️ Gems to Avoid or Reconsider

| Gem | Issue | Alternative |
|-----|-------|------------|
| `devise` (on APIs) | Too much overhead for stateless auth | `bcrypt` + JWT |
| `grape` (if Rails exists) | Adds complexity, duplicate framework | Use Rails |
| `will_paginate` | Less efficient than newer alternatives | `pagy` |
| `simple_form` (if CSS framework used) | Extra abstraction layer | Tailwind directly |
| `factory_girl_rails` (name changed) | Use `factory_bot_rails` instead | `factory_bot_rails` |

---

## 🔄 Managing Gem Updates

### Weekly
```bash
bundle outdated
```

### Monthly
```bash
bundle update --conservative
bundle audit check
```

### Security Issues
```bash
bundle audit check --update
```

### Clean Unused
```bash
bundle clean
```

---

## 📊 Gemfile Best Practices

### Organization
```ruby
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.0'

# Core framework
gem 'rails', '~> 8.1'

# Database
gem 'pg'

# Authentication
gem 'bcrypt'

# API serialization
gem 'blueprinter'

# ... organized by category

group :development, :test do
  # Testing & quality
end

group :development do
  # Development only
end

group :test do
  # Test only
end
```

### Versioning Strategy

- **Patch updates** (`~> 1.2.3`) — Safe, backward compatible
- **Minor updates** (`~> 1.2`) — May have new features, usually safe
- **Major updates** (`~> 1`) — Breaking changes, requires testing
- **Exact version** (`1.2.3`) — Only for problematic gems

### Dependency Auditing

```bash
# Check for known vulnerabilities
bundle audit check

# Update and retry
bundle update
bundle audit check

# Require clean audit before commit (pre-commit hook)
```

---

## ✅ Checklist for New Projects

- [ ] Choose web framework (Rails, Sinatra, Hanami)
- [ ] Select database adapter (pg for PostgreSQL)
- [ ] Pick testing framework (RSpec or Minitest)
- [ ] Choose authentication method (bcrypt, devise, rodauth)
- [ ] Select authorization library (pundit, cancancan)
- [ ] Pick serializer (blueprinter, fast_jsonapi)
- [ ] Configure linting (rubocop, rufo, erb_lint)
- [ ] Set up security scanning (brakeman, bundler-audit)
- [ ] Choose caching solution (redis, solid_cache)
- [ ] Select job processor (sidekiq, good_job, solid_queue)
- [ ] Configure logging (rails_semantic_logger)
- [ ] Set error tracking (sentry)
- [ ] Run `bundle audit check` before deployment

---

**Last Updated:** 2026-04-16  
**Maintenance:** Review quarterly for security updates
