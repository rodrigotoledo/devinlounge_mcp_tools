# Docker Compose Configuration Template

This template shows the recommended structure for `docker-compose.yml` to manage all services (Frontend + Backend + Infrastructure).

---

## Complete `docker-compose.yml` Example

```yaml
version: '3.9'

services:
  # ============================================================================
  # INFRASTRUCTURE
  # ============================================================================
  db:
    image: postgres:16-alpine
    container_name: app_postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-app_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-dev_password}
      POSTGRES_DB: ${POSTGRES_DATABASE:-app_db}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    ports:
      - "${POSTGRES_PUBLISH_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-app_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  redis:
    image: redis:7-alpine
    container_name: app_redis
    ports:
      - "${REDIS_PUBLISH_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  # ============================================================================
  # FRONTEND SERVICES
  # ============================================================================

  nextjs:
    build:
      context: ./web-nextjs
      dockerfile: Dockerfile
      args:
        NODE_ENV: ${NODE_ENV:-development}
    container_name: app_nextjs
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:3001}
    ports:
      - "${NEXTJS_PORT:-3000}:3000"
    volumes:
      - ./web-nextjs:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - nestjs
    command: npm run dev
    networks:
      - app_network

  react:
    build:
      context: ./web-react
      dockerfile: Dockerfile
      args:
        NODE_ENV: ${NODE_ENV:-development}
    container_name: app_react
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3001}
    ports:
      - "${REACT_PORT:-5173}:5173"
    volumes:
      - ./web-react:/app
      - /app/node_modules
    depends_on:
      - nestjs
    command: npm run dev
    networks:
      - app_network

  # ============================================================================
  # BACKEND SERVICES
  # ============================================================================

  nestjs:
    build:
      context: ./backend-nestjs
      dockerfile: Dockerfile
      args:
        NODE_ENV: ${NODE_ENV:-development}
    container_name: app_nestjs
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      NESTJS_DATABASE_HOST: db
      NESTJS_DATABASE_PORT: 5432
      NESTJS_DATABASE_USER: ${POSTGRES_USER:-app_user}
      NESTJS_DATABASE_PASSWORD: ${POSTGRES_PASSWORD:-dev_password}
      NESTJS_DATABASE_NAME: ${POSTGRES_DATABASE:-app_db}
      NESTJS_REDIS_URL: ${NESTJS_REDIS_URL:-redis://redis:6379/0}
      NESTJS_JWT_SECRET: ${NESTJS_JWT_SECRET:-dev-secret-key}
    ports:
      - "${NESTJS_PORT:-3001}:3000"
    volumes:
      - ./backend-nestjs:/app
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run start:dev
    networks:
      - app_network

  api:
    build:
      context: ./backend-fastapi
      dockerfile: Dockerfile
      args:
        PYTHON_ENV: ${PYTHON_ENV:-development}
    container_name: app_fastapi
    environment:
      PYTHON_ENV: ${PYTHON_ENV:-development}
      API_DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER:-app_user}:${POSTGRES_PASSWORD:-dev_password}@db:5432/${POSTGRES_DATABASE:-app_db}
      API_REDIS_URL: ${API_REDIS_URL:-redis://redis:6379/0}
      API_SECRET_KEY: ${API_SECRET_KEY:-dev-secret-key}
      WATCHFILES_FORCE_POLLING: ${WATCHFILES_FORCE_POLLING:-true}
    ports:
      - "${FASTAPI_PORT:-8000}:8000"
    volumes:
      - ./backend-fastapi:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - app_network

  fullstack:
    build:
      context: ./backend-rails
      dockerfile: Dockerfile
    container_name: app_rails
    environment:
      RAILS_ENV: ${RAILS_ENV:-development}
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: ${POSTGRES_USER:-app_user}
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD:-dev_password}
      DATABASE_NAME: ${POSTGRES_DATABASE:-app_db}
      DATABASE_CACHE_NAME: ${POSTGRES_CACHE_DATABASE:-app_db_cache}
      REDIS_URL: ${REDIS_URL:-redis://redis:6379/1}
      SECRET_KEY_BASE: ${FULLSTACK_SECRET_KEY_BASE:-dev-secret}
    ports:
      - "${RAILS_PORT:-3000}:3000"
    volumes:
      - ./backend-rails:/app
      - bundle_cache:/usr/local/bundle
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: >
      bash -c "
        bundle check || bundle install &&
        bin/rails db:prepare &&
        bin/rails server -b 0.0.0.0
      "
    networks:
      - app_network

  fullstack-worker:
    build:
      context: ./backend-rails
      dockerfile: Dockerfile
    container_name: app_rails_worker
    environment:
      RAILS_ENV: ${RAILS_ENV:-development}
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: ${POSTGRES_USER:-app_user}
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD:-dev_password}
      DATABASE_NAME: ${POSTGRES_DATABASE:-app_db}
      DATABASE_CACHE_NAME: ${POSTGRES_CACHE_DATABASE:-app_db_cache}
      REDIS_URL: ${REDIS_URL:-redis://redis:6379/1}
      SECRET_KEY_BASE: ${FULLSTACK_SECRET_KEY_BASE:-dev-secret}
    volumes:
      - ./backend-rails:/app
      - bundle_cache:/usr/local/bundle
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: bundle exec sidekiq -c 5
    networks:
      - app_network

  phoenix:
    build:
      context: ./backend-phoenix
      dockerfile: Dockerfile
      args:
        MIX_ENV: ${MIX_ENV:-dev}
    container_name: app_phoenix
    environment:
      MIX_ENV: ${MIX_ENV:-dev}
      DATABASE_URL: ecto://${POSTGRES_USER:-app_user}:${POSTGRES_PASSWORD:-dev_password}@db:5432/${POSTGRES_DATABASE:-app_db}
      SECRET_KEY_BASE: ${PHOENIX_SECRET_KEY_BASE:-dev-secret}
    ports:
      - "${PHOENIX_PORT:-4000}:4000"
    volumes:
      - ./backend-phoenix:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: iex -S mix phx.server
    networks:
      - app_network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  bundle_cache:
    driver: local

networks:
  app_network:
    driver: bridge
```

