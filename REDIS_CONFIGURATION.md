# Redis Configuration — Complete Setup

Redis integration for Rails 8+ with Turbo Streams, caching, sessions, and background jobs.

---

## 🐳 Docker Compose Redis Service

### `docker-compose.yml` (Complete Example)

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: app_postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-app_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-dev_password}
      POSTGRES_DB: app_development
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_development"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Session Store
  redis:
    image: redis:7-alpine
    container_name: app_redis
    command: redis-server --appendonly yes
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Rails Full-Stack (Web + Assets + ActionCable)
  fullstack:
    build:
      context: ./backend-rails
      dockerfile: Dockerfile
    container_name: app_rails
    command: bundle exec rails s -b 0.0.0.0
    ports:
      - "${RAILS_PORT:-3000}:3000"
    environment:
      RAILS_ENV: development
      DATABASE_URL: postgresql://app_user:dev_password@postgres:5432/app_development
      REDIS_URL: redis://redis:6379/0
    volumes:
      - ./backend-rails:/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app_network

  # Rails Background Jobs (Sidekiq or Solid Queue)
  fullstack-worker:
    build:
      context: ./backend-rails
      dockerfile: Dockerfile
    container_name: app_rails_worker
    command: bundle exec sidekiq
    environment:
      RAILS_ENV: development
      DATABASE_URL: postgresql://app_user:dev_password@postgres:5432/app_development
      REDIS_URL: redis://redis:6379/0
    volumes:
      - ./backend-rails:/app
    depends_on:
      - postgres
      - redis
    networks:
      - app_network

volumes:
  postgres_data:
  redis_data:

networks:
  app_network:
    driver: bridge
```

---

## 📝 Environment Configuration

### `.env.example` (Root Level)

```bash
# PostgreSQL
POSTGRES_USER=app_user
POSTGRES_PASSWORD=dev_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Rails
RAILS_ENV=development
RAILS_PORT=3000

# For production
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql://app_user:dev_password@postgres:5432/app_development
```

### `backend-rails/.env.example`

```bash
# Application
RAILS_ENV=development
RAILS_LOG_TO_STDOUT=true

# Database
DATABASE_URL=postgresql://app_user:dev_password@postgres:5432/app_development

# Redis
REDIS_URL=redis://redis:6379/0

# ActionCable
CABLE_URL=ws://localhost:3000/cable

# Sessions
SESSIONS_STORE=redis

# Cache
CACHE_STORE=redis

# Sidekiq or Solid Queue
JOB_QUEUE_ADAPTER=sidekiq
```

---

## ⚙️ Rails Configuration

### `config/environments/development.rb`

```ruby
Rails.application.configure do
  config.cache_classes = false
  config.eager_load = false

  # Redis Cache Store
  config.cache_store = :redis_cache_store, {
    url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1'),
    namespace: 'app:cache',
    expires_in: 1.day
  }

  # Redis Session Store
  config.session_store :redis_store, {
    servers: [ENV.fetch('REDIS_URL', 'redis://localhost:6379/2')],
    namespace: 'app:sessions',
    expire_after: 2.weeks
  }

  # ActionCable
  config.action_cable.disable_request_forgery_protection = true
  config.action_cable.allowed_request_origins = [
    'localhost:3000',
    'localhost:5173',
    '127.0.0.1:3000'
  ]

  # Sidekiq (or Solid Queue)
  config.active_job.queue_adapter = :sidekiq

  config.log_level = :debug
end
```

### `config/environments/production.rb`

```ruby
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true

  # Redis Cache Store
  config.cache_store = :redis_cache_store, {
    url: ENV.fetch('REDIS_URL'),
    namespace: 'app:cache',
    expires_in: 1.week
  }

  # Redis Session Store
  config.session_store :redis_store, {
    servers: [ENV.fetch('REDIS_URL')],
    namespace: 'app:sessions',
    expire_after: 2.weeks
  }

  # ActionCable
  config.action_cable.disable_request_forgery_protection = false
  config.action_cable.allowed_request_origins = ENV.fetch('CABLE_ALLOWED_ORIGINS', 'localhost').split(',')

  # Sidekiq (or Solid Queue)
  config.active_job.queue_adapter = :sidekiq

  config.log_level = :info
end
```

### `config/cable.yml`

```yaml
development:
  adapter: redis
  url: <%= ENV.fetch('REDIS_URL', 'redis://localhost:6379/3') %>

test:
  adapter: test

