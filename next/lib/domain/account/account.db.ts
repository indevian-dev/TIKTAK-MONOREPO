import {
    pgTable,
    timestamp,
    boolean,
    varchar,
} from 'drizzle-orm/pg-core';

/**
 * Accounts table - User accounts linked to users
 * ID: varchar (slimulid)
 */
export const accounts = pgTable('accounts', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    userId: varchar('user_id'),
    suspended: boolean('suspended').default(false),
    subscribedUntil: timestamp('subscribed_until', { withTimezone: true }),
    subscriptionType: varchar('subscription_type'),
});

export type AccountRow = typeof accounts.$inferSelect;
export type AccountInsert = typeof accounts.$inferInsert;
