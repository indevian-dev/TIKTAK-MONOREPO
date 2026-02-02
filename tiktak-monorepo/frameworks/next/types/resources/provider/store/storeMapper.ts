/**
 * Store Provider Mappers
 * Transform database rows to domain types
 */

import type { StoreProvider } from './store';
import type { StoreProviderRow } from './storeDb';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database store provider row to PublicAccess view
 */
export function mapStoreProviderToPublic(row: StoreProviderRow): StoreProvider.PublicAccess {
  return {
    id: row.id,
    name: row.title || undefined,
    title: row.title || undefined,
    description: row.description || undefined,
    logo: row.logo || undefined,
    banner: row.cover || undefined,
    cover: row.cover || undefined,
    isVerified: row.isApproved || false,
    createdAt: row.createdAt?.toISOString(),
  };
}

/**
 * Map database store provider row to Full domain type
 */
export function mapStoreProviderToFull(row: StoreProviderRow): Partial<StoreProvider.Full> {
  return {
    id: row.id,
    name: row.title || '',
    description: row.description || '',
    logo: row.logo || undefined,
    banner: row.cover || undefined,
    address: row.address || '',
    phone: row.phone || undefined,
    isVerified: row.isApproved || false,
    reviewCount: 0,
    viewCount: 0,
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    tenantType: 'store',
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

/**
 * Map database store provider row to PrivateAccess view (for owner)
 */
export function mapStoreProviderToPrivate(
  row: StoreProviderRow,
  isOwner: boolean = false
): Partial<StoreProvider.PrivateAccess> {
  return {
    ...mapStoreProviderToFull(row),
    isOwner,
    canEdit: isOwner,
    canDelete: false, // Stores typically can't be deleted, only deactivated
    stats: {
      totalListings: 0,
      activeListings: 0,
      totalOrders: 0,
      totalRevenue: { amount: 0, currency: 'AZN' },
      averageRating: 0,
      responseRate: 0,
    },
  } as StoreProvider.PrivateAccess;
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of store providers to PublicAccess views
 */
export function mapStoreProvidersToPublic(rows: StoreProviderRow[]): StoreProvider.PublicAccess[] {
  return rows.map(mapStoreProviderToPublic);
}

/**
 * Map array of store providers to Full domain types
 */
export function mapStoreProvidersToFull(rows: StoreProviderRow[]): Partial<StoreProvider.Full>[] {
  return rows.map(mapStoreProviderToFull);
}

