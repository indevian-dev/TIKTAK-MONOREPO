# Next.js Auth & User Flow

## 1. Overview
Authentication strictly separates **Identity** (The global session) from **Authorization** (Workspace access and Edge security).

## 2. Global Identity & Sessions
- **Session Tokens**: We use HttpOnly cookies (`session`) to persist logins across the monorepo. 
- **Redis Session Store**: The `SessionStore` (e.g. `lib/middleware/Store.Session.middleware.ts`) interacts with Redis to track TTL and quickly validate session tokens on edge requests.

## 3. The `CoreAuthorizer` (Middleware)
Authorization logic is centralized in the `CoreAuthorizer` middleware wrapper. It intercepts incoming requests from `unifiedApiHandler`.

### Flow mechanism:
1. `withApiHandler` checks `RouteValidator` to see if a route is `authRequired: true`.
2. It invokes `CoreAuthorizer.validateRouteRequest()`.
3. Evaluates token against Redis via `SessionStore`.
4. Checks RBAC relations based on `workspaceId` (if applicable in the route path).
5. Populates `UnifiedContext` with `AuthData` containing the resolved `accountId`, `userId`, and the session info.

## 4. Workflows & Rules
- **NEVER** write raw JWT parsing logic or manual cookie extraction inside a business service or API block.
- **ALWAYS** rely on `ctx.accountId` and `ctx.userId` injected via `unifiedApiHandler(async (req, ctx) => ... )`. 
- **DO NOT** make secure decisions based on localStorage values like `isLoggedIn`. The client strictly uses `GlobalAuthProfileContext.tsx` to display UI elements, but only the backend `SessionStore` verifies truth.
- When creating auth features (e.g. OTP verification), use the `/api/auth/verify` namespace inside `Auth.routes.ts`.
