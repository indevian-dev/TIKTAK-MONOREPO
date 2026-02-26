/**
 * Cards Repository
 * Handles all data-fetching for Cards.
 * - Main DB (Supabase): uses Drizzle `dbInstance`
 * - Search DB (Neon):   uses `searchDb` raw client
 */

import { sql } from 'drizzle-orm';
import type { DbClientTypes } from '@/lib/database';
import { searchDb } from '@/lib/database';
import { mapCardRowToPublic, mapSearchRowsToPublic } from './Cards.mapper';
import type { Card } from './Cards.types';

/**
 * Converts the snake_case keys from raw SQL execute() results
 * to the camelCase shape that mapCardRowToPublic expects.
 */
function normalizeSqlRow(row: Record<string, unknown>) {
    return {
        id: row.id,
        createdAt: row.created_at,
        title: row.title,
        isApproved: row.is_approved,
        price: row.price,
        body: row.body,
        storeId: row.store_id,
        accountId: row.account_id,
        storagePrefix: row.storage_prefix,
        location: row.location,
        images: row.images,
        cover: row.cover,
        video: row.video,
        updatedAt: row.updated_at,
        filtersOptions: row.filters_options,
        categories: row.categories,
        workspaceId: row.workspace_id,
    } as any;
}

export class CardsRepository {
    constructor(private readonly dbInstance: DbClientTypes) { }

    // ─── Main DB ────────────────────────────────────────────────────

    async listFeaturedCards(): Promise<Card.PublicAccess[]> {
        const rows = await this.dbInstance.execute(
            sql`SELECT * FROM cards WHERE is_approved = true ORDER BY created_at DESC LIMIT 10`
        );
        return (rows as any[]).map(normalizeSqlRow).map(mapCardRowToPublic);
    }

    async getPublicCard(id: string) {
        const cardResult = await this.dbInstance.execute(
            sql`SELECT * FROM cards WHERE id = ${id} AND is_approved = true LIMIT 1`
        );
        const rawRow = (cardResult as any[])?.[0];
        if (!rawRow) return null;

        const cardRow = normalizeSqlRow(rawRow);
        const card = mapCardRowToPublic(cardRow);

        // Fetch store data
        let stores = null;
        if (cardRow.storeId) {
            const storeId = cardRow.storeId;
            const storeResult = await this.dbInstance.execute(
                sql`SELECT id, title, profile FROM workspaces WHERE id = ${storeId} LIMIT 1`
            );
            const ws = (storeResult as any[])?.[0];
            if (ws) {
                const profile = (ws.profile || {}) as Record<string, string>;
                stores = { id: ws.id, title: ws.title, logo: profile.logo || null, phone: profile.phone || null };
            }
        }

        // Fetch account data
        let accounts = null;
        const accountId = cardRow.accountId;
        if (accountId) {
            const userResult = await this.dbInstance.execute(
                sql`SELECT u.first_name, u.last_name, u.phone
                    FROM accounts a
                    LEFT JOIN users u ON a.user_id = u.id
                    WHERE a.id = ${accountId} LIMIT 1`
            );
            const user = (userResult as any[])?.[0];
            if (user) {
                accounts = {
                    name: [user.first_name, user.last_name].filter(Boolean).join(' ') || null,
                    phone: user.phone || null,
                };
            }
        }

        return { ...card, stores, accounts };
    }

    // ─── Neon Search DB ─────────────────────────────────────────────

    async searchCards(query: Card.SearchQuery): Promise<Card.SearchResult> {
        const {
            categoryIds,
            searchText,
            priceMin,
            priceMax,
            storeId,
            pagination = 12,
        } = query;

        const conditions: string[] = [];
        const values: unknown[] = [];
        let paramIdx = 1;

        // Only approved cards — use JSONB boolean equality (works for both boolean true and string "true")
        conditions.push(`data->'is_approved' = 'true'::jsonb`);

        // Category filter — use JSONB containment with searchDb.json() for proper parameter binding
        if (categoryIds && categoryIds !== 'NaN') {
            const catIds = categoryIds.split(',').filter(Boolean);
            if (catIds.length === 1) {
                conditions.push(`data->'categories' @> $${paramIdx}`);
                values.push(searchDb.json([catIds[0]]));
                paramIdx++;
            } else if (catIds.length > 1) {
                const catConditions = catIds.map(id => {
                    const idx = paramIdx++;
                    values.push(searchDb.json([id]));
                    return `data->'categories' @> $${idx}`;
                });
                conditions.push(`(${catConditions.join(' OR ')})`);
            }
        }

        // Text search
        if (searchText?.trim()) {
            conditions.push(`data->>'title' ILIKE $${paramIdx}`);
            values.push(`%${searchText.trim()}%`);
            paramIdx++;
        }

        // Price range
        if (priceMin !== undefined) {
            conditions.push(`(data->>'price')::numeric >= $${paramIdx}`);
            values.push(priceMin);
            paramIdx++;
        }
        if (priceMax !== undefined) {
            conditions.push(`(data->>'price')::numeric <= $${paramIdx}`);
            values.push(priceMax);
            paramIdx++;
        }

        // Store / workspace filter
        if (storeId) {
            conditions.push(`workspace_id = $${paramIdx}`);
            values.push(storeId);
            paramIdx++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countQuery = `SELECT COUNT(*) as total FROM neon_search_cards ${whereClause}`;
        const countResult = await searchDb.unsafe(countQuery, values as any[]);
        const total = parseInt(countResult[0]?.total || '0', 10);

        const dataQuery = `
            SELECT id, workspace_id, data, synced_at
            FROM neon_search_cards
            ${whereClause}
            ORDER BY synced_at DESC
            LIMIT ${pagination}
        `;
        const rows = await searchDb.unsafe(dataQuery, values as any[]);

        return {
            cards: mapSearchRowsToPublic(rows as unknown as Card.NeonSearchRow[]),
            total,
        };
    }

    async approveCard(id: number) {
        const result = await this.dbInstance.execute(
            sql`UPDATE cards SET is_approved = true WHERE id = ${id} RETURNING *`
        );
        const raw = (result as any[])?.[0];
        if (!raw) return null;
        return normalizeSqlRow(raw);
    }

    async deleteCard(id: number) {
        const result = await this.dbInstance.execute(
            sql`DELETE FROM cards WHERE id = ${id} RETURNING *`
        );
        const raw = (result as any[])?.[0];
        if (!raw) return null;
        return normalizeSqlRow(raw);
    }

    async updateCard(id: number, data: Record<string, unknown>) {
        const { title, body, price, categories, images, cover, video, location, filtersOptions } = data as any;
        const result = await this.dbInstance.execute(
            sql`UPDATE cards SET
                title        = COALESCE(${title ?? null}, title),
                body         = COALESCE(${body ?? null}, body),
                price        = COALESCE(${price ?? null}, price),
                categories   = COALESCE(${categories ?? null}, categories),
                images       = COALESCE(${images ?? null}, images),
                cover        = COALESCE(${cover ?? null}, cover),
                video        = COALESCE(${video ?? null}, video),
                location     = COALESCE(${location ?? null}, location),
                filters_options = COALESCE(${filtersOptions ?? null}, filters_options),
                updated_at   = NOW()
            WHERE id = ${id}
            RETURNING *`
        );
        const raw = (result as any[])?.[0];
        if (!raw) return null;
        return normalizeSqlRow(raw);
    }
}
