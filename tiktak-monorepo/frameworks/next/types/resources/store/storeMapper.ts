/**
 * Store Mappers
 * Transform database rows to domain types
 */

import type { Store } from './store';
import type { StoreRow } from './storeDb';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database store row to PublicAccess view
 */
export function mapStoreToPublic(row: StoreRow): Store.PublicAccess {
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
 * Map database store row to Full domain type
 */
export function mapStoreToFull(row: StoreRow): Partial<Store.Full> {
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
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

/**
 * Map database store row to PrivateAccess view (for owner)
 */
export function mapStoreToPrivate(
  row: StoreRow,
  isOwner: boolean = false
): Partial<Store.PrivateAccess> {
  return {
    ...mapStoreToFull(row),
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
  } as Store.PrivateAccess;
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of stores to PublicAccess views
 */
export function mapStoresToPublic(rows: StoreRow[]): Store.PublicAccess[] {
  return rows.map(mapStoreToPublic);
}

/**
 * Map array of stores to Full domain types
 */
export function mapStoresToFull(rows: StoreRow[]): Partial<Store.Full>[] {
  return rows.map(mapStoreToFull);
}

