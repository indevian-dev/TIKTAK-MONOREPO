

import type { WorkspaceDbRecord } from "@/lib/database/schema";
import type { WorkspaceProfile } from "./Workspace.types";

// ═══════════════════════════════════════════════════════════════
// WORKSPACE VIEWS — Public / Private / Full
// ═══════════════════════════════════════════════════════════════

/** Public: provider listing, catalog — only external-facing fields */
export interface WorkspacePublicView {
    id: string;
    title: string;
    type: string;
    profile: WorkspaceProfile | null;
}

/** Private: workspace owner/member — operational fields */
export interface WorkspacePrivateView extends WorkspacePublicView {
    isActive: boolean | null;
    cityId: string | null;
    createdAt: Date | null;
}

/** Full: staff/admin — everything including block status */
export interface WorkspaceFullView extends WorkspacePrivateView {
    isBlocked: boolean | null;
    updatedAt: Date | null;
}

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export function toWorkspacePublicView(row: WorkspaceDbRecord): WorkspacePublicView {
    return {
        id: row.id,
        title: row.title,
        type: row.type,
        profile: (row.profile as WorkspaceProfile) ?? null,
    };
}

export function toWorkspacePrivateView(row: WorkspaceDbRecord): WorkspacePrivateView {
    return {
        ...toWorkspacePublicView(row),
        isActive: row.isActive,
        cityId: row.cityId,
        createdAt: row.createdAt,
    };
}

export function toWorkspaceFullView(row: WorkspaceDbRecord): WorkspaceFullView {
    return {
        ...toWorkspacePrivateView(row),
        isBlocked: row.isBlocked,
        updatedAt: row.updatedAt,
    };
}
