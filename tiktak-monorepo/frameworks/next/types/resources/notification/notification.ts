/**
 * Notification Types
 * User notification system
 */

import type { Timestamps } from '@/types/base';

export namespace Notification {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    userId: string;
    accountId: number;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    readAt?: string;
    actionUrl?: string;
    priority: Priority;
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - basic notification preview */
  export interface PublicAccess {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }

  /** Private access - full notification details for owner */
  export interface PrivateAccess extends Full {
    canDelete: boolean;
    canMarkAsRead: boolean;
    // Legacy property names for backward compatibility
    mark_as_read: boolean;
    name: string;
    body: string;
    created_at: string;
  }

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
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    userId: string;
    accountId: number;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    actionUrl?: string;
    priority?: Priority;
  }

  export interface ListQuery {
    isRead?: boolean;
    type?: NotificationType[];
    page?: number;
    pageSize?: number;
  }

  export interface MarkAsReadInput {
    notificationIds: number[];
  }
}

