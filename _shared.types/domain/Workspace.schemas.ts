import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// WORKSPACE SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

export const workspaceTypeSchema = z.enum(['student', 'provider', 'admin', 'staff', 'parent'], {
    errorMap: () => ({ message: 'Invalid workspace type' }),
});
export type WorkspaceTypeValue = z.infer<typeof workspaceTypeSchema>;

// ─── CREATE ────────────────────────────────────────────────────

export const WorkspaceCreateSchema = z.object({
    workspaceType: workspaceTypeSchema,
    title: z.string().min(2, 'Title must be at least 2 characters').max(255, 'Title is too long'),
    description: z.string().optional(),
});
export type WorkspaceCreateInput = z.infer<typeof WorkspaceCreateSchema>;

// ─── UPDATE ────────────────────────────────────────────────────

export const WorkspaceUpdateSchema = z.object({
    title: z.string().min(2).max(255).optional(),
    isActive: z.boolean().optional(),
    providerSubscriptionPrice: z.number().nullable().optional(),
    providerProgramDescription: z.string().nullable().optional(),
    providerSubscriptionPeriod: z.enum(['month', 'year']).optional(),
    providerTrialDaysCount: z.number().default(0).optional(),
    currency: z.string().optional(),
    features: z.array(z.string()).optional(),
    monthlyPrice: z.number().optional(),
    yearlyPrice: z.number().optional(),
    logo: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional().or(z.literal('')),
    location: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
    }).optional(),
});
export type WorkspaceUpdateInput = z.infer<typeof WorkspaceUpdateSchema>;

// ─── ROLE ──────────────────────────────────────────────────────

export const RoleCreateSchema = z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters'),
    permissions: z.array(z.string()).optional().default([]),
    forWorkspaceType: workspaceTypeSchema.optional(),
});
export type RoleCreateInput = z.infer<typeof RoleCreateSchema>;

export const RoleUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    permissions: z.array(z.string()).optional(),
});
export type RoleUpdateInput = z.infer<typeof RoleUpdateSchema>;

export const RolePermissionsSchema = z.object({
    path: z.string().min(1, 'Permission path is required'),
    action: z.enum(['add', 'remove'], {
        errorMap: () => ({ message: 'Action must be "add" or "remove"' }),
    }),
});
export type RolePermissionsInput = z.infer<typeof RolePermissionsSchema>;

// ─── APPLICATION ───────────────────────────────────────────────

export const WorkspaceApplicationSchema = z.object({
    contact_name: z.string().min(2, 'Contact name is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
    email: z.string().email('Valid email is required'),
    voen: z.string().min(1, 'VOEN is required'),
    store_name: z.string().min(2, 'Store name is required'),
    store_address: z.string().min(5, 'Store address is required'),
});
export type WorkspaceApplicationInput = z.infer<typeof WorkspaceApplicationSchema>;

export const WorkspaceApplicationUpdateSchema = z.object({
    approved: z.boolean(),
    reason: z.string().optional(),
});
export type WorkspaceApplicationUpdateInput = z.infer<typeof WorkspaceApplicationUpdateSchema>;

// ─── MEDIA ─────────────────────────────────────────────────────

export const MediaUploadSchema = z.object({
    fileType: z.string().min(1, 'File type is required'),
    fileName: z.string().min(1, 'File name is required'),
});
export type MediaUploadInput = z.infer<typeof MediaUploadSchema>;
