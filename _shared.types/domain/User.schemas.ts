import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// USER SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

export const UserProfileUpdateSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phone: z.string().min(7, 'Invalid phone number').optional(),
    avatar: z.string().url().optional().or(z.literal('')),
});
export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>;

export const UserSuspendSchema = z.object({
    accountId: z.string().min(1, 'Account ID is required'),
    reason: z.string().optional(),
    suspend: z.boolean(),
});
export type UserSuspendInput = z.infer<typeof UserSuspendSchema>;

export const UserSearchSchema = z.object({
    query: z.string().optional(),
    role: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type UserSearchInput = z.infer<typeof UserSearchSchema>;

export const UserAssignRoleSchema = z.object({
    accountId: z.string().min(1, 'Account ID is required'),
    roleId: z.string().min(1, 'Role ID is required'),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
});
export type UserAssignRoleInput = z.infer<typeof UserAssignRoleSchema>;
