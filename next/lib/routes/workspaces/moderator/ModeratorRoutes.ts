import type { EndpointsMap } from "@/types";
import { createRouteFactory } from "../../RouteFactory";

// Create moderator-specific endpoint factory
const createModeratorEndpoint = createRouteFactory({
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

export const moderatorEndpoints: EndpointsMap = {
    // ============================================
    // Moderator Pages
    // ============================================
    "/workspaces/moderator/:workspaceId": createModeratorEndpoint({
        method: "GET",
        authRequired: true,
        permission: "MODERATOR_ACCESS",
        type: "page",
    }),

    // ============================================
    // Moderator APIs
    // ============================================
    "/api/workspaces/moderator/:workspaceId/cards/approve/:id": createModeratorEndpoint({
        method: "POST",
        authRequired: true,
        permission: "MODERATOR_CARD_APPROVE",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/delete/:id": createModeratorEndpoint({
        method: "DELETE",
        authRequired: true,
        permission: "MODERATOR_CARD_DELETE",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/sync/:id": createModeratorEndpoint({
        method: "POST",
        authRequired: true,
        permission: "MODERATOR_CARD_SYNC",
        type: "api",
    }),
    "/api/workspaces/moderator/:workspaceId/cards/update/:id": createModeratorEndpoint({
        method: "PUT",
        authRequired: true,
        permission: "MODERATOR_CARD_UPDATE",
        type: "api",
    }),
};
