
import type { WorkspaceAccessDbRecord, WorkspaceRoleDbRecord, WorkspaceInvitationDbRecord } from "@/lib/database/schema";
import type { Role, Access, Invitation } from '@tiktak/shared/types/domain/Role.types';

// ═══════════════════════════════════════════════════════════════
// ROLE / ACCESS / INVITATION MAPPERS — satisfies shared types
// ═══════════════════════════════════════════════════════════════

// ─── ROLE ────────────────────────────────────────────────────

export function toRolePrivateView(row: WorkspaceRoleDbRecord) {
    return {
        id: row.id,
        name: row.name,
        forWorkspaceType: row.forWorkspaceType,
    } satisfies Role.PrivateView;
}

export function toRoleFullView(row: WorkspaceRoleDbRecord) {
    return {
        ...toRolePrivateView(row),
        permissions: row.permissions,
        createdAt: row.createdAt,
    } satisfies Role.FullView;
}

// ─── ACCESS ──────────────────────────────────────────────────

export function toAccessPrivateView(row: WorkspaceAccessDbRecord) {
    return {
        id: row.id,
        targetWorkspaceId: row.targetWorkspaceId,
        viaWorkspaceId: row.viaWorkspaceId,
        accessRole: row.accessRole,
        subscribedUntil: row.subscribedUntil,
        subscriptionTier: row.subscriptionTier,
        createdAt: row.createdAt,
    } satisfies Access.PrivateView;
}

export function toAccessFullView(row: WorkspaceAccessDbRecord) {
    return {
        ...toAccessPrivateView(row),
        actorAccountId: row.actorAccountId,
    } satisfies Access.FullView;
}

// ─── INVITATION ──────────────────────────────────────────────

export function toInvitationPrivateView(row: WorkspaceInvitationDbRecord) {
    return {
        id: row.id,
        forWorkspaceId: row.forWorkspaceId,
        accessRole: row.accessRole,
        isApproved: row.isApproved,
        isDeclined: row.isDeclined,
        expireAt: row.expireAt,
        createdAt: row.createdAt,
    } satisfies Invitation.PrivateView;
}

export function toInvitationFullView(row: WorkspaceInvitationDbRecord) {
    return {
        ...toInvitationPrivateView(row),
        invitedAccountId: row.invitedAccountId,
        invitedByAccountId: row.invitedByAccountId,
    } satisfies Invitation.FullView;
}
