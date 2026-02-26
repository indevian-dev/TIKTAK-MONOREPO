/**
 * User Mappers
 * Transform database rows to domain types
 */

import type { User } from './User.types';
import type { UserDbRecord } from '@/lib/database/schema';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database user row to Full domain type
 */
export function mapUserToFull(row: UserDbRecord): User.Full {
    return {
        id: row.id,
        email: row.email,
        name: [row.firstName, row.lastName].filter(Boolean).join(' ') || undefined,
        phone: row.phone || undefined,
        avatar: row.avatarUrl || undefined,
        emailIsVerified: row.emailIsVerified || false,
        phoneIsVerified: row.phoneIsVerified || false,
        status: 'active', // Would come from accounts table
        createdAt: (row.createdAt ?? new Date()).toISOString(),
        updatedAt: row.updatedAt?.toISOString(),
    };
}

/**
 * Map database user row to PublicAccess view
 */
export function mapUserToPublic(row: UserDbRecord): User.PublicAccess {
    return {
        id: row.id,
        name: [row.firstName, row.lastName].filter(Boolean).join(' ') || undefined,
        avatar: row.avatarUrl || undefined,
        isVerified: (row.emailIsVerified || row.phoneIsVerified) || false,
        memberSince: row.createdAt?.toISOString() || new Date().toISOString(),
    };
}

/**
 * Map database user row to PrivateAccess view (for owner)
 */
export function mapUserToPrivate(
    row: UserDbRecord,
    accounts: User.ProfileAccount[] = []
): User.PrivateAccess {
    return {
        id: row.id,
        email: row.email,
        name: [row.firstName, row.lastName].filter(Boolean).join(' ') || undefined,
        phone: row.phone || undefined,
        avatar: row.avatarUrl || undefined,
        emailIsVerified: row.emailIsVerified || false,
        phoneIsVerified: row.phoneIsVerified || false,
        status: 'active',
        createdAt: (row.createdAt ?? new Date()).toISOString(),
        lastLoginAt: undefined,
        accounts,
        canEdit: true,
        canDelete: false, // Users typically can't delete themselves without deactivation flow
    };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of users to PublicAccess views
 */
export function mapUsersToPublic(rows: UserDbRecord[]): User.PublicAccess[] {
    return rows.map(mapUserToPublic);
}

/**
 * Map array of users to Full domain types
 */
export function mapUsersToFull(rows: UserDbRecord[]): User.Full[] {
    return rows.map(mapUserToFull);
}
