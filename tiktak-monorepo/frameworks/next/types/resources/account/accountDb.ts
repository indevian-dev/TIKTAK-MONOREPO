/**
 * Account Database Schema & Operations
 * Drizzle table definitions and queries
 */

import {
  pgTable,
  bigserial,
  timestamp,
  uuid,
  boolean,
  text,
  varchar,
  json,
  bigint,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Accounts table - User accounts with scoping and permissions
 */
export const accounts = pgTable('accounts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  userId: uuid('user_id'),
  suspended: boolean('suspended').default(false),
  isPersonal: boolean('is_personal').default(true),
  role: text('role').default('basic_role'),
  isDeleted: boolean('is_deleted').default(false),
  tenantType: varchar('tenant_type'), // 'personal', 'store', 'staff', or null
  tenantAccessKey: bigint('tenant_access_key', { mode: 'number' }),
});

/**
 * Account Roles table - Role definitions with permissions
 */
export const accountsRoles = pgTable('accounts_roles', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  name: varchar('name').notNull().unique(),
  permissions: json('permissions'),
  version: bigint('version', { mode: 'number' }),
  type: varchar('type'),
  isStaff: boolean('is_staff'),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type AccountRow = typeof accounts.$inferSelect;
export type AccountInsert = typeof accounts.$inferInsert;
export type AccountRoleRow = typeof accountsRoles.$inferSelect;
export type AccountRoleInsert = typeof accountsRoles.$inferInsert;

