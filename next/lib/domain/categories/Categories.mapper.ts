/**
 * Category Mappers
 * Transform database rows to domain types
 */

import type { Category } from './Categories.types';
import type { CategoryDbRecord } from '@/lib/database/schema';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database category row to Full domain type
 */
export function mapCategoryToFull(row: CategoryDbRecord): Category.Full {
    return {
        id: row.id,
        title: row.title || {},
        description: row.description || undefined,
        parentId: row.parentId || undefined,
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
export function mapCategoryToPublic(row: CategoryDbRecord): Category.PublicAccess {
    return {
        id: row.id,
        title: row.title || {},
        description: row.description || undefined,
        parentId: row.parentId || undefined,
        icon: row.icon || undefined,
        isActive: row.isActive || false,
    };
}

/**
 * Map database category row to PrivateAccess view (with permissions)
 */
export function mapCategoryToPrivate(
    row: CategoryDbRecord,
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
    categories: CategoryDbRecord[],
    parentId: string | null = null
): Category.Tree[] {
    return categories
        .filter((cat) =>
            parentId === null
                ? !cat.parentId
                : cat.parentId === parentId
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
export function mapCategoriesToPublic(rows: CategoryDbRecord[]): Category.PublicAccess[] {
    return rows.map(mapCategoryToPublic);
}

/**
 * Map array of categories to Full domain types
 */
export function mapCategoriesToFull(rows: CategoryDbRecord[]): Category.Full[] {
    return rows.map(mapCategoryToFull);
}
