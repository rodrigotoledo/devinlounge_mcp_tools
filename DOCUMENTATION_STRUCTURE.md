# Documentation Structure & Best Practices

Every project must have comprehensive documentation in English without abbreviations or shortcuts.

---

## 📁 Required Documentation Directory

Create `docs/` directory in each service:

```
backend-nestjs/
├── docs/
│   ├── README.md                    # Overview
│   ├── ARCHITECTURE.md              # System design
│   ├── API.md                       # API endpoints reference
│   ├── DEVELOPMENT.md               # Dev setup & workflow
│   ├── TESTING.md                   # Test strategy
│   ├── DEPLOYMENT.md                # Release process
│   ├── TROUBLESHOOTING.md           # Common issues & solutions
│   ├── REFACTORING_IDEAS.md         # Planned improvements
│   └── DECISIONS.md                 # Architecture decision records (ADRs)

backend-rails/
├── docs/
│   ├── README.md
│   ├── MODELS.md                    # Database schema & relationships
│   ├── CONTROLLERS.md               # Controller documentation
│   ├── JOBS.md                      # Background jobs (Sidekiq)
│   ├── DATABASE.md                  # Schema migrations
│   ├── CACHING_STRATEGY.md          # Solid Cache & Redis usage
│   ├── DEPLOYMENT.md
│   ├── REFACTORING_IDEAS.md
│   └── DECISIONS.md

web-nextjs/
├── docs/
│   ├── README.md
│   ├── ROUTING.md                   # App Router structure
│   ├── COMPONENTS.md                # Component guide
│   ├── STATE_MANAGEMENT.md          # Zustand stores
│   ├── API_INTEGRATION.md           # Backend integration
│   ├── STYLING.md                   # Tailwind usage
│   ├── PERFORMANCE.md               # Optimization techniques
│   ├── REFACTORING_IDEAS.md
│   └── DECISIONS.md

expo-mobile/
├── docs/
│   ├── README.md
│   ├── SCREENS.md                   # Navigation structure
│   ├── COMPONENTS.md                # Component library
│   ├── STATE_MANAGEMENT.md          # Zustand stores
│   ├── API_INTEGRATION.md
│   ├── DEPLOYMENT.md                # EAS build & submission
│   ├── PERFORMANCE.md               # Battery, memory optimization
│   ├── REFACTORING_IDEAS.md
│   └── DECISIONS.md
```

---

## 📖 Documentation Files Explained

### `docs/README.md` — Service Overview

**Purpose:** Quick introduction to the service

**Template:**

```markdown
# Service Name

Brief description of what this service does.

## Overview

2-3 paragraph overview of the service's purpose and main responsibilities.

## Technology Stack

- Framework: [version]
- Language: [version]
- Database: [PostgreSQL, MongoDB, etc.]
- Cache: [Redis, Memcached, etc.]
- Key dependencies: [list main packages]

## Quick Start

```bash
# Installation
docker compose exec <service> <install-command>

# Running tests
docker compose exec <service> <test-command>

# Development
docker compose exec <service> <start-command>
```

## Directory Structure

```
src/
├── main/               # Entry point
├── modules/            # Feature modules
├── services/           # Business logic
├── controllers/        # HTTP handlers
├── models/             # Database models
└── tests/              # Test files
```

## Documentation

- [Architecture](./ARCHITECTURE.md) — System design & patterns
- [Development](./DEVELOPMENT.md) — Setup & workflow
- [API Reference](./API.md) — Endpoints & responses
- [Testing Strategy](./TESTING.md) — How we test
- [Deployment](./DEPLOYMENT.md) — Release process
- [Troubleshooting](./TROUBLESHOOTING.md) — Common issues
- [Refactoring Ideas](./REFACTORING_IDEAS.md) — Planned improvements
- [Architecture Decisions](./DECISIONS.md) — Why we chose things

## Key Concepts

### Authentication

Describe how authentication works in this service.

### Authorization

Describe how authorization/permissions work.

### Caching

Describe caching strategy.

## Common Tasks

### Creating a new feature

Steps to add a new feature in this service.

### Running migrations

How to create and run database migrations.

### Debugging

Tips for debugging issues in this service.

## Contributing

See [Development Guide](./DEVELOPMENT.md) for contribution guidelines.

## Support

- **Issues:** Report in [GitHub Issues](link)
- **Questions:** Ask in [Slack channel](link)
```

