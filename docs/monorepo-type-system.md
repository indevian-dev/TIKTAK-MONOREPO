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

  base/
    Base.types.ts           ← Timestamps, Pagination, Location, etc.

  domain/
    Auth.views.ts           ← Shared Auth view interfaces (User/Account/Session × Public/Private/Full)
    Card.schemas.ts         ← Zod input schemas (what clients SEND)
    Card.types.ts           ← Card domain types (PublicAccess, PrivateAccess, FilterOption)
    Category.schemas.ts
    Category.types.ts
    Notification.schemas.ts
    Notification.types.ts
    Payment.types.ts        ← Transaction and Coupon view interfaces
    Role.types.ts           ← Role, Access, and Invitation view interfaces
    Workspace.schemas.ts
    Workspace.types.ts      ← Workspace view interfaces (PublicView/PrivateView/FullView)
    User.schemas.ts
    Support.schemas.ts
    Content.schemas.ts
    Jobs.schemas.ts

  api/                      ← Shared API response envelope types
  ui/                       ← Shared UI-related types (Form, Modal, Select)
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

## 5. The `satisfies` Mapper Pattern (View Types)

Mappers now use TypeScript's `satisfies` operator to enforce that the returned object matches the shared view type **at compile time**, without losing the inferred return type:

```typescript
// _shared.types/domain/Workspace.types.ts
export namespace Workspace {
    export interface Profile { logo?: string | null; phone?: string | null; /* ... */ }

    export interface PublicView {
        id: string;
        title: string;
        type: string;
        profile: Profile | null;
        isStore: boolean | null;
    }

    export interface PrivateView extends PublicView {
        cityId: string | null;
        isActive: boolean | null;
        isBlocked: boolean | null;
    }

    export interface FullView extends PrivateView {
        createdAt: Date | null;
        updatedAt: Date | null;
    }
}
```

```typescript
// next/lib/domain/workspace/Workspace.mappers.ts
import type { Workspace } from '@tiktak/shared/types/domain/Workspace.types';

export function toWorkspacePublicView(row: WorkspaceDbRecord) {
    return {
        id: row.id,
        title: row.title,
        type: row.type,
        profile: (row.profile as Workspace.Profile) ?? null,
        isStore: row.isStore ?? false,
    } satisfies Workspace.PublicView;
}
```

All 4 mapper domains use this pattern: **Workspace** (3 views), **Auth** (7 views), **Role/Access/Invitation** (6 views), **Payment** (4 views).

> **Key Rule:** Never define inline view interfaces in mapper files. Always define them in `_shared.types/domain/` and use `satisfies` in the mapper.

---

## 6. Access Level Pattern (`PublicAccess` / `PrivateAccess` / View Types)

Domain types use a **namespace with access levels** to encode visibility rules at the type level.

| Access Level | Description | Used In |
|---|---|---|
| `PublicAccess` / `PublicView` | Minimal fields. Safe for unauthenticated API responses or listings. | Public API routes, card listings, store pages |
| `PrivateAccess` / `PrivateView` | Full fields for the authenticated owner. Extends Public. | Owner dashboards, notification drawer |
| `FullView` / `AdminAccess` | Full fields + admin-only metadata. Used by staff/admin screens only. | Staff workspace screens |

**Rule:** Always return the most restrictive type that satisfies the use case. Never return a `PrivateAccess` shape from a public-facing route.

---

## 7. Naming Conventions (Enforced)

| Thing | Convention | Example |
|---|---|---|
| Domain type namespace | `PascalCase` | `Notification`, `Card`, `Workspace` |
| Output types file | `<Domain>.types.ts` | `Notification.types.ts` |
| View types file | `<Domain>.views.ts` | `Auth.views.ts` |
| Input schemas file | `<Domain>.schemas.ts` | `Notification.schemas.ts` |
| Zod schema | `<Entity><Action>Schema` | `NotificationMarkReadSchema` |
| Inferred input type | `<Entity><Action>Input` | `NotificationMarkReadInput` |
| DB record type | `<Domain>DbRecord` | `AccountNotificationDbRecord` |
| DB insert type | `<Domain>DbInsert` | `AccountNotificationDbInsert` |
| View type | `<Domain>.<Level>View` | `Workspace.PublicView` |
| Mapper function | `to<Domain><Level>View` | `toWorkspacePublicView` |

---

## 8. Import Paths

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

