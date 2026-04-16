# Next.js Setup Guide — MVP

Configuration baseline for Next.js (App Router) with TypeScript strict, TanStack Query, and form validation with React Hook Form + Zod.

---

## ✅ MVP Defaults

- **Framework:** Next.js App Router (`app/`)
- **Language:** TypeScript strict
- **Server state:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Tests:** Jest + Testing Library (unit), optional Playwright/Cypress for e2e
- **Runtime:** Docker (`docker compose exec nextjs ...`)

---

## 📦 Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0"
  }
}
```

---

## 🧱 Recommended Structure

```text
web-nextjs/
  app/
    api/
    (routes...)
  components/
  hooks/
  lib/
    query-client.ts
    validations/
  styles/
```

---

## 🔧 Commands (Docker)

```bash
docker compose exec nextjs npm install
docker compose exec nextjs npm run dev
docker compose exec nextjs npm run build
docker compose exec nextjs npm run test
docker compose exec nextjs npm run lint
```

---

## 🧠 Good Practices

1. **Prefer Server Components** by default.
2. Use **Client Components** only for interactivity/stateful UI.
3. Use **TanStack Query** only where client cache/invalidation is needed.
4. Keep form schemas in Zod and infer TS types from schemas.
5. Do not introduce Redux unless explicitly requested.
6. Keep data fetching logic in reusable hooks.

---

## 🧪 Testing Baseline

- Component tests with Testing Library.
- Route handler tests for `app/api` when critical.
- Add e2e only for critical business flows.

---

## 🚫 Avoid by Default

- Pages Router for new features.
- Global state libraries for server-state concerns.
- Duplicated validation logic outside Zod schemas.