### `docs/ARCHITECTURE.md` — System Design

**Purpose:** Explain the system design, patterns, and key decisions

**Template:**

```markdown
# Architecture

## Overview

High-level explanation of how this service is organized.

## Layered Architecture

```
┌─────────────────────────┐
│   HTTP Controllers      │  Request handling
├─────────────────────────┤
│   Services              │  Business logic
├─────────────────────────┤
│   Repositories          │  Data access
├─────────────────────────┤
│   Database              │  Persistence
└─────────────────────────┘
```

## Design Patterns

### Module Organization

Describe how modules/packages are organized.

### Dependency Injection

How dependencies are managed and injected.

### Error Handling

Strategy for handling and propagating errors.

### Logging

Logging approach and where logs go.

## Key Components

### UserModule

- Purpose: User management
- Controllers: UserController
- Services: UserService, AuthenticationService
- Models: User, Role

### OrderModule

- Purpose: Order processing
- Controllers: OrderController
- Services: OrderService, PaymentService
- Models: Order, OrderItem

## Data Flow

Diagram or description of how data flows through the system.

## Scalability Considerations

How this service scales horizontally/vertically.

## Security Architecture

Authentication, authorization, encryption strategies.
```

### `docs/DEVELOPMENT.md` — Getting Started

**Purpose:** Setup instructions and development workflow

**Template:**

```markdown
# Development Guide

## Local Setup

### Prerequisites

- Docker & Docker Compose
- [Language runtime if needed]
- [Database tools if needed]

### Initial Setup

```bash
# Clone and navigate
git clone <repo> && cd <repo>

# Create environment file
./scripts/sync-env-from-example.sh

# Start services
docker compose up --build

# Run migrations
docker compose exec <service> <migration-command>

# Verify
docker compose exec <service> <test-command>
```

## Development Workflow

### Creating a Feature

1. Create feature branch: `git checkout -b feature/short-description`
2. Make changes in logical commits
3. Write tests for new functionality
4. Run tests and linting: `docker compose exec <service> test`
5. Push and open pull request to `develop`

### Code Style

- Language: [Use standard conventions]
- Formatter: [Prettier, Black, RuboCop, etc.]
- Linter: [ESLint, Ruff, RuboCop, etc.]

Run before committing:

```bash
docker compose exec <service> lint
docker compose exec <service> format
```

### Testing

Write tests for all new code:

```bash
# Run all tests
docker compose exec <service> test

# Run specific test file
docker compose exec <service> test spec/models/user_spec.rb

# Watch mode (if supported)
docker compose exec <service> test --watch
```

### Debugging

```bash
# Start debug console
docker compose exec <service> console

# Add breakpoint in code with `debugger` (JS) or `binding.pry` (Ruby)
# Execution pauses at breakpoint in console
```

## Useful Commands

| Task | Command |
|------|---------|
| Install dependency | `docker compose exec <service> install <package>` |
| Create migration | `docker compose exec <service> generate migration Name` |
| Run migrations | `docker compose exec <service> migrate` |
| Rollback migration | `docker compose exec <service> rollback` |
| Database console | `docker compose exec <service> console` |
| Clear cache | `docker compose exec <service> cache:clear` |
| Run tests | `docker compose exec <service> test` |
| Check linting | `docker compose exec <service> lint` |

## Troubleshooting

### Service won't start

```bash
# Check logs
docker compose logs <service>

# Rebuild
docker compose build --no-cache <service>
```

### Tests failing

```bash
# Run with verbose output
docker compose exec <service> test --verbose

# Reset test database
docker compose exec <service> test:reset
```

## Git Workflow

See [GIT_FLOW.md](../GIT_FLOW.md) for branching strategy.

## Questions?

Ask in [Slack](#) or create an [issue](link).
```

### `docs/REFACTORING_IDEAS.md` — Technical Debt Tracking

**Purpose:** Document improvements, known issues, and refactoring opportunities

**Template:**

