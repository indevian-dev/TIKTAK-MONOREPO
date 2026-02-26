# Next.js Logging Standards

## 1. Overview
We distinguish between **Diagnostic/System Logs** (using Pino) and **Action/Audit Logs** (persisted to the PostgreSQL database).
- **System Logs:** Ephemeral, high-volume instrumentation. Provides request IDs, execution times, and payload metadata for standard cloud observability.
- **Action Logs:** Durable records of highly important business events ("User A transferred item to User B").

## 2. Directory Structure
- **Core Logger Configuration:** `next/lib/logging/Request.logger.ts` (Builds the Pino instance injected into requests).
- **Action Logger Implementations:** `next/lib/logging/Action.logger.ts` (Writes specifically to `action_logs` table).

## 3. Implementation Patterns

### Contextual System Logging
The API Interceptor (`withApiHandler`) automatically spins up a Pino instance injected with a `reqId` (Request ID) for tracing. It is attached to the Request context.
```typescript
import { okResponse } from '@/lib/middleware/Response.Api.middleware';
import { unifiedApiHandler, UnifiedContext } from '@/lib/middleware/Interceptor.Api.middleware';

export const GET = unifiedApiHandler(async (req, ctx: UnifiedContext) => {
    // 1. Destructure log from UnifiedContext
    const { log } = ctx;
    
    // 2. Log natively with metadata objects
    log.info('Fetching user details', { accountId: ctx.authData.account.id });
    
    return okResponse({ status: "ok" });
});
```

### Action/Audit Logging
For business critical actions (Auth success, Password changes, critical entity deletion), the codebase uses `logAccountAction` to fire-and-forget an audit log to the database.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** use the injected logger via `ctx.log` instead of global `console.log`. This ensures logs are strictly correlated by Request ID in cloud dashboards.
- **ALWAYS** pass complex properties as a metadata object `log.info("msg", { data })` instead of string-concatenating them `log.info("msg " + data)`. This prevents malformed JSON payloads in Pino outputs.
- **DO NOT** manually log API "Request Started" or "Request Ended" lifecycle events inside the route handlers; the `withApiHandler` automatically logs `log.http(...)` containing method paths and durations on entry and exit.
- **DO** properly log errors, passing the error instance directly to the logger: `ctx.log.error('Operation failed', e)`.
