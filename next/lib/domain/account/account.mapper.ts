/**
 * Account Mappers
 * Transform database rows to domain types
 */

import type { Account } from './account.types';
import type { AccountRow, AccountRoleRow } from './account.db';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database account row to Full domain type
 */
export function mapAccountToFull(row: AccountRow): Account.Full {
    return {
        id: row.id,
        userId: row.userId || '',
        suspended: row.suspended || false,
        isPersonal: row.isPersonal || true,
        role: row.role || 'basic_role',
        isDeleted: row.isDeleted || false,
        tenantType: row.tenantType || undefined,
        tenantAccessKey: row.tenantAccessKey || undefined,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || undefined,
    };
}

/**
 * Map database account row to PublicAccess view
 */
export function mapAccountToPublic(row: AccountRow): Account.PublicAccess {
    return {
        id: row.id,
        isPersonal: row.isPersonal || true,
        role: row.role || 'basic_role',
    };
}

/**
 * Map database account row to PrivateAccess view (for owner)
 */
export function mapAccountToPrivate(
    row: AccountRow,
    permissions?: string[]
): Account.PrivateAccess {
    return {
        ...mapAccountToFull(row),
        canEdit: true,
        canDelete: !row.isPersonal, // Can't delete personal accounts
        permissions,
    };
}

/**
 * Map database role row to Account.Role
 */
export function mapAccountRoleToRole(row: AccountRoleRow): Account.Role {
    return {
        id: row.id,
        name: row.name,
        permissions: (row.permissions as Record<string, any>) || undefined,
        version: row.version ? Number(row.version) : undefined,
        type: row.type || undefined,
        createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
    };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of accounts to PublicAccess views
 */
export function mapAccountsToPublic(rows: AccountRow[]): Account.PublicAccess[] {
    return rows.map(mapAccountToPublic);
}

/**
 * Map array of accounts to Full domain types
 */
export function mapAccountsToFull(rows: AccountRow[]): Account.Full[] {
    return rows.map(mapAccountToFull);
}
