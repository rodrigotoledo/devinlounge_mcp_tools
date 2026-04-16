# NestJS Setup Guide — MVP

Configuration baseline for NestJS with modular architecture, DTO validation, OpenAPI contracts, and Jest unit/e2e tests.

---

## ✅ MVP Defaults

- **Architecture:** Modular by domain
- **Validation:** `class-validator` + `class-transformer`
- **API contracts:** `@nestjs/swagger`
- **Persistence:** TypeORM or Prisma (project choice)
- **Tests:** Jest unit + e2e for critical endpoints
- **Runtime:** Docker (`docker compose exec nestjs ...`)

---

## 📦 Core Dependencies

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "@nestjs/swagger": "^7.0.0",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "@nestjs/testing": "^10.0.0",
    "supertest": "^6.3.0"
  }
}
```

---

## 🧱 Recommended Structure

```text
backend-nestjs/
  src/
    modules/
      users/
        users.module.ts
        users.controller.ts
        users.service.ts
        dto/
    common/
    main.ts
  test/
    app.e2e-spec.ts
```

---

## 🔧 Commands (Docker)

```bash
docker compose exec nestjs npm install
docker compose exec nestjs npm run start:dev
docker compose exec nestjs npm run build
docker compose exec nestjs npm run test
docker compose exec nestjs npm run lint
```

---

## 🧠 Good Practices

1. Keep controllers thin; business logic in services.
2. Validate all external input with DTO decorators.
3. Use guards/interceptors/pipes for cross-cutting concerns.
4. Keep one domain per module.
5. Maintain OpenAPI docs for all public endpoints.
6. Prefer explicit service interfaces for complex modules.

---

## 🧪 Testing Baseline

- Unit tests for services/use-cases.
- e2e tests for authentication and critical endpoints.
- Avoid asserting internal implementation details.

---

## 🚫 Avoid by Default

- Fat controllers with business logic.
- Skipping DTO validation in public endpoints.
- Missing Swagger docs in externally consumed routes.
