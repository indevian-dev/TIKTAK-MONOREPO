# Zod Validation Guide

## Architecture — Single Source of Truth

Zod schemas live in `_shared.types/` and are imported directly by all packages (Next.js, Expo, etc.) via Bun workspace hoisting.

| Layer | What lives here |
|---|---|
| `_shared.types/auth/Auth.schemas.ts` | Auth Zod schemas + `z.infer<>` types |
| `_shared.types/domain/*.schemas.ts` | Domain Zod schemas + `z.infer<>` types |
| `next/lib/utils/Zod.validate.util.ts` | `validateBody()`, `validateObject()`, `validateSearchParams()` helpers |

> **No more `next/lib/domain/*.inputs.ts`** — schemas now live entirely in `_shared.types/` because Bun workspace hoists `zod` to the root `node_modules/`.

---

## Where Schemas Live

```
_shared.types/
  auth/Auth.schemas.ts          ← LoginSchema, RegisterSchema, OTP, OAuth, reset, 2FA
  domain/
    Workspace.schemas.ts        ← WorkspaceCreateSchema, WorkspaceUpdateSchema, RoleCreateSchema,
                                   RoleUpdateSchema, RolePermissionsSchema, WorkspaceApplicationSchema, MediaUploadSchema
    Card.schemas.ts             ← CardCreateSchema, CardUpdateSchema, CardApproveSchema, CardSearchSchema
    Category.schemas.ts         ← CategoryCreateSchema, CategoryUpdateSchema, CategoryListQuerySchema
    Content.schemas.ts          ← BlogCreateSchema, BlogUpdateSchema, PageCreateSchema, PromptCreateSchema
    Jobs.schemas.ts             ← JobControlSchema, JobLogFilterSchema
    Notification.schemas.ts     ← NotificationMarkReadSchema, NotificationPreferencesSchema, SendNotificationSchema
    Support.schemas.ts          ← DeactivationRequestSchema, SupportTicketCreateSchema, SupportTicketUpdateSchema
    User.schemas.ts             ← UserProfileUpdateSchema, UserSuspendSchema, UserSearchSchema, UserAssignRoleSchema
```

---

## Using `validateBody()`

```typescript
import { LoginSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (req, { module }) => {
    // 1. Parse + validate
    const parsed = await validateBody(req, LoginSchema);

    // 2. Early-return on failure — returns 400 with validationErrors[]
    if (!parsed.success) return parsed.errorResponse;

    // 3. Use typed data — no casting needed
    const { email, password } = parsed.data;

    return okResponse(await module.auth.login({ email, password }));
});
```

### What the 400 looks like
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body validation failed",
    "validationErrors": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "password", "message": "Password must be at least 8 characters" }
    ]
  }
}
```

---

## Using `validateObject()` and `validateSearchParams()`

For validating query strings or pre-parsed data:

```typescript
import { validateSearchParams } from '@/lib/utils/Zod.validate.util';
import { CardSearchSchema } from '@tiktak/shared/types/domain/Card.schemas';

export const GET = unifiedApiHandler(async (req) => {
    const { searchParams } = new URL(req.url);

    const parsed = validateSearchParams(searchParams, CardSearchSchema);
    if (!parsed.success) {
        return errorResponse('Invalid query parameters', 400);
    }

    const { query, page, pageSize } = parsed.data; // typed + coerced
});
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Schema | `<Entity><Action>Schema` | `LoginSchema`, `WorkspaceUpdateSchema` |
| Inferred type | `<Entity><Action>Input` | `LoginInput`, `WorkspaceUpdateInput` |
| Schema file | `<Domain>.schemas.ts` (in `_shared.types/`) | `Auth.schemas.ts`, `Workspace.schemas.ts` |

---

## Creating a New Domain Schema

1. Open or create `_shared.types/domain/<Domain>.schemas.ts`
2. Define your schema and export the inferred type:
    ```typescript
    import { z } from 'zod';

    export const MyEntityCreateSchema = z.object({
        name: z.string().min(2),
        value: z.number().positive(),
    });

    export type MyEntityCreateInput = z.infer<typeof MyEntityCreateSchema>;
    ```
3. Export from `_shared.types/Shared.types.ts`:
    ```typescript
    export * from './domain/MyEntity.schemas';
    ```
4. Import in the API route:
    ```typescript
    import { MyEntityCreateSchema } from '@tiktak/shared/types/domain/MyEntity.schemas';
    ```
5. Use `validateBody()` in the API route.

---

## Currently Wired Routes

| Route | Schema | Source |
|---|---|---|
| `POST /api/auth/login` | `LoginSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/register` | `RegisterSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/verify` | `VerifyOtpSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/reset/request` | `PasswordResetRequestSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/reset/set` | `PasswordResetSetSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `PATCH /api/auth/update-contact` | `UpdateContactSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/oauth/initiate` | `OAuthInitiateSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/2fa/validate` | `TwoFactorValidateSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `POST /api/auth/2fa/generate` | `TwoFactorGenerateSchema` | `_shared.types/auth/Auth.schemas.ts` |
| `PATCH /api/auth` | `UserProfileUpdateSchema` | `_shared.types/domain/User.schemas.ts` |
| `PUT /api/workspaces/*/stores/update/[id]` | `WorkspaceUpdateSchema` | `_shared.types/domain/Workspace.schemas.ts` |
| `POST /api/workspaces/*/roles/create` | `RoleCreateSchema` | `_shared.types/domain/Workspace.schemas.ts` |
| `POST /api/workspaces/*/roles/[id]/permissions` | `RolePermissionsSchema` | `_shared.types/domain/Workspace.schemas.ts` |
| `PUT /api/workspaces/moderator/*/cards/update/[id]` | `CardUpdateSchema` | `_shared.types/domain/Card.schemas.ts` |
| `POST /api/deactivation` | `DeactivationRequestSchema` | `_shared.types/domain/Support.schemas.ts` |
