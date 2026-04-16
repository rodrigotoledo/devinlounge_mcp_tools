# NPM Packages Strategy — Frontend Projects

Best practices and recommended packages for JavaScript/TypeScript projects across Expo, Next.js, and React SPA.

---

## 📊 Package Categories Overview

| Category | Purpose | Example Packages | When to Use |
|----------|---------|------------------|------------|
| **Core Framework** | Application framework | react, next, expo | Application foundation |
| **Routing** | Navigation, URL handling | react-router, next/router, expo-router | Multi-screen apps |
| **State Management** | Global state | zustand, jotai, redux | Shared state needs |
| **HTTP & API** | Backend communication | axios, fetch, react-query, swr | Data fetching |
| **Styling** | CSS framework, utilities | tailwindcss, nativewind, styled-components | UI styling |
| **UI Components** | Pre-built components | shadcn/ui, react-native-paper | Component library |
| **Form Handling** | Form validation, management | react-hook-form, formik, zod | User input |
| **Type Safety** | TypeScript utilities, validation | typescript, zod, ts-rest | Code quality |
| **Testing** | Unit/E2E testing frameworks | jest, vitest, testing-library, detox | Quality assurance |
| **Build Tools** | Bundling, compilation | vite, webpack, esbuild, turbopack | Build optimization |
| **Performance** | Optimization, monitoring | web-vitals, lighthouse | Performance metrics |
| **Utilities** | Helper functions, tooling | lodash-es, date-fns, uuid | Common operations |
| **Animations** | Motion, transitions | framer-motion, react-native-reanimated | UI interactions |
| **Date & Time** | Date manipulation | date-fns, dayjs, zod | Temporal data |
| **Code Quality** | Linting, formatting | eslint, prettier, typescript | Development workflow |
| **Environment** | Configuration management | dotenv, dotenv-expand | Environment vars |
| **Monitoring** | Error tracking, analytics | sentry, segment, mixpanel | Production observability |
| **Development** | Local development tools | concurrently, cross-env, tsx | Dev workflow |

---

## 🎯 Core Dependencies by Framework

### ✅ All Projects (Expo, Next.js, React SPA)

**Core Utilities**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0"
  }
}
```

**HTTP & Data Fetching**
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "swr": "^2.2.0"
  }
}
```

**State Management**
```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "jotai": "^2.6.0"
  }
}
```

**Type Safety & Validation**
```json
{
  "dependencies": {
    "zod": "^3.22.0",
    "ts-rest": "^7.0.0"
  },
  "devDependencies": {
    "typescript-eslint": "^6.0.0"
  }
}
```

**Utilities**
```json
{
  "dependencies": {
    "lodash-es": "^4.17.21",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

**Code Quality & Linting**
```json
{
  "devDependencies": {
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-import": "^2.29.0"
  }
}
```

---

### 📱 Expo Only (React Native)

**Core Framework**
```json
{
  "dependencies": {
    "expo": "^50.0.0",
    "expo-router": "^2.0.0",
    "react-native": "^0.73.0"
  }
}
```

**Styling (NativeWind/Tailwind)**
```json
{
  "dependencies": {
    "nativewind": "^4.0.1",
    "tailwindcss": "^3.4.0"
  }
}
```

**Native UI Components**
```json
{
  "dependencies": {
    "react-native-paper": "^5.11.0",
    "react-native-elements": "^3.4.0",
    "@react-native-community/hooks": "^3.0.0"
  }
}
```

**Animations & Gestures**
```json
{
  "dependencies": {
    "react-native-reanimated": "^3.5.0",
    "react-native-gesture-handler": "^2.14.0"
  }
}
```

**Device & Native Features**
```json
{
  "dependencies": {
    "expo-device": "^5.4.0",
    "expo-notifications": "^0.27.0",
    "expo-camera": "^14.0.0",
    "expo-image-picker": "^14.7.0",
    "expo-file-system": "^16.4.0",
    "expo-secure-store": "^12.8.0"
  }
}
```

**Storage & Database**
```json
{
  "dependencies": {
    "async-storage": "^1.21.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "sqlite": "^5.1.0",
    "realm": "^12.0.0"
  }
}
```

**Testing (React Native)**
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.4.0",
    "detox": "^20.0.0",
    "detox-cli": "^20.0.0",
    "@testing-library/jest-native": "^5.4.0"
  }
}
```

