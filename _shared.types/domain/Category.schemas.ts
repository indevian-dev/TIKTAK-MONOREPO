import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// CATEGORY SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

// ─── CREATE ────────────────────────────────────────────────────

export const CategoryCreateSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255),
    description: z.string().optional(),
    parentId: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    order: z.number().int().optional(),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
});
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;

// ─── UPDATE ────────────────────────────────────────────────────

export const CategoryUpdateSchema = CategoryCreateSchema.omit({ workspaceId: true }).partial();
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;

// ─── LIST QUERY ────────────────────────────────────────────────

export const CategoryListQuerySchema = z.object({
    workspaceId: z.string().optional(),
    parentId: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    includeChildren: z.coerce.boolean().optional().default(false),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});
export type CategoryListQueryInput = z.infer<typeof CategoryListQuerySchema>;

// ─── FILTER MANAGEMENT ─────────────────────────────────────────

export const FilterOptionSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
});
export type FilterOptionValue = z.infer<typeof FilterOptionSchema>;

export const CategoryFilterSchema = z.object({
    name: z.string().min(1, 'Filter name is required'),
    type: z.enum(['select', 'multiselect', 'range', 'boolean', 'text']),
    options: z.array(FilterOptionSchema).optional(),
    required: z.boolean().optional().default(false),
    order: z.number().int().optional(),
});
export type CategoryFilterInput = z.infer<typeof CategoryFilterSchema>;

export const CategoryFiltersUpdateSchema = z.object({
    filters: z.array(CategoryFilterSchema),
});
export type CategoryFiltersUpdateInput = z.infer<typeof CategoryFiltersUpdateSchema>;
