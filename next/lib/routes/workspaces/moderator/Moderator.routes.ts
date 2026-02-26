import type { RoutesMap } from "@/lib/routes/Route.types";
import { createRouteFactory } from "../../Route.factory";

// Create moderator-specific route factory
const createRoute = createRouteFactory({
    workspace: 'moderator',
    needEmailVerification: true,
    needPhoneVerification: true
});

export const PERMISSIONS = {
    MODERATOR_ACCESS: "Access moderator dashboard",
    MODERATOR_CARD_APPROVE: "Approve or decline cards",
    MODERATOR_CARD_DELETE: "Delete cards for moderation",
    MODERATOR_CARD_UPDATE: "Update cards during moderation",
    MODERATOR_CARD_SYNC: "Sync moderated cards to search",
} as const;

export const moderatorRoutes: RoutesMap = {
    // ============================================
    // Moderator Pages
    // ============================================
    "/workspaces/moderator/:workspaceId": createRoute({
        method: "GET",
        authRequired: true,
        permission: "MODERATOR_ACCESS",
        type: "page",
    }),

    // ============================================
    // Moderator APIs
    // ============================================
    "/api/workspaces/moderator/:workspaceId/cards/approve/:id": createRoute({
        method: "POST",
        authRequired: true,
        permission: "MODERATOR_CARD_APPROVE",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/delete/:id": createRoute({
        method: "DELETE",
        authRequired: true,
        permission: "MODERATOR_CARD_DELETE",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/sync/:id": createRoute({
        method: "POST",
        authRequired: true,
        permission: "MODERATOR_CARD_SYNC",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/update/:id": createRoute({
        method: "PUT",
        authRequired: true,
        permission: "MODERATOR_CARD_UPDATE",
        type: "api",
    }),
};
