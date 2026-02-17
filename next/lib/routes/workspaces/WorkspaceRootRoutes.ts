import type { EndpointsMap } from "@/types";
import { createRouteFactory } from "../RouteFactory";

// Create root-specific endpoint factory for workspace management
const createRootEndpoint = createRouteFactory({
  workspace: 'root',
  needEmailVerification: true,
  needPhoneVerification: true
});

export const workspacesRootEndpoints: EndpointsMap = {
  // ============================================
  // Workspace Management APIs
  // ============================================

  "/api/workspaces/list": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "api",
  }),

  "/api/workspaces/create": createRootEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),

  "/api/workspaces/onboarding": createRootEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),

  // ============================================
  // Billing & Subscriptions API
  // ============================================
  "/api/workspaces/billing/subscriptions": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/workspaces/billing/transactions": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/workspaces/billing/tiers": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/workspaces/billing/coupon": createRootEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/workspaces/billing/pay": createRootEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/workspaces/billing/initiate": createRootEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),

  // ============================================
  // Workspace Root Pages
  // ============================================
  "/workspaces": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),

  "/workspaces/onboarding/welcome": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),
  "/workspaces/onboarding/provider": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),

  "/workspaces/enroll/:providerId": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),

  "/workspaces/profile": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),

  "/workspaces/billing": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),

  "/workspaces/billing/checkout": createRootEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),
};
