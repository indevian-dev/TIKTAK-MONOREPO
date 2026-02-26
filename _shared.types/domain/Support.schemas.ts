import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SUPPORT SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

export const DeactivationRequestSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
    comment: z.string().max(1000, 'Comment is too long').optional(),
});
export type DeactivationRequestInput = z.infer<typeof DeactivationRequestSchema>;

export const SupportTicketCreateSchema = z.object({
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(255),
    body: z.string().min(10, 'Message must be at least 10 characters').max(5000),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});
export type SupportTicketCreateInput = z.infer<typeof SupportTicketCreateSchema>;

export const SupportTicketUpdateSchema = z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
    resolution: z.string().optional(),
});
export type SupportTicketUpdateInput = z.infer<typeof SupportTicketUpdateSchema>;
