/**
 * Role Database Schema & Operations
 * Drizzle table definitions and queries
 */

import { accountsRoles } from '../account/accountDb';

// ═══════════════════════════════════════════════════════════════
// TABLE REFERENCE
// ═══════════════════════════════════════════════════════════════

/**
 * Accounts Roles table - Role definitions with permissions
 * Note: This is shared with account resource but imported from accountDb
 * Not re-exported to avoid duplicate exports in index.ts
 */

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type RoleRow = typeof accountsRoles.$inferSelect;
export type RoleInsert = typeof accountsRoles.$inferInsert;

