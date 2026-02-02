/**
 * Personal Provider Mappers
 * Transform database rows to domain types
 */

import type { PersonalProvider } from './personal';
import type { PersonalProviderRow } from './personalDb';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database personal provider row to PublicAccess view
 */
export function mapPersonalProviderToPublic(row: PersonalProviderRow): PersonalProvider.PublicAccess {
  return {
    id: row.id,
    title: row.title || undefined,
    description: row.description || undefined,
    logo: row.logo || undefined,
    cover: row.cover || undefined,
    createdAt: row.createdAt?.toISOString(),
  };
}

/**
 * Map database personal provider row to Full domain type
 */
export function mapPersonalProviderToFull(row: PersonalProviderRow): Partial<PersonalProvider.Full> {
  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    logo: row.logo || undefined,
    cover: row.cover || undefined,
    address: row.address || undefined,
    phone: row.phone || undefined,
    isBlocked: row.isBlocked || false,
    isActive: row.isActive || false,
    isApproved: row.isApproved || false,
    reviewCount: 0,
    viewCount: 0,
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    tenantType: 'personal',
    tenantAccessKey: row.tenantAccessKey || '',
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

/**
 * Map database personal provider row to PrivateAccess view (for owner)
 */
export function mapPersonalProviderToPrivate(
  row: PersonalProviderRow,
  isOwner: boolean = false
): Partial<PersonalProvider.PrivateAccess> {
  return {
    ...mapPersonalProviderToFull(row),
    isOwner,
    canEdit: isOwner,
    canDelete: false,
    stats: {
      totalListings: 0,
      activeListings: 0,
      totalOrders: 0,
      totalRevenue: { amount: 0, currency: 'AZN' },
      averageRating: 0,
      responseRate: 0,
    },
  } as PersonalProvider.PrivateAccess;
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of personal providers to PublicAccess views
 */
export function mapPersonalProvidersToPublic(rows: PersonalProviderRow[]): PersonalProvider.PublicAccess[] {
  return rows.map(mapPersonalProviderToPublic);
}

/**
 * Map array of personal providers to Full domain types
 */
export function mapPersonalProvidersToFull(rows: PersonalProviderRow[]): Partial<PersonalProvider.Full>[] {
  return rows.map(mapPersonalProviderToFull);
}

