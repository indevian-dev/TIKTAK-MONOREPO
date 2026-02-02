/**
 * Card Database Schema & Operations
 * Drizzle table definitions and queries
 */

import {
  pgTable,
  bigserial,
  timestamp,
  boolean,
  text,
  varchar,
  doublePrecision,
  json,
  jsonb,
  bigint,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Cards table - Draft/unpublished listings
 */
export const cards = pgTable('cards', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  title: text('title'),
  isApproved: boolean('is_approved').default(false),
  price: doublePrecision('price'),
  body: text('body'),
  storeId: bigint('store_id', { mode: 'number' }),
  accountId: bigint('account_id', { mode: 'number' }),
  storagePrefix: varchar('storage_prefix').unique(),
  location: json('location'),
  images: json('images'),
  cover: varchar('cover'),
  video: varchar('video'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  filtersOptions: jsonb('filters_options'),
  categories: jsonb('categories').default('[]'),
});

/**
 * Cards Published table - Active published listings
 */
export const cardsPublished = pgTable('cards_published', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  title: text('title'),
  isActive: boolean('is_active').default(true),
  price: doublePrecision('price'),
  body: text('body'),
  premiumUntil: timestamp('premium_until', { withTimezone: true }),
  storeId: bigint('store_id', { mode: 'number' }),
  accountId: bigint('account_id', { mode: 'number' }),
  storagePrefix: varchar('storage_prefix').unique(),
  location: json('location'),
  images: json('images'),
  cover: varchar('cover'),
  video: varchar('video'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  filtersOptions: jsonb('filters_options'),
  categories: jsonb('categories').default('[]'),
  cardId: bigint('card_id', { mode: 'number' }).unique(),
});

/**
 * Favorite Cards table - User favorites
 */
export const favoriteCards = pgTable('favorite_cards', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  cardId: bigint('card_id', { mode: 'number' }),
  accountId: bigint('account_id', { mode: 'number' }),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type CardRow = typeof cards.$inferSelect;
export type CardInsert = typeof cards.$inferInsert;
export type CardPublishedRow = typeof cardsPublished.$inferSelect;
export type CardPublishedInsert = typeof cardsPublished.$inferInsert;
export type FavoriteCardRow = typeof favoriteCards.$inferSelect;
export type FavoriteCardInsert = typeof favoriteCards.$inferInsert;

