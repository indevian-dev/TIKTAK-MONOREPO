/**
 * Notification Mapper
 * Transform AccountNotificationDbRecord (schema.ts) → Notification domain types.
 * AccountNotificationDbRecord is the single source of truth for field types.
 */

import type { AccountNotificationDbRecord } from '@/lib/database/schema';
import type { Notification } from '@tiktak/shared/types/domain/Notification.types';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

export function mapNotificationToPublic(row: AccountNotificationDbRecord): Notification.PublicAccess {
    const payload = row.payload as Record<string, unknown> | null;
    return {
        id: row.id,
        type: (payload?.type as Notification.NotificationType) ?? 'system',
        title: (payload?.title as string) ?? '',
        message: (payload?.body as string) ?? '',
        isRead: row.markAsRead ?? false,
        createdAt: row.createdAt,
    };
}

export function mapNotificationToPrivate(row: AccountNotificationDbRecord): Notification.PrivateAccess {
    const payload = row.payload as Record<string, unknown> | null;
    return {
        id: row.id,
        accountId: row.accountId ?? '',
        workspaceId: row.workspaceId,
        type: (payload?.type as Notification.NotificationType) ?? 'system',
        title: (payload?.title as string) ?? '',
        message: (payload?.body as string) ?? '',
        isRead: row.markAsRead ?? false,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? null,
        payload: payload,
        canDelete: true,
        canMarkAsRead: !(row.markAsRead ?? false),
    };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

export function mapNotificationsToPublic(rows: AccountNotificationDbRecord[]): Notification.PublicAccess[] {
    return rows.map(mapNotificationToPublic);
}

export function mapNotificationsToPrivate(rows: AccountNotificationDbRecord[]): Notification.PrivateAccess[] {
    return rows.map(mapNotificationToPrivate);
}
