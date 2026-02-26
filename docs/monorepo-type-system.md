# Monorepo Type System — Bun Workspaces, Zod & Domain Types

## 1. Overview

This document describes the **single source of truth** architecture for all TypeScript types and Zod validation schemas in the monorepo. The goal is zero duplication — types are defined once and consumed by all packages (Next.js, Expo, etc.) without any manual aliasing or copying.

---

## 2. Bun Workspaces — The Foundation

### Why Bun Workspaces?

Before Bun workspaces, third-party packages like `zod` had to be individually installed inside each sub-package (`next/`, `expo/`, etc.). This caused two problems:

1. **Import failures** — `_shared.types/` could not `import { z } from 'zod'` because `zod` wasn't in its `node_modules`.
2. **Version drift** — each package could silently end up on a different `zod` version, causing subtle type incompatibilities at runtime.

Bun workspaces **hoist** shared dependencies to the root `node_modules/`, making them available to all workspace packages without re-installing.

### Root `package.json` configuration

```json
{
  "name": "tiktak-monorepo",
  "private": true,
  "workspaces": [
    "next",
    "_shared.types",
    "expo"
  ],
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```

- `zod` lives **only** in the root `dependencies`. Never add it again inside `next/package.json` or `expo/package.json`.
- Any dependency that must be shared across packages follows the same rule.

### How Bun resolves imports

```
Root node_modules/zod  ← hoisted here by Bun
  ↑ used by
    _shared.types/  (can import zod directly)
    next/           (can import zod AND _shared.types schemas)
    expo/           (can import zod AND _shared.types schemas)
```

### Running commands

Always use `bun` from the **monorepo root**:

```bash
# Install all workspace deps
bun install

# Run next dev server
bun run dev --cwd next

# Or from inside the next folder
cd next && bun run dev
```

---

## 3. `_shared.types/` — Structure & Conventions

`_shared.types/` is the **single source of truth** for all cross-package types and schemas.

### Directory Layout

```
_shared.types/
  Shared.types.ts           ← Root barrel: re-exports everything
  package.json              ← { "name": "@tiktak/shared-types" }
  tsconfig.json

  auth/
    Auth.schemas.ts         ← Zod schemas for auth flows
    Auth.types.ts           ← TypeScript types for auth domain

  domain/
    Card.schemas.ts         ← Zod input schemas (what clients SEND)
    Card.types.ts           ← Domain types (what the API RETURNS)
    Category.schemas.ts
    Category.types.ts
    Notification.schemas.ts
    Notification.types.ts
    Role.types.ts
    Workspace.schemas.ts
    Workspace.types.ts
    User.schemas.ts
    Support.schemas.ts
    Content.schemas.ts
    Jobs.schemas.ts

  api/                      ← Shared API response envelope types
  base/                     ← Primitive shared types (Pagination, etc.)
  ui/                       ← Shared UI-related enums / constants
  validation/               ← Shared validation helpers
```

### `_shared.types/package.json`

```json
{
  "name": "@tiktak/shared-types",
  "version": "1.0.0",
  "private": true,
  "main": "./Shared.types.ts"
}
```

The `name` field is the import alias used by all consumers:
```typescript
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';
```

> **Note:** The path alias `@tiktak/shared/types/...` maps to `_shared.types/...` via `tsconfig.json` path aliases in each sub-package.

---

## 4. The Two-File Pattern: `.types.ts` vs `.schemas.ts`

Every domain entity uses **two files** with a strict separation of concerns:

### `*.types.ts` — API Output Shapes (what the server RETURNS)

- Pure TypeScript interfaces — **no Zod**, no runtime code.
- Organized into a **namespace** with access-level sub-types.
- Derived from the Drizzle DB schema via `InferSelectModel` where applicable.
- Consumed by: Next.js API responses, frontend React components, Expo screens.

```typescript
// _shared.types/domain/Notification.types.ts
import type { InferSelectModel } from 'drizzle-orm';
import type { accountNotifications } from '../../next/lib/database/schema';

export namespace Notification {
    export type NotificationType = 'order_placed' | 'message_received' | ...;

    /** Public access — minimal preview (e.g. for listings) */
    export interface PublicAccess {
        id: string;
        type: NotificationType;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }

    /** Private access — full object visible only to the owner */
    export interface PrivateAccess extends PublicAccess {
        accountId: string;
        workspaceId: string;
        payload?: Record<string, unknown> | null;
        updatedAt?: Date | null;
        canDelete: boolean;
        canMarkAsRead: boolean;
    }

    /** Paginated API response envelope */
    export interface PaginatedResponse {
        notifications: PrivateAccess[];
        pagination: { totalPages: number; hasPrev: boolean; hasNext: boolean; total: number; };
        unreadCount: number;
    }
}
```

### `*.schemas.ts` — API Input Validation (what clients SEND)

- Zod schemas only — runtime validation.
- `z.infer<>` types exported for use in services and repositories.
- Imported by: API route handlers, Expo form submissions.

```typescript
// _shared.types/domain/Notification.schemas.ts
import { z } from 'zod';

export const NotificationMarkReadSchema = z.object({
    notificationId: z.string().ulid(),
});
export type NotificationMarkReadInput = z.infer<typeof NotificationMarkReadSchema>;

export const NotificationPreferencesSchema = z.object({
    emailEnabled: z.boolean(),
    pushEnabled: z.boolean(),
    smsEnabled: z.boolean(),
});
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;
```

---

## 5. Access Level Pattern (`PublicAccess` / `PrivateAccess`)

Domain types use a **namespace with access levels** to encode visibility rules at the type level.

