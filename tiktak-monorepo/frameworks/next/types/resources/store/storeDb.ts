/**
 * Store Database Schema & Operations
 * Drizzle table definitions and queries
 */

import {
  pgTable,
  bigserial,
  timestamp,
  boolean,
  varchar,
  text,
  bigint,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Stores table - Business profiles for sellers
 */
export const stores = pgTable('stores', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: varchar('title'),
  logo: varchar('logo'),
  cover: varchar('cover'),
  description: text('description'),
  address: varchar('address'),
  phone: varchar('phone'),
  isBlocked: boolean('is_blocked').default(false),
  isActive: boolean('is_active').default(true),
  isApproved: boolean('is_approved').default(false),
  storeTagId: bigint('store_tag_id', { mode: 'number' }),
  scopeKey: varchar('scope_key'),
});

/**
 * Store Applications table - Seller onboarding applications
 */
export const storesApplications = pgTable('stores_applications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  contactName: varchar('contact_name'),
  phone: varchar('phone'),
  email: varchar('email'),
  voen: varchar('voen').unique(),
  storeName: varchar('store_name'),
  storeAddress: varchar('store_address'),
  accountId: bigint('account_id', { mode: 'number' }),
});

/**
 * Store Tags table - Categorization tags for stores
 */
export const storesTags = pgTable('stores_tags', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  tagName: varchar('tag_name'),
  isActive: boolean('is_active'),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type StoreRow = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;
export type StoreApplicationRow = typeof storesApplications.$inferSelect;
export type StoreApplicationInsert = typeof storesApplications.$inferInsert;
export type StoreTagRow = typeof storesTags.$inferSelect;
export type StoreTagInsert = typeof storesTags.$inferInsert;

