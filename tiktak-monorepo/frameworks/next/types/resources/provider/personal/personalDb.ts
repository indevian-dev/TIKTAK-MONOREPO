/**
 * Personal Provider Database Schema & Operations
 * Drizzle table definitions for individual sellers
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
 * Personal Provider Tenants - Individual sellers
 */
export const tenantsProvidersTypePersonal = pgTable('tenants_providers_type_personal', {
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
  tenantType: varchar('tenant_type'),
  tenantAccessKey: varchar('tenant_access_key'),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type PersonalProviderRow = typeof tenantsProvidersTypePersonal.$inferSelect;
export type PersonalProviderInsert = typeof tenantsProvidersTypePersonal.$inferInsert;

