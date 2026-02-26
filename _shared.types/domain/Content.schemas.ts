import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// CONTENT SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

// ─── BLOG ──────────────────────────────────────────────────────

export const BlogCreateSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(255),
    content: z.string().min(10, 'Content is required'),
    slug: z.string().min(3).optional(),
    coverImage: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional().default(false),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
});
export type BlogCreateInput = z.infer<typeof BlogCreateSchema>;

export const BlogUpdateSchema = BlogCreateSchema.omit({ workspaceId: true }).partial();
export type BlogUpdateInput = z.infer<typeof BlogUpdateSchema>;

// ─── PAGE ──────────────────────────────────────────────────────

export const PageCreateSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    content: z.string().optional(),
    isPublished: z.boolean().optional().default(false),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
});
export type PageCreateInput = z.infer<typeof PageCreateSchema>;

export const PageUpdateSchema = PageCreateSchema.omit({ workspaceId: true }).partial();
export type PageUpdateInput = z.infer<typeof PageUpdateSchema>;

// ─── PROMPT ────────────────────────────────────────────────────

export const PromptCreateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    content: z.string().min(10, 'Prompt content is required'),
    category: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
});
export type PromptCreateInput = z.infer<typeof PromptCreateSchema>;

export const PromptUpdateSchema = PromptCreateSchema.omit({ workspaceId: true }).partial();
export type PromptUpdateInput = z.infer<typeof PromptUpdateSchema>;
