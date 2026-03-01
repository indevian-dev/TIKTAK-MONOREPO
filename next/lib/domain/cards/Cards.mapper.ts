/**
 * Cards Mapper
 * DB row / Neon raw row → domain type (camelCase)
 * This is the ONLY place where snake_case → camelCase conversion happens.
 */

import type { CardDbRecord } from '@/lib/database/schema';
import type { Card } from './Cards.types';

// ═══════════════════════════════════════════════════════════════
// MAIN DB (Supabase via Drizzle) — CardDbRecord is already camelCase
// ═══════════════════════════════════════════════════════════════

export function mapCardRowToPublic(row: CardDbRecord): Card.PublicAccess {
    return {
        id: row.id,
        workspaceId: row.workspaceId ?? '',
        title: row.title ?? null,
        body: row.body ?? null,
        price: row.price ?? null,
        cover: row.cover ?? null,
        images: (row.images as string[] | null) ?? null,
        video: row.video ? { url: row.video as unknown as string } : null,
        location: (row.location as { lat: number; lng: number } | null) ?? null,
        categories: (row.categories as string[] | null) ?? null,
        filtersOptions: (row.filtersOptions as Card.FilterOption[] | null) ?? null,
        accountId: row.accountId ?? null,
        isApproved: row.isApproved ?? false,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? null,
    };
}

// ═══════════════════════════════════════════════════════════════
// NEON SEARCH TABLE — raw SQL row, data is JSONB blob (snake_case)
// ═══════════════════════════════════════════════════════════════

/**
 * Maps a raw neon_search_cards row to the public Card domain type.
 * The `data` column is a JSONB snapshot of the card in snake_case.
 * workspace_id is a top-level column on the search table.
 */
export function mapSearchRowToPublic(row: Card.NeonSearchRow): Card.PublicAccess {
    const d = row.data;
    return {
        id: row.id,
        workspaceId: row.workspace_id,                              // top-level column
        title: (d.title as string | null) ?? null,
        body: (d.body as string | null) ?? null,
        price: (d.price as number | null) ?? null,
        cover: (d.cover as string | null) ?? null,
        images: (d.images as string[] | null) ?? null,
        video: d.video ? { url: d.video as unknown as string } : null,
        location: (d.location as { lat: number; lng: number } | null) ?? null,
        categories: (d.categories as string[] | null) ?? null,
        filtersOptions: (d.filters_options as Card.FilterOption[] | null) ?? null,  // snake_case in JSONB data
        accountId: (d.account_id as string | null) ?? null,
        isApproved: (d.is_approved as boolean | null) ?? false,
        createdAt: new Date((d.created_at as string) ?? row.synced_at),
        updatedAt: d.updated_at ? new Date(d.updated_at as string) : null,
    };
}

export function mapSearchRowsToPublic(rows: Card.NeonSearchRow[]): Card.PublicAccess[] {
    return rows.map(mapSearchRowToPublic);
}
