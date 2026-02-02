/**
 * Card Mappers
 * Transform database rows to domain types
 */

import type { Card } from './card';
import type { CardRow, CardPublishedRow } from './cardDb';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database card row to PublicAccess view
 */
export function mapCardToPublic(row: CardRow | CardPublishedRow): Card.PublicAccess {
  return {
    id: row.id,
    title: row.title || '',
    body: row.body || undefined,
    price: row.price || undefined,
    currency: 'AZN', // Default currency
    images: (row.images as string[]) || undefined,
    cover: row.cover || undefined,
    storage_prefix: row.storagePrefix || undefined,
    location: (row.location as any) || undefined,
    categories: (row.categories as number[]) || undefined,
    view_count: 0, // Would come from stats table
    favorite_count: 0,
    contact_count: 0,
    share_count: 0,
    store_id: row.storeId ? Number(row.storeId) : null,
    created_at: row.createdAt || undefined,
    updated_at: row.updatedAt || undefined,
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

/**
 * Map database card row to Full domain type
 */
export function mapCardToFull(row: CardRow): Card.Full {
  return {
    id: row.id,
    title: row.title || '',
    body: row.body || undefined,
    price: row.price || undefined,
    images: (row.images as string[]) || undefined,
    cover: row.cover || undefined,
    video: row.video ? { url: row.video } : undefined,
    storage_prefix: row.storagePrefix || undefined,
    location: (row.location as any) || undefined,
    categories: (row.categories as number[]) || undefined,
    filters_options: (row.filtersOptions as Record<string, any>) || undefined,
    account_id: Number(row.accountId),
    store_id: row.storeId ? Number(row.storeId) : undefined,
    status: row.isApproved ? 'published' : 'draft',
    is_approved: row.isApproved || false,
    view_count: 0,
    favorite_count: 0,
    contact_count: 0,
    share_count: 0,
    createdAt: row.createdAt || new Date(),
    updatedAt: row.updatedAt || undefined,
  };
}

/**
 * Map database card row to PrivateAccess view (for owner)
 */
export function mapCardToPrivate(
  row: CardRow,
  isOwner: boolean = false
): Card.PrivateAccess {
  return {
    ...mapCardToFull(row),
    canEdit: isOwner,
    canDelete: isOwner,
  };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of cards to PublicAccess views
 */
export function mapCardsToPublic(
  rows: (CardRow | CardPublishedRow)[]
): Card.PublicAccess[] {
  return rows.map(mapCardToPublic);
}

/**
 * Map array of cards to Full domain types
 */
export function mapCardsToFull(rows: CardRow[]): Card.Full[] {
  return rows.map(mapCardToFull);
}