production:
  adapter: redis
  url: <%= ENV.fetch('REDIS_URL') %>
  channel_prefix: "app_production"
```

---

## 💎 Gemfile Configuration

Add these gems to your `Gemfile`:

```ruby
# Redis & Caching
gem 'redis', '~> 5.0'
gem 'redis-session-store'  # For session storage
gem 'hiredis', '~> 0.6'    # C extension for faster Redis

# Sidekiq (Background Jobs)
gem 'sidekiq', '~> 7.0'

# OR use Rails 8 built-in
# gem 'solid_queue'

group :development, :test do
  gem 'redis-namespace'  # For isolated test Redis namespace
end
```

---

## 🚀 Rails Console Commands

### Test Redis Connection

```bash
docker compose exec fullstack bin/rails console

# Inside Rails console:
Rails.cache.write('test_key', 'test_value')
Rails.cache.read('test_key')  # => 'test_value'

# Check ActionCable adapter
ActionCable.server.config.pubsub_adapter  # => ActionCable::SubscriptionAdapter::Redis

# Check session store
Rails.application.config.session_store  # => :redis_store
```

### Monitor Redis

```bash
# Redis CLI
docker compose exec redis redis-cli

# Inside redis-cli:
MONITOR                    # Watch all commands
KEYS *                     # List all keys
KEYS app:cache:*           # Cache keys only
KEYS app:sessions:*        # Session keys
GET app:cache:key_name     # Get specific key
FLUSHDB                    # Clear entire DB (dev only)
```

---

## 🧪 Testing with Redis

### Ensure Test Redis is Clean

```ruby
# spec/spec_helper.rb

RSpec.configure do |config|
  # Clear Redis before each test
  config.before(:each) do
    if defined?(Redis)
      Redis.new(url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')).flushdb
    end
  end
end
```

### Use Redis Namespace in Tests

```yaml
# .env.test
REDIS_URL=redis://localhost:6379/10  # Separate DB for tests
```

---

## 📊 Docker Commands

### Start Everything

```bash
docker compose up --build
```

### View Redis Logs

```bash
docker compose logs -f redis
```

### Access Redis CLI

```bash
docker compose exec redis redis-cli
```

### Stop Everything

```bash
docker compose down
```

### Remove Redis Data (Fresh Start)

```bash
docker compose down -v  # -v removes volumes
```

---

## ⚠️ Common Issues & Solutions

### Redis Connection Refused

```
Error: Connection refused - Unable to connect to redis://localhost:6379
```

**Solution:**
1. Ensure Redis container is running: `docker compose ps redis`
2. Check REDIS_URL in environment: `docker compose exec fullstack env | grep REDIS`
3. Restart Redis: `docker compose restart redis`

### Rails Cache Not Using Redis

```ruby
# Verify in Rails console:
Rails.cache.class  # Should be Redis::Store or ActionCable::SubscriptionAdapter::Redis
```

**Solution:** Ensure `REDIS_URL` is set and Redis is healthy before Rails boots.

### Session Data Not Persisting

**Issue:** Sessions lost between requests

**Solution:**
1. Check Redis is running: `docker compose exec redis redis-cli ping`
2. Verify `redis-session-store` gem is in Gemfile
3. Check `config/cable.yml` and `config/environments/development.rb`

### ActionCable Not Broadcasting

**Issue:** Messages sent to channel but no clients receive

**Solutions:**
1. Verify Redis adapter: `ActionCable.server.config.pubsub_adapter`
2. Check browser WebSocket connection in DevTools (Network > WS)
3. Verify channel is subscribed: `ActionCable.server.remote_connections.where(current_user_id: 1).disconnect`

---

## 🔄 Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

echo "Checking Docker services..."
docker compose ps

echo ""
echo "Testing PostgreSQL..."
docker compose exec -T postgres pg_isready -U app_user -d app_development

echo ""
echo "Testing Redis..."
docker compose exec -T redis redis-cli ping

echo ""
echo "Rails health check..."
docker compose exec -T fullstack bin/rails runner "puts 'Rails OK'"
```

Run: `chmod +x scripts/health-check.sh && ./scripts/health-check.sh`

---

## 📚 Reference

- **Redis**: https://redis.io/
- **Rails Caching**: https://guides.rubyonrails.org/caching_with_rails.html
- **ActionCable**: https://guides.rubyonrails.org/action_cable_overview.html
- **redis-rb**: https://github.com/redis/redis-rb
- **Sidekiq**: https://sidekiq.org/

