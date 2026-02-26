
import type { WorkspaceAccessDbRecord, WorkspaceRoleDbRecord, WorkspaceInvitationDbRecord } from "@/lib/database/schema";
import { WorkspaceRole } from "../workspace/Workspace.types";

// ═══════════════════════════════════════════════════════════════
// ROLE VIEWS — Private / Full
// ═══════════════════════════════════════════════════════════════

/** Private: workspace member sees available roles */
export interface RolePrivateView {
    id: string;
    name: string;
    forWorkspaceType: string | null;
}

/** Full: staff — includes permissions payload */
export interface RoleFullView extends RolePrivateView {
    permissions: unknown;
    createdAt: Date;

}

// ═══════════════════════════════════════════════════════════════
// ACCESS VIEWS — Private / Full
// ═══════════════════════════════════════════════════════════════

/** Private: user sees their workspace access */
export interface AccessPrivateView {
    id: string;
    targetWorkspaceId: string | null;
    viaWorkspaceId: string | null;
    accessRole: string | null;
    subscribedUntil: Date | null;
    subscriptionTier: string | null;
    createdAt: Date;
}

/** Full: staff — includes actor account */
export interface AccessFullView extends AccessPrivateView {
    actorAccountId: string | null;
}

// ═══════════════════════════════════════════════════════════════
// INVITATION VIEWS — Private / Full
// ═══════════════════════════════════════════════════════════════

/** Private: invitee sees their invitation status */
export interface InvitationPrivateView {
    id: string;
    forWorkspaceId: string | null;
    accessRole: string | null;
    isApproved: boolean | null;
    isDeclined: boolean | null;
    expireAt: Date | null;
    createdAt: Date;
}

/** Full: staff — includes both parties */
export interface InvitationFullView extends InvitationPrivateView {
    invitedAccountId: string | null;
    invitedByAccountId: string | null;
}

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export function toRolePrivateView(row: WorkspaceRoleDbRecord): RolePrivateView {
    return {
        id: row.id,
        name: row.name,
        forWorkspaceType: row.forWorkspaceType,
    };
}

export function toRoleFullView(row: WorkspaceRoleDbRecord): RoleFullView {
    return {
        ...toRolePrivateView(row),
        permissions: row.permissions,
        createdAt: row.createdAt,
    };
}

export function toAccessPrivateView(row: WorkspaceAccessDbRecord): AccessPrivateView {
    return {
        id: row.id,
        targetWorkspaceId: row.targetWorkspaceId,
        viaWorkspaceId: row.viaWorkspaceId,
        accessRole: row.accessRole,
        subscribedUntil: row.subscribedUntil,
        subscriptionTier: row.subscriptionTier,
        createdAt: row.createdAt,
    };
}

export function toAccessFullView(row: WorkspaceAccessDbRecord): AccessFullView {
    return {
        ...toAccessPrivateView(row),
        actorAccountId: row.actorAccountId,
    };
}

export function toInvitationPrivateView(row: WorkspaceInvitationDbRecord): InvitationPrivateView {
    return {
        id: row.id,
        forWorkspaceId: row.forWorkspaceId,
        accessRole: row.accessRole,
        isApproved: row.isApproved,
        isDeclined: row.isDeclined,
        expireAt: row.expireAt,
        createdAt: row.createdAt,
    };
}

export function toInvitationFullView(row: WorkspaceInvitationDbRecord): InvitationFullView {
    return {
        ...toInvitationPrivateView(row),
        invitedAccountId: row.invitedAccountId,
        invitedByAccountId: row.invitedByAccountId,
    };
}
