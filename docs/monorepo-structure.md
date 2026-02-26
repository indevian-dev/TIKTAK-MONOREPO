# Monorepo Structure

## 1. Overview
This codebase is a **Bun-workspace monorepo** designed for maximum code sharing and consistency between the Web frontend (Next.js), Mobile App (Expo), and the backend (Next.js API Routes). Bun workspaces hoist shared dependencies (e.g. `zod`) to the root `node_modules/`, making them available to all sub-packages without re-installing.

## 2. Root Architecture
The monorepo separates platform-specific frameworks from shared business logic and type definitions.

### Root `package.json` — Shared Dependencies
```json
{
  "workspaces": ["next", "_shared.types", "expo"],
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```
> **Rule:** Any dep needed by more than one workspace belongs in the root `package.json`, not in a sub-package.

### Key Directories
- **`next/`**: The Next.js app. Contains Web UI (`app/`), API routes (`app/api/`), Drizzle ORM schema (`lib/database/`), and all Business Services (`lib/domain/`).
- **`expo/`**: The React Native application (Mobile client).
- **`_shared.types/`** (`@tiktak/shared-types`): The **single source of truth** for all TypeScript domain types and Zod schemas shared across `next` and `expo`. See [`monorepo-type-system.md`](./monorepo-type-system.md) for full details.
- **`docs/`**: All architecture documentation and AI Agent rules.

## 3. The `next/lib` Core (Clean Architecture)
The backend logic inside `next/lib` follows a decoupled architecture pattern:

- **`database/`**: Drizzle ORM schema, migrations, and DB connection (`next/lib/database/schema.ts`). This is the **ultimate source of truth** for DB shapes — domain types are derived from it via `InferSelectModel`.
- **`domain/`**: The "Business Logic" layer, organized by domain (e.g., `notification/`, `workspace/`).
  - **Mappers**: Bridge raw `DbRecord` types → domain `*.types.ts` shapes (camelCase, curated fields).
  - **Repositories**: Drizzle ORM queries, return `DbRecord` types.
  - **Services**: Business logic, call repositories, use mappers.
  - **Domain Factory**: DI container `Domain.factory.ts` assembles services/repos with context scopes.
- **`routes/`**: Centralized routing with automatic RBAC and auth validation.
- **`middleware/`**: Unified API handlers, authorizers, request interceptors, error mappers.
- **`responses/`**: Standardized HTTP response formatters (`okResponse`, `errorResponse`).

## 4. Type Flow (Summary)
```
Drizzle schema.ts  →  DbRecord / DbInsert types
       ↓
  Mapper.ts        →  Notification.PrivateAccess (camelCase, clean)
       ↓
  Service.ts       →  business logic
       ↓
  API Route        →  validateBody(req, NotificationMarkReadSchema)  [Zod from _shared.types]
       ↓
  Client (Next / Expo)  ← import type { Notification } from '@tiktak/shared/types/...'
```

## 5. Workflows & Rules
- **API routes are thin controllers** — they call `Domain.factory.ts` services, never contain business logic.
- **Shared types ONLY in `_shared.types/`** — never define API response shapes inside `next/lib/`.
- **Zod schemas ONLY in `_shared.types/`** — never create input schemas inside `next/lib/domain/`.
- **DB column names never leak to UI** — always map to camelCase domain types before returning from a service.
- See [`monorepo-type-system.md`](./monorepo-type-system.md) for the full type organization guide.
