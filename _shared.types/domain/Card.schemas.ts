import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// CARD SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

// ─── CREATE ────────────────────────────────────────────────────

export const CardCreateSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
    price: z.number().positive('Price must be positive'),
    currency: z.string().min(1, 'Currency is required').default('AZN'),
    categoryId: z.string().min(1, 'Category is required'),
    subcategoryId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional(),
    location: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
    }).optional(),
    options: z.record(z.unknown()).optional(),
});
export type CardCreateInput = z.infer<typeof CardCreateSchema>;

// ─── UPDATE ────────────────────────────────────────────────────

export const CardUpdateSchema = CardCreateSchema.partial();
export type CardUpdateInput = z.infer<typeof CardUpdateSchema>;

// ─── APPROVE ───────────────────────────────────────────────────

export const CardApproveSchema = z.object({
    approved: z.boolean(),
    reason: z.string().optional(),
});
export type CardApproveInput = z.infer<typeof CardApproveSchema>;

// ─── SEARCH / FILTER ───────────────────────────────────────────

export const CardSearchSchema = z.object({
    query: z.string().optional(),
    categoryId: z.string().optional(),
    subcategoryId: z.string().optional(),
    workspaceId: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    tags: z.array(z.string()).optional(),
    approved: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
    sortBy: z.enum(['price', 'createdAt', 'title']).optional().default('createdAt'),
    sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
});
export type CardSearchInput = z.infer<typeof CardSearchSchema>;
