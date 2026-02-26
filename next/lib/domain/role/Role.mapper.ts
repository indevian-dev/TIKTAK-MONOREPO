/**
 * Role Mapper
 * Transform workspace role database rows to domain types.
 * Uses WorkspaceRoleDbRecord from schema.ts — single source of truth.
 */

import type { WorkspaceRoleDbRecord } from '@/lib/database/schema';
import type { Role } from '@tiktak/shared/types/domain/Role.types';

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export function mapRoleToPublic(row: WorkspaceRoleDbRecord): Role.PublicView {
    return {
        id: row.id,
        name: row.name,
        permissions: Array.isArray(row.permissions) ? (row.permissions as string[]) : [],
        forWorkspaceType: row.forWorkspaceType ?? null,
        description: row.description ?? null,
    };
}

export function mapRolesToPublic(rows: WorkspaceRoleDbRecord[]): Role.PublicView[] {
    return rows.map(mapRoleToPublic);
}

// ─── Re-export view type for convenience ───────────────────────
export type { Role };
