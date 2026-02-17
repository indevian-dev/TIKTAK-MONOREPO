import {
    pgTable,
    timestamp,
    boolean,
    varchar,
    jsonb,
} from 'drizzle-orm/pg-core';

/**
 * Account Notifications table - User notifications scoped to workspace
 * ID: varchar (slimulid)
 */
export const accountNotifications = pgTable('account_notifications', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    markAsRead: boolean('mark_as_read'),
    accountId: varchar('account_id'),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    workspaceId: varchar('workspace_id').notNull(),
    payload: jsonb('payload'),
});

export type AccountNotificationRow = typeof accountNotifications.$inferSelect;
export type AccountNotificationInsert = typeof accountNotifications.$inferInsert;
