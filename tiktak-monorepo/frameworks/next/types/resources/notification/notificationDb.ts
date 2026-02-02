/**
 * Notification Database Schema & Operations
 * Drizzle table definitions and queries
 */

import {
  pgTable,
  bigserial,
  timestamp,
  boolean,
  varchar,
  bigint,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Account Notifications table - User notifications
 */
export const accountsNotifications = pgTable('accounts_notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  name: varchar('name'),
  body: varchar('body'),
  markAsRead: boolean('mark_as_read'),
  accountId: bigint('account_id', { mode: 'number' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  tenantAccessKey: varchar('tenant_access_key'),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type NotificationRow = typeof accountsNotifications.$inferSelect;
export type NotificationInsert = typeof accountsNotifications.$inferInsert;

