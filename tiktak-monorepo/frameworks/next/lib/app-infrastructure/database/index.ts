/**
 * Database Compatibility Layer
 * Re-exports from new locations for backward compatibility with @/db imports
 */

// Export database instance and Drizzle utilities
export { db } from '@/lib/clients/drizzlePostgresClient';
import * as schema from '@/types/resources';

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

// Re-export all table schemas from colocated resources
export {
  // Account tables
  accounts,
  accountsRoles,
  // Card tables
  cards,
  cardsPublished,
  favoriteCards,
  // Category tables
  categories,
  categoryFilters,
  categoryFilterOptions,
  categoriesCardsStats,
  categoriesAccountsCardsStats,
  categoriesStoresCardsStats,
  // Notification tables
  accountsNotifications,
  // Order tables
  transactions,
  // Provider tables (personal & store tenants)
  tenantsProvidersTypePersonal,
  tenantsProvidersTypeStore,
  tenantsApplications,
  storesTags,
  // Legacy store exports (backward compatibility)
  tenantsProvidersTypeStore as stores,
  tenantsApplications as storesApplications,
  // User tables
  users,
  otps,
  // Shared tables
  conversations,
  messages,
  blogs,
  pages,
  cities,
  actionLogs,
} from '@/types/resources';