## 9. Type Derivation from Drizzle Schema

The Drizzle ORM schema in `next/lib/database/schema.ts` is the **ultimate source of truth** for database shapes. Domain types should be derived from it — not manually duplicated.

### JSONB Column Typing

JSONB columns should be typed at the schema level with `.$type<>()` for compile-time safety:

```typescript
// In schema.ts
export interface WorkspaceProfileJsonb {
    logo?: string | null;
    phone?: string | null;
    address?: string | null;
}

export const workspaces = pgTable('workspaces', {
    id: varchar('id').primaryKey(),
    title: text('title').notNull(),
    profile: jsonb('profile').$type<WorkspaceProfileJsonb>().default({}),
    isStore: boolean('is_store').default(false),
    // ...
});
```

### Shared Timestamps

The single `Timestamps` definition lives in `_shared.types/base/Base.types.ts` and accepts both `Date` and `string` to be compatible with both DB records and serialized API responses:

```typescript
export interface Timestamps {
    createdAt: Date | string;
    updatedAt?: Date | string | null;
}
```

The **mapper** bridges DB ↔ domain and uses `satisfies` to enforce the shared contract:
```typescript
// next/lib/domain/notification/Notification.mapper.ts
export function toPrivateAccess(record: AccountNotificationDbRecord) {
    return {
        id: record.id,
        title: record.title,
        message: record.message,
        isRead: record.isRead,
        createdAt: record.createdAt,
        accountId: record.accountId,
        canDelete: true,
        canMarkAsRead: !record.isRead,
    } satisfies Notification.PrivateAccess;
}
```

> **Critical Conventions:**
> - DB column names are `snake_case`. Domain type properties are always `camelCase`.
> - Never access DB column names directly in UI components — always go through the mapper.
> - Cards use `workspaceId` to identify the owning workspace. The old `storeId` column has been removed — workspaces with `isStore: true` serve as stores.

---

## 10. Data Flow (End to End)

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
    │  Drizzle ORM query → returns DbRecord
    ▼
Mapper (Notification.mapper.ts)
    │  toPrivateAccess(dbRecord) satisfies Notification.PrivateAccess
    ▼
API Route Handler
    │  return okResponse(privateAccessObject)
    ▼
Client receives typed Notification.PrivateAccess JSON
```

---

## 11. Adding a New Domain Entity (Checklist)

1. **Zod schema** → create `_shared.types/domain/<Domain>.schemas.ts`
2. **Domain types** → create `_shared.types/domain/<Domain>.types.ts` with namespace + access levels
3. **View types** → add `PublicView`, `PrivateView`, `FullView` interfaces to the namespace
4. **Barrel export** → add `export * from './domain/<Domain>.schemas'` and `export * from './domain/<Domain>.types'` to `_shared.types/Shared.types.ts`
5. **DB schema** → add table to `next/lib/database/schema.ts`, export `DbRecord` and `DbInsert` types. Type JSONB columns with `.$type<>()`.
6. **Mapper** → create `next/lib/domain/<domain>/<Domain>.mapper.ts` using `satisfies` against shared types
7. **Repository** → create `next/lib/domain/<domain>/<Domain>.repository.ts`
8. **Service** → create `next/lib/domain/<domain>/<Domain>.service.ts`
9. **API route** → create thin controller in `next/app/api/...`, use `validateBody()` + `Domain.factory.ts`

---

## 12. Anti-Patterns (Never Do These)

| ❌ Wrong | ✅ Correct |
|---|---|
| Define inline view interfaces in mapper files | Define views in `_shared.types/domain/` and use `satisfies` |
| Define types inside `next/lib/domain/` for client consumption | Define types in `_shared.types/domain/` |
| Install `zod` inside `next/package.json` | Zod lives only in root `package.json` |
| Access `notification.mark_as_read` in UI | Use `notification.isRead` (camelCase domain type) |
| Copy-paste type from schema into Expo | Import from `@tiktak/shared/types/...` |
| Return raw DB record from API route | Always map through `*.mapper.ts` first |
| Use `any` as DB record type | Use `AccountNotificationDbRecord` from schema |
| Use `storeId` on cards | Cards use `workspaceId`; workspaces with `isStore: true` are stores |
| Define `Timestamps` locally in each domain | Import from `@tiktak/shared/types/base/Base.types` |
| Leave JSONB columns untyped | Type with `.$type<Interface>()` in schema.ts |
