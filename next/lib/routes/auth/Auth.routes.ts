import type { RoutesMap } from "@/lib/routes/Route.types";
import { createRouteFactory } from "../Route.factory";


// Create staff-specific Route factory
const createStaffRoute = createRouteFactory({
  workspace: undefined,
  needEmailVerification: false,
  needPhoneVerification: false
});


export const authRoutes: RoutesMap = {
  // ============================================
  // Auth APIs
  // ============================================
  "/api/auth": createStaffRoute({
    method: "GET",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/login": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/register": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/logout": createStaffRoute({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/refresh": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/me": createStaffRoute({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/oauth/initiate": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/oauth/callback": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),

  "/api/auth/update-contact": createStaffRoute({
    method: "PATCH",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/verify": createStaffRoute({
    method: "GET",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/verify/request": createStaffRoute({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/verify/check": createStaffRoute({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/2fa/generate": createStaffRoute({
    method: "POST",
    authRequired: true,
    needEmailVerification: true,
    type: "api",
  }),
  "/api/auth/2fa/validate": createStaffRoute({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/ably-token": createStaffRoute({
    method: "POST",
    authRequired: true,
    type: "api",
  }),
  "/api/auth/reset/request": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/reset/set": createStaffRoute({
    method: "POST",
    authRequired: false,
    type: "api",
  }),
  "/api/auth/avatar": createStaffRoute({
    method: "GET",
    authRequired: true,
    type: "api",
  }),

  // ============================================
  // Auth Pages
  // ============================================
  "/auth/login": createStaffRoute({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/register": createStaffRoute({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/reset": createStaffRoute({
    method: "GET",
    authRequired: false,
    type: "page",
  }),
  "/auth/oauth/callback": createStaffRoute({
    method: "GET",
    authRequired: false,
    type: "page",
  }),

  "/auth/verify": createStaffRoute({
    method: "GET",
    authRequired: true,
    type: "page",
  }),
};
