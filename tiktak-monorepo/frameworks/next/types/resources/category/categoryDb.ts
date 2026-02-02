/**
 * Category Database Schema & Operations
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
 * Categories table - Hierarchical category structure
 */
export const categories = pgTable('categories', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: varchar('title'),
  isActive: boolean('is_active'),
  icon: varchar('icon'),
  description: varchar('description'),
  parentId: bigint('parent_id', { mode: 'number' }),
  hasOptions: boolean('has_options'),
  type: varchar('type'),
  titleRu: varchar('title_ru'),
  titleEn: varchar('title_en'),
  descriptionRu: text('description_ru'),
  descriptionEn: text('description_en'),
});

/**
 * Category Filters table - Dynamic filter definitions per category
 */
export const categoryFilters = pgTable('category_filters', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: bigint('category_id', { mode: 'number' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: varchar('title'),
  type: varchar('type'),
  titleEn: varchar('title_en'),
  titleRu: varchar('title_ru'),
});

/**
 * Category Filter Options table - Values for select/checkbox filters
 */
export const categoryFilterOptions = pgTable('category_filter_options', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: varchar('title'),
  filterId: bigint('filter_id', { mode: 'number' }),
  titleEn: varchar('title_en'),
  titleRu: varchar('title_ru'),
});

/**
 * Category Cards Stats table - Statistics per category
 */
export const categoriesCardsStats = pgTable('categories_cards_stats', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: bigint('category_id', { mode: 'number' }),
  allCardsCount: bigint('all_cards_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

/**
 * Category Account Cards Stats table - Stats per account per category
 */
export const categoriesAccountsCardsStats = pgTable('categories_accounts_cards_stats', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  accountId: bigint('account_id', { mode: 'number' }),
  categoryId: bigint('category_id', { mode: 'number' }),
  allCarsCount: bigint('all_cars_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

/**
 * Category Store Cards Stats table - Stats per store per category
 */
export const categoriesStoresCardsStats = pgTable('categories_stores_cards_stats', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: bigint('category_id', { mode: 'number' }),
  storeId: bigint('store_id', { mode: 'number' }),
  allCardsCount: bigint('all_cards_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type CategoryRow = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;
export type CategoryFilterRow = typeof categoryFilters.$inferSelect;
export type CategoryFilterInsert = typeof categoryFilters.$inferInsert;
export type CategoryFilterOptionRow = typeof categoryFilterOptions.$inferSelect;
export type CategoryFilterOptionInsert = typeof categoryFilterOptions.$inferInsert;

