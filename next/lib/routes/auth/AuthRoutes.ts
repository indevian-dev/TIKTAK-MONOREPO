import type { EndpointsMap } from "@/types";
import { createEndpoint } from "../RouteFactory";

export const authEndpoints: EndpointsMap = {
  // ============================================
  // Auth Pages
  // ============================================
  "/auth/login": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/register": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/reset": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/verify": createEndpoint({
    method: "GET",
    authRequired: true,
    type: "page",
  }),
  "/auth/oauth/callback": createEndpoint({
    method: "GET",
    authRequired: false,
    type: "page",
  }),

  // ============================================
  // Auth APIs
  // ============================================
  "/api/auth/login": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/register": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/logout": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/refresh": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/me": createEndpoint({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/oauth/initiate": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/oauth/callback": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/verify/request": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/verify/check": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/2fa/generate": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/2fa/validate": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/reset/request": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/reset/set": createEndpoint({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/ably-token": createEndpoint({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
};