```markdown
# Refactoring Ideas & Technical Improvements

Track improvements, performance optimizations, and refactoring opportunities here.

## High Priority (Current Sprint)

### [Title of Refactoring]

**Status:** In Progress / Planned / Blocked  
**Priority:** High  
**Effort:** [Small/Medium/Large]  
**Owner:** [@person]  

**Description:**
Detailed explanation of what needs to be refactored and why.

**Current Implementation:**
```
Code snippet showing current approach
```

**Proposed Approach:**
```
Code snippet showing proposed improvement
```

**Benefits:**
- Improved performance by X%
- Reduced complexity
- Better maintainability

**Blockers:**
- Any dependencies or issues preventing this work

**Related Issues:** #123, #456

---

## Medium Priority (Backlog)

### Extract authentication logic to shared service

**Status:** Planned  
**Effort:** Medium  

**Description:**
Currently each module handles its own auth logic. Should be consolidated.

**Benefits:**
- Single source of truth
- Easier to update auth strategy globally
- Reduced duplication

---

## Low Priority (Future)

### Migrate from Sequelize to Prisma

**Status:** Research  
**Effort:** Large  

**Description:**
Evaluate migration to Prisma ORM for better type safety.

**Pros:**
- Better TypeScript integration
- Cleaner API

**Cons:**
- Large refactoring effort
- Learning curve

---

## Performance Optimizations

### Query optimization

- Current: N+1 query issue in order list endpoint
- Impact: 500+ ms response time with 100 orders
- Proposed: Add database joins, implement query result caching
- Status: Planned for Q2

### Database indexing

- Missing indexes on frequently queried columns
- Add: `created_at`, `user_id`, `status` in orders table
- Status: In Progress

### Caching strategy

- Cache user roles (currently queried on every request)
- Cache frequently accessed reference data
- Status: Planned

---

## Code Quality

### Reduce model complexity

- User model has 50+ methods
- Should extract to services/concerns
- Effort: Medium
- Status: Planned

### Improve error handling

- Currently throwing generic errors
- Should return structured error responses
- Effort: Small
- Status: Planned

---

## Dependencies

### Update outdated packages

Check `npm outdated`, `pip list --outdated`, etc.

- Node: [List outdated packages]
- Python: [List outdated packages]
- Ruby: [List outdated packages]

### Remove unused dependencies

- Unused package X (found in #123)
- Remove package Y (functionality moved elsewhere)

---

## Documentation

### Improve API documentation

- Add response schema examples
- Document error codes
- Add rate limiting info

### Add architecture diagrams

- Database schema diagram
- Request flow diagram
- Module dependency graph

---

## Testing

### Increase test coverage

Current coverage: [X%]
Target: [Y%]

- Add integration tests for critical paths
- Add E2E tests for user workflows
- Improve mocking strategies

### Performance testing

- Benchmark key endpoints
- Load testing before release
- Monitor in production

---

## Completed Refactorings

✅ [Completed refactoring] - Merged in PR #456  
✅ [Another completed refactoring] - Merged in PR #789

---

## Notes

- Regular review (monthly) of this list
- Prioritize based on impact/effort ratio
- Keep track of blockers and dependencies
- Link to related GitHub issues for tracking
```

### `docs/DECISIONS.md` — Architecture Decision Records (ADRs)

**Purpose:** Document important decisions and their rationale

**Template:**

