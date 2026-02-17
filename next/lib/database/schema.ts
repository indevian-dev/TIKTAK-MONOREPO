/**
 * Database Schemas - Centralized Export
 * Re-exports all table schemas from their respective domain modules
 */

// User tables
export {
  users,
  userCredentials,
  userSessions,
  accountOtps,
} from '../domain/user/user.db';

// Account tables
export { accounts } from '../domain/account/account.db';

// Workspace tables
export {
  workspaces,
  workspaceAccesses,
  workspaceRoles,
  workspaceSubscriptionCoupons,
  workspaceSubscriptionTransactions,
} from '../domain/workspace/workspace.db';

// Notification tables
export { accountNotifications } from '../domain/notification/notification.db';

// Card tables
export { cards, favoriteCards } from '../domain/cards/cards.db';

// Category tables
export {
  categories,
  categoryFilters,
  categoryFilterOptions,
  categoriesCardsStats,
  categoriesAccountsCardsStats,
  categoriesStoresCardsStats,
} from '../domain/categories/categories.db';

// Communication tables
export { conversations, messages } from '../domain/support/support.db';

// Content tables
export { blogs, docs } from '../domain/content/content.db';

// Geo tables
export { countries, cities } from '../domain/base/domain.db';
