import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════

export const MarkNotificationsReadSchema = z.object({
    notificationIds: z.array(z.string()).min(1).optional(),
    markAll: z.boolean().optional(),
}).refine(
    (data: { notificationIds?: string[]; markAll?: boolean }) => data.notificationIds?.length || data.markAll,
    { message: 'Either notificationIds or markAll must be provided', path: ['notificationIds'] }
);
export type MarkNotificationsReadInput = z.infer<typeof MarkNotificationsReadSchema>;

export const NotificationPreferencesSchema = z.object({
    emailEnabled: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
    smsEnabled: z.boolean().optional(),
    inAppEnabled: z.boolean().optional(),
});
export type NotificationPreferencesInput = z.infer<typeof NotificationPreferencesSchema>;

export const SendNotificationSchema = z.object({
    accountIds: z.array(z.string()).min(1, 'At least one recipient is required'),
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    type: z.string().optional(),
    data: z.record(z.unknown()).optional(),
});
export type SendNotificationInput = z.infer<typeof SendNotificationSchema>;