```markdown
# Architecture Decision Records

Record important decisions about technology, patterns, and design.

## ADR-001: Use Zustand for State Management

**Date:** 2026-04-16  
**Status:** Accepted  
**Decision Makers:** [Names]  

### Context

The application needs state management for managing user data, authentication state, and UI state across multiple components.

### Options Considered

1. **Redux** - Mature, well-documented, large boilerplate
2. **Zustand** - Lightweight, less boilerplate, smaller bundle
3. **Jotai** - Atomic, similar to Zustand, newer
4. **Context API** - Built-in, but prop drilling issues at scale

### Decision

**Zustand** - Lightweight state management with minimal boilerplate.

### Rationale

- Smaller bundle size (important for mobile)
- Less boilerplate than Redux
- Easy to learn and use
- Good TypeScript support
- Sufficient for our use case (we don't need time-travel debugging)

### Consequences

**Positive:**
- Smaller JavaScript bundle
- Faster development iteration
- Less code to maintain

**Negative:**
- Dev tools less mature than Redux
- Smaller community than Redux
- May need to migrate if requirements grow significantly

### Related Issues

#42, #53

---

## ADR-002: Use RSpec Only (No Minitest) for Rails

**Date:** 2026-04-16  
**Status:** Accepted  

### Context

Rails ships with Minitest by default, but we need to choose a testing framework.

### Options Considered

1. **Minitest** - Default, simpler, fewer dependencies
2. **RSpec** - More expressive, better documentation, larger community

### Decision

**RSpec** - Only RSpec for all Rails testing.

### Rationale

- More readable test syntax (Given/When/Then pattern)
- Better for behavior-driven development
- Larger community and more resources
- Better integration with testing gems (Factory Bot, Shoulda Matchers)

### Consequences

**Positive:**
- Better test readability for team members
- More gems available for testing
- Better documentation and community support

**Negative:**
- Slightly slower test execution vs Minitest
- More dependencies to maintain
- Slight learning curve for developers new to RSpec

---

## ADR-003: Monolithic Rails App (vs Microservices)

**Date:** 2026-04-16  
**Status:** Accepted  

### Context

Deciding on architecture: monolithic vs microservices for Rails backend.

### Decision

**Monolithic** - Single Rails application for now.

### Rationale

- Simpler to develop and deploy
- Easier debugging and monitoring
- Faster request handling (no inter-service communication)
- Sufficient for current scale

### Migration Path

- Use Rails engines or services for clear separation
- Can migrate to microservices later if needed
- Design with modularity in mind

---

## ADR-004: PostgreSQL with Solid Cache

**Date:** 2026-04-16  
**Status:** Accepted  

### Context

Need persistent caching for Rails fragments and sessions.

### Options Considered

1. **Redis** - Fast, in-memory, typical choice
2. **Solid Cache** - PostgreSQL-backed, simpler ops
3. **Memcached** - Legacy, less common now

### Decision

**Solid Cache** with PostgreSQL.

### Rationale

- One fewer service to operate (cache in same DB as app)
- Data persistence without separate Redis service
- Good enough performance for our scale
- Simpler deployment

### Trade-offs

- Slower than Redis (but still sufficient)
- Requires database cleanup job (included with Solid Cache)
- Works well for medium scale; may need Redis at higher scale

---

## Template for New Decisions

```markdown
## ADR-XXX: [Decision Title]

**Date:** YYYY-MM-DD  
**Status:** Proposed / Accepted / Deprecated  
**Decision Makers:** [Names]  

### Context

[Background: What problem are we solving?]

### Options Considered

1. Option A - [Brief description]
2. Option B - [Brief description]
3. Option C - [Brief description]

### Decision

**[Chosen Option]**

### Rationale

[Why we chose this option]

### Consequences

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Trade-off 1]
- [Trade-off 2]

### Future Review

[When/how we'll revisit this decision]

### Related Issues

#issue-number
```

---

## Documentation Guidelines

### Writing Style

✅ **DO:**
- Write in English
- Use complete words (not abbreviations)
- Use clear, simple language
- Include examples and code snippets
- Include links to related docs

❌ **DON'T:**
- Use abbreviations (cat, st, config → category, style, configuration)
- Use jargon without explanation
- Write very long paragraphs
- Use "etc." without specifics
- Write in other languages

### Code Examples

Always include language/framework:

```typescript
// Good: Specifies TypeScript
const getUserById = (id: string): Promise<User> => {
  return api.get(`/users/${id}`);
};
```

```python
# Good: Specifies Python
def get_user_by_id(user_id: str) -> dict:
    return api.get(f"/users/{user_id}")
```

### Formatting

- Use markdown headers for structure
- Use tables for comparisons
- Use code blocks for examples
- Use lists for multiple items
- Include diagrams when helpful (ASCII art or embedded images)

---

## Updating Documentation

- Update docs when code changes
- Review docs quarterly
- Keep REFACTORING_IDEAS.md current
- Link docs from code comments when relevant
- Keep examples working and current

