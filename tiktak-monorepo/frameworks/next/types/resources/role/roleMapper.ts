/**
 * Role Mappers
 * Transform database rows to domain types
 */

import type { Role } from './role';
import type { RoleRow } from './roleDb';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database role row to PublicAccess view
 */
export function mapRoleToPublic(row: RoleRow): Role.PublicAccess {
  return {
    id: row.id,
    name: row.name,
    description: undefined, // Not stored in current schema
  };
}

/**
 * Map database role row to Full domain type
 */
export function mapRoleToFull(row: RoleRow): Role.Full {
  const permissions = (row.permissions as any) || {};
  const pagesPermissions = Array.isArray(permissions.pages) ? permissions.pages : [];
  const apisPermissions = Array.isArray(permissions.apis) ? permissions.apis : [];
  
  return {
    id: row.id,
    name: row.name,
    permissions: [...pagesPermissions, ...apisPermissions],
    isSystem: row.isStaff || false,
    created_at: row.createdAt?.toISOString() || new Date().toISOString(),
    pages_permissions: pagesPermissions,
    apis_permissions: apisPermissions,
    createdAt: row.createdAt || new Date(),
    updatedAt: undefined,
  };
}

/**
 * Map database role row to PrivateAccess view (with permissions)
 */
export function mapRoleToPrivate(
  row: RoleRow,
  canEdit: boolean = false,
  canDelete: boolean = false
): Role.PrivateAccess {
  return {
    ...mapRoleToFull(row),
    canEdit,
    canDelete: canDelete && !row.isStaff, // System roles cannot be deleted
  };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of roles to PublicAccess views
 */
export function mapRolesToPublic(rows: RoleRow[]): Role.PublicAccess[] {
  return rows.map(mapRoleToPublic);
}

/**
 * Map array of roles to Full domain types
 */
export function mapRolesToFull(rows: RoleRow[]): Role.Full[] {
  return rows.map(mapRoleToFull);
}