---

### 🌐 Next.js Only

**Framework & Routing**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**Image & Font Optimization**
```json
{
  "dependencies": {
    "next/image": "^14.0.0",
    "@next/font": "^14.0.0"
  }
}
```

**Styling**
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**Server Components & Data Fetching**
```json
{
  "dependencies": {
    "next/link": "^14.0.0",
    "next/image": "^14.0.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

**Middleware & Security**
```json
{
  "dependencies": {
    "next-auth": "^4.24.0"
  }
}
```

**SEO & Metadata**
```json
{
  "dependencies": {
    "next-seo": "^6.4.0"
  }
}
```

**Testing (Next.js)**
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    "cypress": "^13.6.0",
    "@cypress/schematic": "^2.5.0"
  }
}
```

---

### ⚛️ React SPA Only (Vite)

**Build Tool & Framework**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

**Routing (SPA)**
```json
{
  "dependencies": {
    "react-router-dom": "^6.20.0",
    "history": "^5.3.0"
  }
}
```

**Styling**
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**SPA UI Component Libraries**
```json
{
  "dependencies": {
    "shadcn-ui": "^0.4.0",
    "@radix-ui/react-*": "^latest",
    "lucide-react": "^0.295.0"
  }
}
```

**Testing (React SPA)**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    "happy-dom": "^12.10.0",
    "cypress": "^13.6.0"
  }
}
```

---

## 📦 Detailed Package Recommendations

### State Management (Choose One)

**Zustand** (Recommended for simplicity)
```json
{
  "dependencies": {
    "zustand": "^4.4.0"
  }
}
```
- Minimal boilerplate
- No providers needed (unless persisting)
- Good TypeScript support
- Recommended for this project

**Jotai** (Atom-based)
```json
{
  "dependencies": {
    "jotai": "^2.6.0"
  }
}
```
- Primitive atom system
- Built-in async support
- Good for complex state

**Redux Toolkit** (Full-featured)
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "redux": "^4.2.0"
  }
}
```
- Production-proven
- Large ecosystem
- More boilerplate

**Context API** (Built-in)
```
// No package needed, use React.createContext()
// Good for: small apps, avoiding prop drilling
// Not recommended for: large, frequently updated state
```

---

### HTTP & Data Fetching

**React Query** (Recommended for server state)
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0"
  }
}
```
- Server state management
- Automatic caching & synchronization
- Powerful DevTools
- Best for API data

**SWR** (Alternative, from Vercel)
```json
{
  "dependencies": {
    "swr": "^2.2.0"
  }
}
```
- Lightweight alternative
- Good for simple fetching
- Built-in caching

**Axios** (HTTP client)
```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```
- Works with any state management
- Request/response interceptors
- Promise-based

**Fetch API** (Native)
```
// No package needed, use native fetch()
// Sufficient for: simple requests, modern browsers
// Add AbortController for cancellation
```

---

### Form Handling

**React Hook Form** (Recommended, lightweight)
```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  }
}
```
- Minimal re-renders
- Small bundle size
- Great TypeScript support

**Formik** (More features)
```json
{
  "dependencies": {
    "formik": "^2.4.0",
    "yup": "^1.3.0"
  }
}
```
- Built-in validation
- Field-level validation
- More boilerplate

**Zod** (Schema validation)
```json
{
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```
- TypeScript-first validation
- Works standalone or with forms
- Excellent error messages

---

### Styling Solutions

**Tailwind CSS** (Recommended for all)
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

**NativeWind** (For React Native/Expo)
```json
{
  "dependencies": {
    "nativewind": "^4.0.1",
    "tailwindcss": "^3.4.0"
  }
}
```
- Brings Tailwind to React Native
- Use className like web
- Minimal learning curve

**Styled Components** (CSS-in-JS)
```json
{
  "dependencies": {
    "styled-components": "^6.1.0"
  },
  "devDependencies": {
    "@types/styled-components": "^5.1.26"
  }
}
```
- Dynamic styling
- Component scoping
- More overhead than Tailwind

**Emotion** (Lightweight CSS-in-JS)
```json
{
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  }
}
```
- Similar to styled-components
- Lighter weight
- Good performance

---

### Testing Frameworks

**Jest** (Most used for Node/React)
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
```
- Rich assertion library
- Snapshot testing
- Good IDE integration

