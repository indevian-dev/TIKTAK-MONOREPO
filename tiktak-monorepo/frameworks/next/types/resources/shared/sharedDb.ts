/**
 * Shared Database Schemas
 * Tables that don't belong to a specific resource domain
 */

import {
  pgTable,
  bigserial,
  timestamp,
  boolean,
  text,
  varchar,
  bigint,
  date,
  uuid,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// COMMUNICATION TABLES
// ═══════════════════════════════════════════════════════════════

/**
 * Conversations table - Chat conversations between users
 */
export const conversations = pgTable('conversations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  isActive: boolean('is_active'),
  hasNew: boolean('has_new'),
  cardId: bigint('card_id', { mode: 'number' }),
  cardStoreId: bigint('card_store_id', { mode: 'number' }),
  cardAccountId: bigint('card_account_id', { mode: 'number' }),
  accountId: bigint('account_id', { mode: 'number' }),
});

/**
 * Messages table - Individual chat messages
 */
export const messages = pgTable('messages', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  conversationId: bigint('conversation_id', { mode: 'number' }).notNull(),
  senderId: bigint('sender_id', { mode: 'number' }).notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').default('text'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// ═══════════════════════════════════════════════════════════════
// CONTENT TABLES
// ═══════════════════════════════════════════════════════════════

/**
 * Blogs table - Blog posts/articles
 */
export const blogs = pgTable('blogs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: varchar('title'),
  content: text('content'),
  authorId: bigint('author_id', { mode: 'number' }),
  isPublished: boolean('is_published').default(false),
  coverImage: varchar('cover_image'),
});

/**
 * Pages table - Static CMS pages
 */
export const pages = pgTable('pages', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  type: varchar('type').unique(),
  contentAz: text('content_az'),
  updateAt: date('update_at'),
  metaTitle: text('meta_title'),
  contentRu: text('content_ru'),
  contentEn: text('content_en'),
});

/**
 * Cities table - Location data
 */
export const cities = pgTable('cities', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  title: varchar('title'),
});

// ═══════════════════════════════════════════════════════════════
// AUDIT TABLES
// ═══════════════════════════════════════════════════════════════

/**
 * Action Logs table - Audit trail for all actions
 */
export const actionLogs = pgTable('action_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  action: text('action'),
  createdBy: bigint('created_by', { mode: 'number' }),
  resourceType: text('resource_type'),
  resourceId: bigint('resource_id', { mode: 'number' }),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type ConversationRow = typeof conversations.$inferSelect;
export type ConversationInsert = typeof conversations.$inferInsert;
export type MessageRow = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;
export type BlogRow = typeof blogs.$inferSelect;
export type BlogInsert = typeof blogs.$inferInsert;
export type PageRow = typeof pages.$inferSelect;
export type PageInsert = typeof pages.$inferInsert;
export type CityRow = typeof cities.$inferSelect;
export type CityInsert = typeof cities.$inferInsert;
export type ActionLogRow = typeof actionLogs.$inferSelect;
export type ActionLogInsert = typeof actionLogs.$inferInsert;

