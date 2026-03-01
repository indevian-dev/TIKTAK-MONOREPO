import type { RoutesMap } from "@/lib/routes/Route.types";
import { createRouteFactory } from "../../Route.factory";

// Create advertiser-specific route factory
const createRoute = createRouteFactory({
    workspace: 'advertiser',
    needEmailVerification: true,
    needPhoneVerification: true
});

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export const ADVERTISER_PERMISSIONS = {
    ADVERTISER_ACCESS: "Access advertiser dashboard",

    ADVERTISER_CAMPAIGN_READ: "View campaigns",
    ADVERTISER_CAMPAIGN_CREATE: "Create new campaigns",
    ADVERTISER_CAMPAIGN_UPDATE: "Update campaigns",
    ADVERTISER_CAMPAIGN_DELETE: "Delete campaigns",

    ADVERTISER_ACCOUNT_READ: "View account info",
    ADVERTISER_ROLE_READ: "View roles",

    ADVERTISER_MEMBER_READ: "View workspace members",
    ADVERTISER_MEMBER_INVITE: "Invite new members",
    ADVERTISER_MEMBER_UPDATE: "Update member role/expiry",
    ADVERTISER_MEMBER_REMOVE: "Remove members",
} as const;

// ═══════════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════════

export const advertiserRoutes: RoutesMap = {
    // ============================================
    // Advertiser Pages
    // ============================================
    "/workspaces/advertiser/:workspaceId": createRoute({
        method: "GET",
        authRequired: true,
        permission: "ADVERTISER_ACCESS",
        type: "page",
    }),

    // ============================================
    // Member Management APIs
    // ============================================
    "/api/workspaces/advertiser/:workspaceId/members": createRoute({
        method: "GET",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_READ",
        type: "api",
    }),
    "/api/workspaces/advertiser/:workspaceId/members/invite": createRoute({
        method: "POST",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_INVITE",
        type: "api",
    }),
    "/api/workspaces/advertiser/:workspaceId/members/:accessId": createRoute({
        method: "PATCH",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_UPDATE",
        type: "api",
    }),
    "/api/workspaces/advertiser/:workspaceId/members/:accessId/delete": createRoute({
        method: "DELETE",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_REMOVE",
        type: "api",
    }),
    "/api/workspaces/advertiser/:workspaceId/members/roles": createRoute({
        method: "GET",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_READ",
        type: "api",
    }),
    "/api/workspaces/advertiser/:workspaceId/members/invitations": createRoute({
        method: "GET",
        authRequired: true,
        permission: "ADVERTISER_MEMBER_READ",
        type: "api",
    }),

    // ============================================
    // Accounts & Roles
    // ============================================
    "/api/workspaces/advertiser/:workspaceId/roles": createRoute({
        method: "GET",
        authRequired: true,
        permission: "ADVERTISER_ROLE_READ",
        type: "api",
    }),
};
