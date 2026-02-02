/**
 * Database Schemas - Centralized Export
 * Re-exports all table schemas for Drizzle ORM
 */

// Account tables
export { accounts, accountsRoles } from '../types/resources/account/accountDb';

// Card tables
export { cards, cardsPublished, favoriteCards } from '../types/resources/card/cardDb';

// Category tables
export {
  categories,
  categoryFilters,
  categoryFilterOptions,
  categoriesCardsStats,
  categoriesAccountsCardsStats,
  categoriesStoresCardsStats
} from '../types/resources/category/categoryDb';

// Notification tables
export { accountsNotifications } from '../types/resources/notification/notificationDb';

// Order tables
export { transactions } from '../types/resources/order/orderDb';

// Provider tables (Personal & Store tenants)
export { 
  tenantsProvidersTypePersonal,
  tenantsProvidersTypeStore,
  tenantsApplications,
  storesTags
} from '../types/resources/provider';

// Legacy store exports (backward compatibility)
export { 
  tenantsProvidersTypeStore as stores,
  tenantsApplications as storesApplications
} from '../types/resources/provider';

// User tables
export { users, otps } from '../types/resources/user/userDb';

// Shared tables
export {
  conversations,
  messages,
  blogs,
  pages,
  cities,
  actionLogs
} from '../types/resources/shared/sharedDb';

