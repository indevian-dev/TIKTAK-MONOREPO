# Next.js Workspace Architecture

## 1. Overview
The platform operates on a **Workspace-First Architecture**. Instead of rigid user-to-organization links, the system is modeled as a hierarchy of computational nodes (Workspaces).
- **Accounts:** Represent the physical user (identity).
- **Workspaces:** Represent the organizational boundaries.
- **Workspace Accesses:** The connective tissue (`workspace_accesses`) linking an `actorAccountId` to a `targetWorkspaceId` with a specific `accessRole`.

## 2. Interface Types & Scopes
The UI layer is decoupled from the Workspace data layer. Access is determined by the `ui_type` combined with the user's role in that boundary.
- **Staff (Admin) Dashboard:** Global access, cross-workspace visibility. Operates in `workspaces/staff/`.
- **Provider Dashboard:** Top-level organization management. Operates in `workspaces/provider/`.
- **Student/User Portal:** End-user interaction restricted directly to a personal or assigned node.

## 3. Authorization Flow (`CoreAuthorizer`)
Every request inside the `/workspaces/...` Next.js routes is intercepted to validate the Workspace Context:
1. The URL parameter (e.g., `[workspaceId]`) is parsed.
2. The `CoreAuthorizer` evaluates if the decoded `session_token` maps to an `account` that has a valid `workspace_accesses` role association for the target `workspaceId`.
3. If valid, the resolved `workspaceId` and role permissions are injected into `UnifiedContext`.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** scope database reads and writes to `workspaceId`. The system relies on Logical Sharding; failing to filter by `workspaceId` creates data leakage across organizations.
- **ALWAYS** rely on the layout or interceptor to validate `workspaceId` access. Do not write manual "does user belong to workspace" queries inside every individual service method.
- **DO NOT** assume `accountId = workspace_access_id`. A single Account can hold multiple Workspace Access relationships across different organizations.
- **DO** use the unified authorization methods (e.g., evaluating `ctx.authData.permissions`) rather than writing bespoke DB lookups inside controllers to determine if a button should be shown.