**Vitest** (Faster, Vite-native)
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "happy-dom": "^12.10.0"
  }
}
```
- 5-10x faster than Jest
- Better TypeScript support
- Smaller config

**Testing Library** (Best practices)
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.0"
  }
}
```
- Test user behavior, not implementation
- Works with Jest or Vitest
- Encourages good testing practices

**Cypress** (E2E testing)
```json
{
  "devDependencies": {
    "cypress": "^13.6.0"
  }
}
```
- Browser automation
- Visual debugging
- Good for user workflows

**Detox** (Mobile E2E, Expo only)
```json
{
  "devDependencies": {
    "detox": "^20.0.0",
    "detox-cli": "^20.0.0"
  }
}
```
- Real device automation
- Fast, reliable tests
- Expo/React Native focused

---

### Build Tools & Bundlers

**Vite** (Recommended for React SPA)
```json
{
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```
- Extremely fast dev server
- Modern JavaScript
- Great for React SPA

**Next.js** (Built-in for Next)
```json
{
  "dependencies": {
    "next": "^14.0.0"
  }
}
```
- SSR/SSG included
- Image optimization
- API routes built-in

**Webpack** (If needed for complex config)
```json
{
  "devDependencies": {
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  }
}
```
- Complex bundling needs
- Large ecosystem
- Steeper learning curve

---

### Utilities & Helpers

**Date Handling**
```json
{
  "dependencies": {
    "date-fns": "^2.30.0"
  }
}
```
- Modular date functions
- TypeScript support
- Smaller than moment.js

**Functional Programming**
```json
{
  "dependencies": {
    "lodash-es": "^4.17.21",
    "ramda": "^0.29.0"
  }
}
```
- Utility functions
- lodash-es: larger library
- ramda: functional style

**String/Text Utilities**
```json
{
  "dependencies": {
    "classnames": "^2.3.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  }
}
```
- clsx: lightweight className utility
- tailwind-merge: merge Tailwind classes safely

**UUID/Identifiers**
```json
{
  "dependencies": {
    "uuid": "^9.0.0",
    "nanoid": "^4.0.0",
    "ulid": "^2.3.0"
  }
}
```
- uuid: standard UUIDs
- nanoid: tiny, URL-safe IDs
- ulid: sortable IDs

---

### Code Quality & Linting

**ESLint** (Always)
```json
{
  "devDependencies": {
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-import": "^2.29.0"
  }
}
```

**Prettier** (Code formatting)
```json
{
  "devDependencies": {
    "prettier": "^3.1.0"
  }
}
```

**TypeScript** (Type safety)
```json
{
  "devDependencies": {
    "typescript": "^5.3"
  }
}
```

---

### Monitoring & Error Tracking

**Sentry** (Error tracking)
```json
{
  "dependencies": {
    "@sentry/react": "^7.87.0",
    "@sentry/tracing": "^7.87.0"
  }
}
```
- Production error monitoring
- Performance tracking
- Session replay

**Web Vitals** (Performance metrics)
```json
{
  "dependencies": {
    "web-vitals": "^3.4.0"
  }
}
```
- Core Web Vitals tracking
- Analytics integration
- Lightweight

---

## 📋 Recommended Package.json by Project Type

### Expo (React Native)

