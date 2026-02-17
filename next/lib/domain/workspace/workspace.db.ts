import {
    pgTable,
    timestamp,
    boolean,
    text,
    varchar,
    jsonb,
    json,
    bigint,
    real,
} from 'drizzle-orm/pg-core';

/**
 * Workspaces table - Core workspace entity
 * ID: varchar (slimulid)
 */
export const workspaces = pgTable('workspaces', {
    id: varchar('id').primaryKey(),
    type: varchar('type').notNull(),
    title: text('title').notNull(),
    profile: jsonb('profile').default('{}'),
    cityId: varchar('city_id'),
    isActive: boolean('is_active').default(true),
    isBlocked: boolean('is_blocked').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/**
 * Workspace Accesses table - Links accounts to workspaces with roles
 * ID: varchar (slimulid)
 */
export const workspaceAccesses = pgTable('workspace_accesses', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    actorAccountId: varchar('actor_account_id'),
    targetWorkspaceId: varchar('target_workspace_id'),
    viaWorkspaceId: varchar('via_workspace_id'),
    accessRole: varchar('access_role'),
    subscribedUntil: timestamp('subscribed_until', { withTimezone: true }),
    subscriptionTier: varchar('subscription_tier'),
});

/**
 * Workspace Roles table - Role definitions with permissions
 * ID: varchar (slimulid)
 */
export const workspaceRoles = pgTable('workspace_roles', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    name: varchar('name').notNull().unique(),
    slug: varchar('slug').notNull(),
    permissions: jsonb('permissions').default('{}'),
    isStaff: boolean('is_staff').default(false),
    forWorkspaceType: varchar('for_workspace_type'),
});

/**
 * Workspace Subscription Coupons table
 * ID: varchar (slimulid)
 */
export const workspaceSubscriptionCoupons = pgTable('workspace_subscription_coupons', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    discountPercent: bigint('discount_percent', { mode: 'number' }),
    code: varchar('code').notNull(),
    usageCount: bigint('usage_count', { mode: 'number' }),
    workspaceId: varchar('workspace_id'),
    isActive: boolean('is_active'),
});

/**
 * Workspace Subscription Transactions table
 * ID: varchar (slimulid)
 */
export const workspaceSubscriptionTransactions = pgTable('workspace_subscription_transactions', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    paymentChannel: varchar('payment_channel'),
    paidAmount: real('paid_amount'),
    accountId: varchar('account_id'),
    workspaceId: varchar('workspace_id'),
    metadata: json('metadata'),
    status: varchar('status'),
    statusMetadata: json('status_metadata'),
});

export type WorkspaceRow = typeof workspaces.$inferSelect;
export type WorkspaceInsert = typeof workspaces.$inferInsert;
export type WorkspaceAccessRow = typeof workspaceAccesses.$inferSelect;
export type WorkspaceAccessInsert = typeof workspaceAccesses.$inferInsert;
export type WorkspaceRoleRow = typeof workspaceRoles.$inferSelect;
export type WorkspaceRoleInsert = typeof workspaceRoles.$inferInsert;
export type WorkspaceSubscriptionCouponRow = typeof workspaceSubscriptionCoupons.$inferSelect;
export type WorkspaceSubscriptionCouponInsert = typeof workspaceSubscriptionCoupons.$inferInsert;
export type WorkspaceSubscriptionTransactionRow = typeof workspaceSubscriptionTransactions.$inferSelect;
export type WorkspaceSubscriptionTransactionInsert = typeof workspaceSubscriptionTransactions.$inferInsert;
