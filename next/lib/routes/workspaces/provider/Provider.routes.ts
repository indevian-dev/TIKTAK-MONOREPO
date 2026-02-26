import type { RoutesMap } from "@/lib/routes/Route.types";
import { createRouteFactory } from "../../Route.factory";

// Create provider-specific route factory
const createRoute = createRouteFactory({
  workspace: 'provider',
  needEmailVerification: true,
  needPhoneVerification: true
});

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export const PERMISSIONS = {
  PROVIDER_ACCESS: "Access provider dashboard",

  PROVIDER_CARD_READ: "View cards",
  PROVIDER_CARD_CREATE: "Create new cards",
  PROVIDER_CARD_UPDATE: "Update cards",
  PROVIDER_CARD_DELETE: "Delete cards",

  PROVIDER_STORE_READ: "View stores",
  PROVIDER_STORE_UPDATE: "Update store information",

  PROVIDER_CONVERSATION_READ: "View conversations",
  PROVIDER_NOTIFICATION_READ: "View notifications",

  PROVIDER_ACCOUNT_READ: "View account info",
  PROVIDER_ROLE_READ: "View roles",
} as const;

// ═══════════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════════

export const providerRoutes: RoutesMap = {
  // ============================================
  // Provider Pages
  // ============================================
  "/workspaces/provider/:workspaceId": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ACCESS",
    type: "page",
  }),

  // Cards Pages
  "/workspaces/provider/:workspaceId/cards": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "page",
  }),
  "/workspaces/provider/:workspaceId/cards/create": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_CREATE",
    type: "page",
  }),
  "/workspaces/provider/:workspaceId/cards/:id": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "page",
  }),

  // Stores Pages
  "/workspaces/provider/:workspaceId/stores": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_STORE_READ",
    type: "page",
  }),

  // ============================================
  // Provider APIs
  // ============================================

  // Cards APIs
  "/api/workspaces/provider/:workspaceId/cards": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/create": createRoute({
    method: "POST",
    authRequired: true,
    permission: "PROVIDER_CARD_CREATE",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/:id": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/update/:id": createRoute({
    method: "PUT",
    authRequired: true,
    permission: "PROVIDER_CARD_UPDATE",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/delete/:id": createRoute({
    method: "DELETE",
    authRequired: true,
    permission: "PROVIDER_CARD_DELETE",
    type: "api",
  }),

  // Stores APIs
  "/api/workspaces/provider/:workspaceId/stores": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_STORE_READ",
    type: "api",
  }),

  // Accounts & Roles
  "/api/workspaces/provider/:workspaceId/accounts": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ACCOUNT_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/roles": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ROLE_READ",
    type: "api",
  }),

  // Conversations & Notifications
  "/api/workspaces/provider/:workspaceId/conversations": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CONVERSATION_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/notifications": createRoute({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_NOTIFICATION_READ",
    type: "api",
  }),
};
