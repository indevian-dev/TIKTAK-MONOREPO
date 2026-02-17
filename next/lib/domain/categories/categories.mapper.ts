/**
 * Category Mappers
 * Transform database rows to domain types
 */

import type { Category } from './categories.types';
import type { CategoryRow } from './categories.db';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database category row to Full domain type
 */
export function mapCategoryToFull(row: CategoryRow): Category.Full {
    return {
        id: row.id,
        title: row.title || '',
        titleRu: row.titleRu || undefined,
        titleEn: row.titleEn || undefined,
        description: row.description || undefined,
        descriptionRu: row.descriptionRu || undefined,
        descriptionEn: row.descriptionEn || undefined,
        parentId: row.parentId ? Number(row.parentId) : undefined,
        icon: row.icon || undefined,
        hasOptions: row.hasOptions || false,
        type: row.type || undefined,
        isActive: row.isActive || false,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || undefined,
    };
}

/**
 * Map database category row to PublicAccess view
 */
export function mapCategoryToPublic(row: CategoryRow): Category.PublicAccess {
    return {
        id: row.id,
        title: row.title || '',
        titleRu: row.titleRu || undefined,
        titleEn: row.titleEn || undefined,
        description: row.description || undefined,
        descriptionRu: row.descriptionRu || undefined,
        descriptionEn: row.descriptionEn || undefined,
        parentId: row.parentId ? Number(row.parentId) : undefined,
        icon: row.icon || undefined,
        isActive: row.isActive || false,
    };
}

/**
 * Map database category row to PrivateAccess view (with permissions)
 */
export function mapCategoryToPrivate(
    row: CategoryRow,
    canEdit: boolean = false,
    canDelete: boolean = false
): Category.PrivateAccess {
    return {
        ...mapCategoryToFull(row),
        canEdit,
        canDelete,
    };
}

/**
 * Build tree structure from flat category list
 */
export function buildCategoryTree(
    categories: CategoryRow[],
    parentId: number | null = null
): Category.Tree[] {
    return categories
        .filter((cat) =>
            parentId === null
                ? !cat.parentId
                : cat.parentId && Number(cat.parentId) === parentId
        )
        .map((cat) => ({
            ...mapCategoryToPublic(cat),
            children: buildCategoryTree(categories, cat.id),
        }));
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of categories to PublicAccess views
 */
export function mapCategoriesToPublic(rows: CategoryRow[]): Category.PublicAccess[] {
    return rows.map(mapCategoryToPublic);
}

/**
 * Map array of categories to Full domain types
 */
export function mapCategoriesToFull(rows: CategoryRow[]): Category.Full[] {
    return rows.map(mapCategoryToFull);
}