---

## Dockerfile Templates

### Node Service (Next.js, React, NestJS)

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start dev server (or production)
CMD ["npm", "run", "dev"]
```

### Python Service (FastAPI)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### Ruby Service (Rails)

```dockerfile
FROM ruby:3.3-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    nodejs \
    npm

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
```

### Elixir Service (Phoenix)

```dockerfile
FROM elixir:1.16-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-client \
    nodejs \
    npm

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy dependency files
COPY mix.exs mix.lock ./
RUN mix deps.get

# Copy source
COPY . .

# Compile
RUN mix compile

# Expose port
EXPOSE 4000

# Start server
CMD ["iex", "-S", "mix", "phx.server"]
```

---

## Common Commands

```bash
# Build all services
docker compose build

# Start all services (foreground)
docker compose up --build

# Start detached
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f <service>  # e.g., docker compose logs -f nestjs

# Run command in service
docker compose exec <service> <command>
# Example: docker compose exec nestjs npm run test

# One-shot command (service not already running)
docker compose run --rm api pip install <package>

# Remove volumes (careful!)
docker compose down -v
```

---

## Health Checks

Services with `healthcheck` blocks (db, redis) will report healthy/unhealthy status. Use `depends_on` with `condition: service_healthy` to ensure services start only when dependencies are ready.

---

## Environment Variables

All services read from `.env` in the repo root. See `.env.example` for the full template.

---

## Networking

All services connect via `app_network` bridge network. Internal DNS resolution uses service names:
- `db` → PostgreSQL
- `redis` → Redis
- `nestjs`, `api`, `fullstack`, `phoenix` → Backend APIs

From inside containers, use service names. From the host, use `localhost:PORT`.

---

## Volumes

- **postgres_data:** PostgreSQL data (persists between restarts)
- **redis_data:** Redis data
- **bundle_cache:** Ruby gems (shared by fullstack and fullstack-worker)
- **Bind mounts:** Source code directories for live reload (watch mode)

---

## Notes

1. **Services depend on healthy DB & Redis** — they won't start until infrastructure is ready.
2. **Database migrations** run on `fullstack` container startup.
3. **Expo (React Native) is NOT in Compose** — runs on host with `npm start`.
4. **Ports can be changed** via `.env` (e.g., `NEXTJS_PORT=3001` if 3000 conflicts with Rails).

