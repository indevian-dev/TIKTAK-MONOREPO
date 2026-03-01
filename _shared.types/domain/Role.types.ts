/**
 * Role / Access / Invitation Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper bridges DB records → these types.
 *
 * Input types (what clients SEND) live in Workspace.schemas.ts (Zod):
 * RoleCreateSchema, RoleUpdateSchema, RolePermissionsSchema.
 * ════════════════════════════════════════════════════════════════
 */

export namespace Role {
    // ═══════════════════════════════════════════════════════════════
    // API OUTPUT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public view — returned by the roles API (mapped from DB rows) */
    export interface PublicView {
        id: string;
        name: string;
        permissions: string[];
        forWorkspaceType: string | null;
        description: string | null
    }

    /** Private: workspace member sees available roles */
    export interface PrivateView {
        id: string;
        name: string;
        forWorkspaceType: string | null;
    }

    /** Full: staff — includes permissions payload */
    export interface FullView extends PrivateView {
        permissions: unknown;
        createdAt: Date;
    }
}

export namespace Access {
    /** Private: user sees their workspace access */
    export interface PrivateView {
        id: string;
        targetWorkspaceId: string | null;
        viaWorkspaceId: string | null;
        accessRole: string | null;
        subscribedUntil: Date | null;
        subscriptionTier: string | null;
        createdAt: Date;
    }

    /** Full: staff — includes actor account */
    export interface FullView extends PrivateView {
        actorAccountId: string | null;
    }
}

export namespace Invitation {
    /** Private: invitee sees their invitation status */
    export interface PrivateView {
        id: string;
        forWorkspaceId: string | null;
        accessRole: string | null;
        isApproved: boolean | null;
        isDeclined: boolean | null;
        expireAt: Date | null;
        createdAt: Date;
    }

    /** Full: staff — includes both parties */
    export interface FullView extends PrivateView {
        invitedAccountId: string | null;
        invitedByAccountId: string | null;
    }
}