```json
{
  "name": "hardhat-expo",
  "version": "1.0.0",
  "dependencies": {
    "expo": "^50.0.0",
    "expo-router": "^2.0.0",
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "nativewind": "^4.0.1",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "react-native-reanimated": "^3.5.0",
    "react-native-gesture-handler": "^2.14.0",
    "expo-device": "^5.4.0",
    "expo-file-system": "^16.4.0",
    "expo-secure-store": "^12.8.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/react": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "@testing-library/react-native": "^12.4.0",
    "jest": "^29.7.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  },
  "scripts": {
    "start": "expo start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Next.js

```json
{
  "name": "web-nextjs",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "next-auth": "^4.24.0",
    "next-seo": "^6.4.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "cypress": "^13.6.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:e2e": "cypress open"
  }
}
```

### React SPA (Vite)

```json
{
  "name": "web-react",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.20.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "clsx": "^2.0.0",
    "lodash-es": "^4.17.21",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "happy-dom": "^12.10.0",
    "cypress": "^13.6.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "cypress open"
  }
}
```

---

## 🚀 Shared Dependencies Across Projects

These packages should be consistent versions across all three projects:

```json
{
  "react": "^19.0.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0",
  "date-fns": "^2.30.0",
  "uuid": "^9.0.0",
  "zod": "^3.22.0",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.3",
  "eslint": "^8.54.0",
  "prettier": "^3.1.0"
}
```

---

## ⚠️ Packages to Avoid or Reconsider

| Package | Issue | Alternative |
|---------|-------|------------|
| `moment.js` | Large bundle, mutation-heavy | `date-fns` or `dayjs` |
| `lodash` (full) | Large bundle | `lodash-es` with tree-shaking |
| `Redux` (base) | Boilerplate-heavy | `Zustand` or `Jotai` |
| `prop-types` | Runtime only, use TypeScript | `TypeScript` or `Zod` |
| `class-component` (React) | Legacy, harder to optimize | Use functional components with hooks |
| `styled-components` (heavy use) | Performance cost | `Tailwind` + `Tailwind Merge` |
| `axios` + `fetch` | Use only one | Prefer `axios` or `SWR` for queries |

---

## 📊 Package Management Practices

### Check for Outdated Packages
```bash
npm outdated
```

### Update to Latest Safe Versions
```bash
npm update
```

### Check for Security Vulnerabilities
```bash
npm audit
npm audit fix
```

### Analyze Bundle Size
```bash
npm install -g webpack-bundle-analyzer
# Add plugin to build config
```

### Lock Dependencies
```bash
# Commit package-lock.json to version control
git add package-lock.json
```

---

## ✅ Checklist for New Frontend Project

### Core Setup
- [ ] React/Next.js/Expo installed
- [ ] TypeScript configured
- [ ] Tailwind CSS setup with NativeWind (Expo) or PostCSS (web)
- [ ] ESLint & Prettier configured
- [ ] Git pre-commit hooks enabled

### State & Data
- [ ] Zustand or Jotai installed
- [ ] React Query or SWR for API data
- [ ] Axios configured with interceptors
- [ ] Zod for validation

### Testing
- [ ] Jest/Vitest configured
- [ ] Testing Library setup
- [ ] First component test written
- [ ] Cypress or Detox for E2E (optional)

### Utilities
- [ ] date-fns imported
- [ ] uuid available
- [ ] clsx or classnames for classes
- [ ] tailwind-merge for dynamic Tailwind

### Monitoring
- [ ] Sentry configured (optional for production)
- [ ] Web Vitals tracking (optional for Next.js)
- [ ] Error boundary component created

### Quality Gates
- [ ] Linting passes: `npm run lint`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Tests pass: `npm run test`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Bundle size analyzed

---

## 🔄 Dependency Management Strategy

### Weekly
```bash
npm outdated
```

### Monthly
```bash
npm update
npm audit fix
```

### Before Major Release
```bash
npm audit
npm outdated
npm update --save-dev
# Test thoroughly
```

### CI/CD Integration
```bash
npm ci                  # Install exact versions
npm run lint
npm run typecheck
npm run test
npm audit --audit-level=high
```

---

**Last Updated:** 2026-04-16  
**Maintenance:** Review quarterly for security and performance updates
