

import type { WorkspaceDbRecord } from "@/lib/database/schema";
import type { Workspace } from '@tiktak/shared/types/domain/Workspace.types';

// ═══════════════════════════════════════════════════════════════
// WORKSPACE MAPPERS — satisfies Workspace.* from _shared.types
// ═══════════════════════════════════════════════════════════════

export function toWorkspacePublicView(row: WorkspaceDbRecord) {
    return {
        id: row.id,
        title: row.title,
        type: row.type,
        profile: (row.profile as Workspace.Profile) ?? null,
        isStore: row.isStore ?? false,
    } satisfies Workspace.PublicView;
}

export function toWorkspacePrivateView(row: WorkspaceDbRecord) {
    return {
        ...toWorkspacePublicView(row),
        isActive: row.isActive,
        cityId: row.cityId,
        createdAt: row.createdAt,
    } satisfies Workspace.PrivateView;
}

export function toWorkspaceFullView(row: WorkspaceDbRecord) {
    return {
        ...toWorkspacePrivateView(row),
        isBlocked: row.isBlocked,
        updatedAt: row.updatedAt,
    } satisfies Workspace.FullView;
}
