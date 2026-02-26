/**
 * Content Mappers
 * Transform database rows (blogs, docs) to domain types
 */

import type { Blog, Doc } from './Content.types';

// Drizzle inferred types from schema
type BlogDbRecord = {
    id: string;
    slug: string | null;
    isActive: boolean | null;
    isFeatured: boolean | null;
    cover?: string | null;
    createdBy?: string | null;
    localizedContent?: unknown;
    createdAt: Date | null;
    updatedAt?: Date | null;
};

type DocDbRecord = {
    id: string;
    type: string | null;
    localizedContent?: unknown;
    createdAt: Date | null;
    updatedAt?: Date | null;
};

// ═══════════════════════════════════════════════════════════════
// BLOG MAPPERS
// ═══════════════════════════════════════════════════════════════

export function mapBlogToEntity(row: BlogDbRecord): Blog.Entity {
    return {
        id: row.id,
        slug: row.slug ?? '',
        isActive: row.isActive ?? false,
        isFeatured: row.isFeatured ?? false,
        cover: row.cover ?? undefined,
        createdBy: row.createdBy ?? undefined,
        localizedContent: row.localizedContent as Blog.Entity['localizedContent'],
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? undefined,
    };
}

export function mapBlogsToEntities(rows: BlogDbRecord[]): Blog.Entity[] {
    return rows.map(mapBlogToEntity);
}

// ═══════════════════════════════════════════════════════════════
// DOC MAPPERS
// ═══════════════════════════════════════════════════════════════

export function mapDocToEntity(row: DocDbRecord): Doc.Entity {
    return {
        id: row.id,
        type: row.type ?? '',
        localizedContent: row.localizedContent as Doc.Entity['localizedContent'],
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? undefined,
    };
}
