/**
 * Notification Mappers
 * Transform database rows to domain types
 */

import type { Notification } from './notification.types';
import type { NotificationRow } from './notification.db';

// ═══════════════════════════════════════════════════════════════
// DB → DOMAIN MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map database notification row to PublicAccess view
 */
export function mapNotificationToPublic(row: NotificationRow): Notification.PublicAccess {
    return {
        id: row.id,
        type: 'system' as Notification.NotificationType, // Default type
        title: row.name || '',
        message: row.body || '',
        isRead: row.markAsRead || false,
        createdAt: row.createdAt || new Date(),
    };
}

/**
 * Map database notification row to PrivateAccess view (for owner)
 */
export function mapNotificationToPrivate(row: NotificationRow): Notification.PrivateAccess {
    return {
        id: row.id,
        userId: '', // Would need to join with accounts table
        accountId: Number(row.accountId),
        type: 'system' as Notification.NotificationType,
        title: row.name || '',
        message: row.body || '',
        isRead: row.markAsRead || false,
        priority: 'normal' as Notification.Priority,
        canDelete: true,
        canMarkAsRead: !row.markAsRead,
        // Legacy properties
        mark_as_read: row.markAsRead || false,
        name: row.name || '',
        body: row.body || '',
        created_at: row.createdAt?.toISOString() || new Date().toISOString(),
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || undefined,
    };
}

/**
 * Map database notification row to Full domain type
 */
export function mapNotificationToFull(row: NotificationRow): Partial<Notification.Full> {
    return {
        id: row.id,
        accountId: Number(row.accountId),
        type: 'system' as Notification.NotificationType,
        title: row.name || '',
        message: row.body || '',
        isRead: row.markAsRead || false,
        priority: 'normal' as Notification.Priority,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || undefined,
    };
}

// ═══════════════════════════════════════════════════════════════
// BATCH MAPPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Map array of notifications to PublicAccess views
 */
export function mapNotificationsToPublic(rows: NotificationRow[]): Notification.PublicAccess[] {
    return rows.map(mapNotificationToPublic);
}

/**
 * Map array of notifications to PrivateAccess views
 */
export function mapNotificationsToPrivate(rows: NotificationRow[]): Notification.PrivateAccess[] {
    return rows.map(mapNotificationToPrivate);
}
