import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// JOBS SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

export const JobControlSchema = z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    action: z.enum(['start', 'stop', 'pause', 'resume', 'retry']),
    params: z.record(z.unknown()).optional(),
});
export type JobControlInput = z.infer<typeof JobControlSchema>;

export const JobLogFilterSchema = z.object({
    jobId: z.string().optional(),
    level: z.enum(['info', 'warn', 'error']).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});
export type JobLogFilterInput = z.infer<typeof JobLogFilterSchema>;
