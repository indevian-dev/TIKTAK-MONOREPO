import type { EndpointsMap } from "@/types";
import { createRouteFactory } from "../../RouteFactory";

// Create provider-specific endpoint factory
const createProviderEndpoint = createRouteFactory({
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

export const providerEndpoints: EndpointsMap = {
  // ============================================
  // Provider Pages
  // ============================================
  "/workspaces/provider/:workspaceId": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ACCESS",
    type: "page",
  }),

  // Cards Pages
  "/workspaces/provider/:workspaceId/cards": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "page",
  }),
  "/workspaces/provider/:workspaceId/cards/create": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_CREATE",
    type: "page",
  }),
  "/workspaces/provider/:workspaceId/cards/:id": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "page",
  }),

  // Stores Pages
  "/workspaces/provider/:workspaceId/stores": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_STORE_READ",
    type: "page",
  }),

  // ============================================
  // Provider APIs
  // ============================================

  // Cards APIs
  "/api/workspaces/provider/:workspaceId/cards": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/create": createProviderEndpoint({
    method: "POST",
    authRequired: true,
    permission: "PROVIDER_CARD_CREATE",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/:id": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CARD_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/update/:id": createProviderEndpoint({
    method: "PUT",
    authRequired: true,
    permission: "PROVIDER_CARD_UPDATE",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/cards/delete/:id": createProviderEndpoint({
    method: "DELETE",
    authRequired: true,
    permission: "PROVIDER_CARD_DELETE",
    type: "api",
  }),

  // Stores APIs
  "/api/workspaces/provider/:workspaceId/stores": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_STORE_READ",
    type: "api",
  }),

  // Accounts & Roles
  "/api/workspaces/provider/:workspaceId/accounts": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ACCOUNT_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/roles": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_ROLE_READ",
    type: "api",
  }),

  // Conversations & Notifications
  "/api/workspaces/provider/:workspaceId/conversations": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_CONVERSATION_READ",
    type: "api",
  }),
  "/api/workspaces/provider/:workspaceId/notifications": createProviderEndpoint({
    method: "GET",
    authRequired: true,
    permission: "PROVIDER_NOTIFICATION_READ",
    type: "api",
  }),
};
