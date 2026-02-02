/**
 * Store Provider Database Schema & Operations
 * Drizzle table definitions for business sellers
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
 * Store Provider Tenants - Business/organization sellers
 */
export const tenantsProvidersTypeStore = pgTable('tenants_providers_type_store', {
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
  // Note: scopeKey removed - ownership via tenant_access_key in other tables
});

/**
 * Tenant Applications - Store application requests
 */
export const tenantsApplications = pgTable('tenants_applications', {
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

export type StoreProviderRow = typeof tenantsProvidersTypeStore.$inferSelect;
export type StoreProviderInsert = typeof tenantsProvidersTypeStore.$inferInsert;
export type TenantApplicationRow = typeof tenantsApplications.$inferSelect;
export type TenantApplicationInsert = typeof tenantsApplications.$inferInsert;
export type StoreTagRow = typeof storesTags.$inferSelect;
export type StoreTagInsert = typeof storesTags.$inferInsert;