| Access Level | Description | Used In |
|---|---|---|
| `PublicAccess` | Minimal fields. Safe for unauthenticated API responses or listings. | Public API routes, card listings, store pages |
| `PrivateAccess` | Full fields for the authenticated owner. Extends `PublicAccess`. | Owner dashboards, notification drawer |
| `AdminAccess` | Full fields + admin-only metadata. Used by staff/admin screens only. | Staff workspace screens |

**Rule:** Always return the most restrictive type that satisfies the use case. Never return a `PrivateAccess` shape from a public-facing route.

---

## 6. Naming Conventions (Enforced)

| Thing | Convention | Example |
|---|---|---|
| Domain type namespace | `PascalCase` | `Notification`, `Card`, `Workspace` |
| Output types file | `<Domain>.types.ts` | `Notification.types.ts` |
| Input schemas file | `<Domain>.schemas.ts` | `Notification.schemas.ts` |
| Zod schema | `<Entity><Action>Schema` | `NotificationMarkReadSchema` |
| Inferred input type | `<Entity><Action>Input` | `NotificationMarkReadInput` |
| DB record type | `<Domain>DbRecord` | `AccountNotificationDbRecord` |
| DB insert type | `<Domain>DbInsert` | `AccountNotificationDbInsert` |

---

## 7. Import Paths

### In `next/` (Next.js)

```typescript
// Domain types
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';

// Zod schemas
import { NotificationMarkReadSchema } from '@tiktak/shared/types/domain/Notification.schemas';

// Auth schemas
import { LoginSchema } from '@tiktak/shared/types/auth/Auth.schemas';
```

### In `expo/` (React Native)

```typescript
// Identical import paths — Bun workspace hoisting means the same alias works
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';
```

---

## 8. Type Derivation from Drizzle Schema

The Drizzle ORM schema in `next/lib/database/schema.ts` is the **ultimate source of truth** for database shapes. Domain types should be derived from it — not manually duplicated.

```typescript
// In schema.ts
export const accountNotifications = pgTable('account_notifications', {
    id: varchar('id').primaryKey(),
    accountId: varchar('account_id').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    // ...
});

// DB types (in schema.ts or domain index)
export type AccountNotificationDbRecord = InferSelectModel<typeof accountNotifications>;
export type AccountNotificationDbInsert = InferInsertModel<typeof accountNotifications>;
```

Domain types (`PrivateAccess`) are then a **curated subset** of `AccountNotificationDbRecord` — renamed to camelCase, with sensitive fields removed, and computed fields added (`canDelete`, `canMarkAsRead`).

The **mapper** bridges DB ↔ domain:
```typescript
// next/lib/domain/notification/Notification.mapper.ts
export function toPrivateAccess(record: AccountNotificationDbRecord): Notification.PrivateAccess {
    return {
        id: record.id,
        title: record.title,
        message: record.message,
        isRead: record.isRead,
        createdAt: record.createdAt,
        accountId: record.accountId,
        // ... computed fields
        canDelete: true,
        canMarkAsRead: !record.isRead,
    };
}
```

> **Critical Convention:** DB column names are `snake_case`. Domain type properties are always `camelCase`. Never access DB column names directly in UI components — always go through the mapper and domain type.

---

## 9. Data Flow (End to End)

```
Client (Next.js UI / Expo)
    │  sends JSON body
    ▼
API Route Handler (next/app/api/.../route.ts)
    │  validateBody(req, NotificationMarkReadSchema)  ← Zod validates input
    ▼
Service (next/lib/domain/notification/Notification.service.ts)
    │  business logic, calls repository
    ▼
Repository (next/lib/domain/notification/Notification.repository.ts)
    │  Drizzle ORM query → returns AccountNotificationDbRecord
    ▼
Mapper (Notification.mapper.ts)
    │  toPrivateAccess(dbRecord) → returns Notification.PrivateAccess
    ▼
API Route Handler
    │  return okResponse(privateAccessObject)
    ▼
Client receives typed Notification.PrivateAccess JSON
```

---

## 10. Adding a New Domain Entity (Checklist)

1. **Zod schema** → create `_shared.types/domain/<Domain>.schemas.ts`
2. **Domain types** → create `_shared.types/domain/<Domain>.types.ts` with namespace + access levels
3. **Barrel export** → add `export * from './domain/<Domain>.schemas'` and `export * from './domain/<Domain>.types'` to `_shared.types/Shared.types.ts`
4. **DB schema** → add table to `next/lib/database/schema.ts`, export `DbRecord` and `DbInsert` types
5. **Mapper** → create `next/lib/domain/<domain>/<Domain>.mapper.ts`
6. **Repository** → create `next/lib/domain/<domain>/<Domain>.repository.ts`
7. **Service** → create `next/lib/domain/<domain>/<Domain>.service.ts`
8. **API route** → create thin controller in `next/app/api/...`, use `validateBody()` + `Domain.factory.ts`

---

## 11. Anti-Patterns (Never Do These)

| ❌ Wrong | ✅ Correct |
|---|---|
| Define types inside `next/lib/domain/` | Define types in `_shared.types/domain/` |
| Install `zod` inside `next/package.json` | Zod lives only in root `package.json` |
| Access `notification.mark_as_read` in UI | Use `notification.isRead` (camelCase domain type) |
| Copy-paste type from schema into Expo | Import from `@tiktak/shared/types/...` |
| Return raw DB record from API route | Always map through `*.mapper.ts` first |
| Use `any` as DB record type | Use `AccountNotificationDbRecord` from schema |
