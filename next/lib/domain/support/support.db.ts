import {
    pgTable,
    timestamp,
    boolean,
    text,
    bigint,
    varchar,
} from 'drizzle-orm/pg-core';

/**
 * Conversations table - Chat conversations between users
 * ID: bigint GENERATED ALWAYS AS IDENTITY
 */
export const conversations = pgTable('conversations', {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    isActive: boolean('is_active'),
    hasNew: boolean('has_new'),
    cardId: bigint('card_id', { mode: 'number' }),
    cardStoreId: bigint('card_store_id', { mode: 'number' }),
    cardAccountId: bigint('card_account_id', { mode: 'number' }),
    accountId: bigint('account_id', { mode: 'number' }),
    tenantAccessKey: varchar('tenant_access_key'),
});

/**
 * Messages table - Individual chat messages
 * ID: bigint GENERATED ALWAYS AS IDENTITY
 */
export const messages = pgTable('messages', {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    conversationId: bigint('conversation_id', { mode: 'number' }).notNull(),
    senderId: bigint('sender_id', { mode: 'number' }).notNull(),
    content: text('content').notNull(),
    messageType: text('message_type').default('text'),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at', { withTimezone: true }),
});

export type ConversationRow = typeof conversations.$inferSelect;
export type ConversationInsert = typeof conversations.$inferInsert;
export type MessageRow = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;
