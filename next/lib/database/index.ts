/**
 * Database Compatibility Layer
 * Re-exports from new locations for backward compatibility with @/db imports
 */

// Export database instance and Drizzle utilities
export { db } from '@/lib/clients/drizzlePostgresClient';
export type { DrizzleDb as DbClient } from '@/types/lib/database';

// Re-export all Drizzle ORM operators and utilities
export {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  isNull,
  isNotNull,
  inArray,
  notInArray,
  exists,
  notExists,
  between,
  notBetween,
  like,
  notLike,
  ilike,
  notIlike,
  and,
  or,
  not,
  desc,
  asc,
  count,
  sum,
  avg,
  min,
  max,
  aliasedTable,
} from 'drizzle-orm';

// Re-export all table schemas from modular locations
export {
  // User tables
  users,
  userCredentials,
  userSessions,
  accountOtps,
  // Account tables
  accounts,
  // Workspace tables
  workspaces,
  workspaceAccesses,
  workspaceRoles,
  workspaceSubscriptionCoupons,
  workspaceSubscriptionTransactions,
  // Card tables
  cards,
  favoriteCards,
  // Category tables
  categories,
  categoryFilters,
  categoryFilterOptions,
  categoriesCardsStats,
  categoriesAccountsCardsStats,
  categoriesStoresCardsStats,
  // Notification tables
  accountNotifications,
  // Support tables
  conversations,
  messages,
  // Content tables
  blogs,
  docs,
  // Geo tables
  countries,
  cities,
} from './schema';
