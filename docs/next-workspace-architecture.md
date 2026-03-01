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

## 5. Workspace as Store
A workspace of type `provider` can function as a **store** when its `is_store` column is `true`. Cards reference their owning workspace via `workspace_id` — there is **no** separate `store_id` column on cards.

- `workspaces.is_store` (boolean, default `false`) — flags whether the workspace operates as a public-facing store.
- When rendering store badges, UI widgets check `card.workspaceId` (not an old `storeId`).
- Store detail pages load workspace data by workspace ID and filter cards using `workspaceId` in the search context.

## 6. Member Management

Direct members of a workspace have `targetWorkspaceId === viaWorkspaceId`. The system provides full CRUD for managing these members.

### API Endpoints (Provider & Advertiser)
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/workspaces/{type}/{workspaceId}/members` | List members |
| `POST` | `/api/workspaces/{type}/{workspaceId}/members/invite` | Invite by email |
| `PATCH` | `/api/workspaces/{type}/{workspaceId}/members/{accessId}` | Update role/expiry |
| `DELETE` | `/api/workspaces/{type}/{workspaceId}/members/{accessId}/delete` | Remove member |
| `GET` | `/api/workspaces/{type}/{workspaceId}/members/roles` | List available roles |
| `GET` | `/api/workspaces/{type}/{workspaceId}/members/invitations` | List pending invitations |

### Safety Rules
- **Last member guard:** Cannot remove a member if they are the only direct member of a workspace.
- **Role validation:** Changing a member's role validates against `workspace_roles` table.

## 7. Workspace Roles

Roles are stored in `workspace_roles` and scoped by `for_workspace_type`:
- **Provider roles:** `Provider Manager`, `Provider Director`, `Provider Editor`, `Provider Viewer`
- **Advertiser roles:** `Advertiser Manager`, `Advertiser Editor`, `Advertiser Viewer`

Each role has a `permissions` JSONB column with boolean permission flags checked by the middleware.

## 8. Invitation System

Invitations are stored in `workspace_invitations`. Flow:
1. Workspace admin calls `POST .../members/invite` with `{ email, role }`
2. System looks up the account by email and creates an invitation
3. Invited user sees the invitation via `getMyInvitations(accountId)`
4. User responds with `approve` or `decline`
5. On approval, a direct access record is created in `workspace_accesses`

Invitations expire after 7 days by default.

## 9. Advertiser Workspaces

Advertiser workspaces follow the same architecture as provider workspaces but with `type = 'advertiser'`. They have their own:
- Route factory with `workspace: 'advertiser'`
- Permission namespaces (`ADVERTISER_*`)
- Roles scoped to `for_workspace_type = 'advertiser'`
- Mirror API endpoints under `/api/workspaces/advertiser/...`
