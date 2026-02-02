/**
 * Order Database Schema & Operations
 * Drizzle table definitions and queries
 * 
 * Note: This is a placeholder as orders table doesn't exist in current schema
 * Uncomment and adjust when implementing order functionality
 */

import {
  pgTable,
  bigserial,
  timestamp,
  uuid,
  varchar,
  doublePrecision,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Transactions table - Payment transactions
 * Note: This is the existing table, should be expanded for full order support
 */
export const transactions = pgTable('transactions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  indetificator: uuid('indetificator').defaultRandom(),
  paymentCount: doublePrecision('payment_count'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  provider: varchar('provider'),
  status: varchar('status'),
  accountId: bigserial('account_id', { mode: 'number' }),
});

// TODO: Add full orders table when implementing order functionality
/*
export const orders = pgTable('orders', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  orderNumber: varchar('order_number').notNull().unique(),
  buyerId: uuid('buyer_id'),
  buyerAccountId: bigint('buyer_account_id', { mode: 'number' }),
  sellerId: uuid('seller_id'),
  sellerAccountId: bigint('seller_account_id', { mode: 'number' }),
  status: varchar('status'),
  paymentStatus: varchar('payment_status'),
  total: doublePrecision('total'),
  currency: varchar('currency').default('AZN'),
  // ... additional fields
});
*/

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type TransactionRow = typeof transactions.$inferSelect;
export type TransactionInsert = typeof transactions.$inferInsert;

