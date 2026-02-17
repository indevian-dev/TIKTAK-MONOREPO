import type { EndpointsMap } from "@/types";
import { createRouteFactory } from "../../RouteFactory";

// Create staff-specific endpoint factory
const createStaffEndpoint = createRouteFactory({
  workspace: 'staff',
  needEmailVerification: true,
  needPhoneVerification: true
});

export const PERMISSIONS = {
  STAFF_ACCESS: "Access staff dashboard",

  STAFF_USER_READ: "View users info",
  STAFF_USER_UPDATE: "Update user information",
  STAFF_USER_DELETE: "Delete users",

  STAFF_CATEGORY_READ: "View categories and filters",
  STAFF_CATEGORY_UPDATE: "Manage categories and filters",

  STAFF_STORE_READ: "View all stores",
  STAFF_STORE_UPDATE: "Update stores",
  STAFF_STORE_DELETE: "Delete stores",

  STAFF_MAIL_SEND: "Manage system emails",
  STAFF_OPEN_SEARCH_SYNC: "Sync data with OpenSearch",

  STAFF_JOBS_READ: "Monitor background jobs",
} as const;

export const staffEndpoints: EndpointsMap = {
  // ============================================
  // Staff Pages
  // ============================================
  "/workspaces/staff/:workspaceId": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_ACCESS",
    type: "page",
  }),

  "/workspaces/staff/:workspaceId/users": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_USER_READ",
    type: "page",
  }),

  "/workspaces/staff/:workspaceId/categories": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_CATEGORY_READ",
    type: "page",
  }),

  "/workspaces/staff/:workspaceId/stores": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_STORE_READ",
    type: "page",
  }),

  // ============================================
  // Staff APIs
  // ============================================

  // Users Management
  "/api/workspaces/staff/:workspaceId/users": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_USER_READ",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/users/:id": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_USER_READ",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/users/update/:id": createStaffEndpoint({
    method: "PUT",
    authRequired: true,
    permission: "STAFF_USER_UPDATE",
    type: "api",
  }),

  // Categories & Filters
  "/api/workspaces/staff/:workspaceId/categories": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_CATEGORY_READ",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/categories/update/:id": createStaffEndpoint({
    method: "PUT",
    authRequired: true,
    permission: "STAFF_CATEGORY_UPDATE",
    type: "api",
  }),

  // Stores Management (Global)
  "/api/workspaces/staff/:workspaceId/stores": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_STORE_READ",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/stores/delete/:id": createStaffEndpoint({
    method: "DELETE",
    authRequired: true,
    permission: "STAFF_STORE_DELETE",
    type: "api",
  }),

  // System Settings
  "/api/workspaces/staff/:workspaceId/mail/send": createStaffEndpoint({
    method: "POST",
    authRequired: true,
    permission: "STAFF_MAIL_SEND",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/open-search/sync": createStaffEndpoint({
    method: "POST",
    authRequired: true,
    permission: "STAFF_OPEN_SEARCH_SYNC",
    type: "api",
  }),
  "/api/workspaces/staff/:workspaceId/access-endpoints": createStaffEndpoint({
    method: "GET",
    authRequired: true,
    permission: "STAFF_ACCESS",
    type: "api",
  }),
};
