import type { EndpointsMap } from "@/types";
import { createEndpoint } from "../RouteFactory";

export const publicEndpoints: EndpointsMap = {
  // ============================================
  // Public Pages
  // ============================================
  "/": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/cards": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/cards/:id": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/stores": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/stores/:id": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/blogs": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/blogs/:id": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),

  // Error & Utility Pages
  "/not-found": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/forbidden": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/unauthorized": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),

  // Auth Pages (Shared)
  "/auth/login": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/verify/email": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/verify/phone": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),

  // ============================================
  // Public APIs
  // ============================================
  "/api/cards": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/cards/:id": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/categories": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/cities": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/stores": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/blogs": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/accounts/check-username": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
};

/**
 * Helper to build public URLs from patterns
 */
export const buildPublicUrl = (pattern: string, params: Record<string, string | number>) => {
  let url = pattern;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, value.toString());
  }
  return url;
};
