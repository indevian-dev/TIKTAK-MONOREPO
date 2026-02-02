/**
 * Database Types
 * Type definitions for Drizzle ORM database operations
 */

import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type * as schema from '@/db/schema';

// ═══════════════════════════════════════════════════════════════
// DATABASE CLIENT TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Drizzle database client type
 * Use this for the main database instance
 */
export type DrizzleDb = ReturnType<typeof import('drizzle-orm/postgres-js').drizzle<typeof schema>>;

/**
 * Database transaction type
 * Use this for all transaction callbacks
 * 
 * @example
 * ```typescript
 * const result = await db.transaction(async (tx: DbTransaction) => {
 *   const [item] = await tx.insert(items).values(data).returning();
 *   await tx.insert(actionLogs).values({ ... });
 *   return item;
 * });
 * ```
 */
export type DbTransaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

// ═══════════════════════════════════════════════════════════════
// QUERY BUILDER TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Inferred result type from a select query
 * Use Drizzle's built-in InferSelectModel instead
 */
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// ═══════════════════════════════════════════════════════════════
// OWNERSHIP TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Ownership condition for filtered database operations
 */
export interface OwnershipCondition {
  tenantAccessKey?: string;
  accountId?: number;
  column?: string;
  value?: any;
}

/**
 * Ownership-filtered database instance
 * Automatically applies tenant/account filters to queries
 */
export type OwnedDb = DrizzleDb;

