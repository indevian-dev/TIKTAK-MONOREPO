/**
 * Notification Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper (next/lib/domain/notification/Notification.mapper.ts) bridges
 * AccountNotificationDbRecord (from schema.ts) → these types.
 *
 * Input types (what clients SEND) live in Notification.schemas.ts (Zod).
 * ════════════════════════════════════════════════════════════════
 * NOTE: DB `account_notifications` uses varchar IDs (string), not number.
 */

export namespace Notification {
    // ═══════════════════════════════════════════════════════════════
    // SUB-TYPES
    // ═══════════════════════════════════════════════════════════════

    export type NotificationType =
        | 'order_placed'
        | 'order_confirmed'
        | 'order_shipped'
        | 'order_delivered'
        | 'order_cancelled'
        | 'message_received'
        | 'card_approved'
        | 'card_rejected'
        | 'store_verified'
        | 'review_received'
        | 'system';

    export type Priority = 'low' | 'normal' | 'high' | 'urgent';

    // ═══════════════════════════════════════════════════════════════
    // API OUTPUT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public access - basic notification preview */
    export interface PublicAccess {
        id: string;
        type: NotificationType;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }

    /** Private access - full notification for the owner */
    export interface PrivateAccess extends PublicAccess {
        accountId: string;
        workspaceId: string;
        payload?: Record<string, unknown> | null;
        updatedAt?: Date | null;
        canDelete: boolean;
        canMarkAsRead: boolean;
    }

    /** Paginated response shape from the notifications API */
    export interface PaginatedResponse {
        notifications: PrivateAccess[];
        pagination: {
            totalPages: number;
            hasPrev: boolean;
            hasNext: boolean;
            total: number;
        };
        unreadCount: number;
    }
}
