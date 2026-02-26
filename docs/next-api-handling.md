# Next.js API Handling Guidelines

## 1. The Unified API Interceptor
All backend API routes (`app/api/.../route.ts`) must be wrapped using the unified API interceptor (`unifiedApiHandler` or `withApiHandler`) from `@/lib/middleware/Interceptor.Api.middleware`. 

### Why Use `unifiedApiHandler`?
1. **Security & Validation**: It automatically checks the route against the global definition in `lib/routes/_Route.index.ts` to ensure `authRequired` and RBAC checks are fully passed *before* your code executes.
2. **Context Injection**: It guarantees access to `UnifiedContext` (which provides secure `ctx.accountId`, `ctx.log`, `ctx.db`, and the dependency injected `ctx.module`).
3. **Error Grabbing**: Uncaught throws inside the handler are caught and formatted elegantly.

### Usage Example
```typescript
import { NextRequest } from 'next/server';
import { unifiedApiHandler, UnifiedContext } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req: NextRequest, ctx: UnifiedContext) => {
    // ctx.authData is guaranteed and secure here
    const accountId = ctx.authData.account.id;
    const { log, module } = ctx;

    try {
        const result = await module.someDomain.doThing(accountId);
        return okResponse(result);
    } catch (e) {
        log.error("Failed to do things", e);
        return errorResponse("Internal issue", 500);
    }
}, { authRequired: true }); 
```

## 2. Standardized Responses
Never instantiate `NextResponse` directly for JSON payloads. Always use the helper methods found in `@/lib/middleware/Response.Api.middleware`.

### Helpers Available:
- **`okResponse(data, message?)`**: Status 200 `{ success: true, data: T }`
- **`createdResponse(data, message?)`**: Status 201
- **`errorResponse(message, status, code?)`**: Properly enveloped error output.
- **`notFoundResponse(msg?)`**, **`forbiddenResponse(msg?)`**, **`serverErrorResponse(msg?)`**

## 3. Route Configuration Registration
Every API route must exist inside the `RoutesMap` configuration.
- Check `next/lib/routes/_Route.index.ts` to ensure the route is registered in the appropriate collection (e.g., `customRoutes`, `publicRoutes`, `workspacesRootRoutes`).
- Do not build a route without matching its HTTP method exactly inside the `createRoute()` factory pattern.

## 4. Type Safety
- Do not use `ApiRequest` (deprecated). Use `(req: NextRequest, ctx: UnifiedContext)`.
- If an API response involves new types, define those types in the root monorepo `_shared.types/api/` folder so the Native app (`expo`) can consume them identically without duplication.

## 5. Request Body Validation (Zod)
All API routes that accept a request body **must** validate it using a Zod schema before passing data to a service.

### Pattern
```typescript
import { LoginSchema } from '@/lib/domain/auth/Auth.inputs';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (req, { module }) => {
    const parsed = await validateBody(req, LoginSchema);
    if (!parsed.success) return parsed.errorResponse; // auto returns 400 with field errors

    const { email, password } = parsed.data; // fully typed
    return okResponse(await module.auth.login({ email, password }));
});
```

### Rules
- **Never** use raw `req.json()` for request bodies that feed into service methods.
- Schemas are defined in `next/lib/domain/<domain>/*.inputs.ts` (canonical Zod files).
- Input types shared with `expo` are re-exported as plain TS types from `_shared.types/`.
- A failed validation returns `400` with a structured `validationErrors` array matching `ErrorApiResponse`.

→ See **[next-zod-validation.md](./next-zod-validation.md)** for the full guide.

