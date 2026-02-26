/**
 * Database Schema - Single Source of Truth
 * All Drizzle table definitions in one place.
 * Import tables and types from '@/lib/database/schema'
 */
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
  bigint,
  json,
  jsonb,
  integer,
  real,
  time,
  index,
  uniqueIndex,
  customType,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { generateSlimId } from "@/lib/utils/Helper.SlimUlid.util";

// ═══════════════════════════════════════════════════
// USERS & AUTH
// ═══════════════════════════════════════════════════

export const users = pgTable('users', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  phone: varchar('phone'),
  emailIsVerified: boolean('email_is_verified').default(false),
  phoneIsVerified: boolean('phone_is_verified').default(false),
  avatarUrl: text('avatar_url'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarBase64: varchar('avatar_base64'),
  twoFactorAuthEmailExpireAt: time('two_factor_auth_email_expire_at'),
  twoFactorAuthPhoneExpireAt: time('two_factor_auth_phone_expire_at'),
  fin: varchar('fin').unique(),
  sessionsGroupId: varchar('sessions_group_id'),
  sessions: json('sessions'),
});

export const userCredentials = pgTable('user_credentials', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  password: text('password'),
  facebookId: varchar('facebook_id').unique(),
  googleId: varchar('google_id').unique(),
  appleId: varchar('apple_id').unique(),
  userId: varchar('user_id'),
});

export const userSessions = pgTable('user_sessions', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  groupId: varchar('group_id'),
  device: varchar('device'),
  expireAt: timestamp('expire_at', { withTimezone: true }),
  browser: varchar('browser'),
  os: varchar('os'),
  metadata: json('metadata'),
  ip: varchar('ip'),
  accountId: varchar('account_id'),
  metaData: json('meta_data'),
});

export const accountOtps = pgTable('account_otps', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  code: varchar('code'),
  expireAt: timestamp('expire_at', { withTimezone: true }),
  type: varchar('type'),
  accountId: varchar('account_id'),
  destination: varchar('destination'),
});

// ═══════════════════════════════════════════════════
// ACCOUNTS
// ═══════════════════════════════════════════════════

export const accounts = pgTable('accounts', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  userId: varchar('user_id'),
  suspended: boolean('suspended').default(false),
  subscribedUntil: timestamp('subscribed_until', { withTimezone: true }),
  subscriptionType: varchar('subscription_type'),
});

// ═══════════════════════════════════════════════════
// WORKSPACES
// ═══════════════════════════════════════════════════

export const workspaces = pgTable('workspaces', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  type: varchar('type').notNull(),
  title: text('title').notNull(),
  profile: jsonb('profile').default('{}'),
  cityId: varchar('city_id'),
  isActive: boolean('is_active').default(true),
  isBlocked: boolean('is_blocked').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const workspaceAccesses = pgTable('workspace_accesses', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  actorAccountId: varchar('actor_account_id'),
  targetWorkspaceId: varchar('target_workspace_id'),
  viaWorkspaceId: varchar('via_workspace_id'),
  accessRole: varchar('access_role'),
  subscribedUntil: timestamp('subscribed_until', { withTimezone: true }),
  subscriptionTier: varchar('subscription_tier'),
});

export const workspaceRoles = pgTable('workspace_roles', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  name: varchar('name').notNull().unique(),
  slug: varchar('slug').notNull(),
  permissions: jsonb('permissions').default('{}'),
  isStaff: boolean('is_staff').default(false),
  forWorkspaceType: varchar('for_workspace_type'),
  description: text('description'),
});

export const workspaceInvitations = pgTable('workspace_invitations', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  invitedAccountId: varchar('invited_account_id'),
  forWorkspaceId: varchar('for_workspace_id'),
  invitedByAccountId: varchar('invited_by_account_id'),
  isApproved: boolean('is_approved').default(false),
  isDeclined: boolean('is_declined').default(false),
  accessRole: varchar('access_role'),
  expireAt: timestamp('expire_at', { withTimezone: true }),
});

export const workspaceSubscriptionCoupons = pgTable('workspace_subscription_coupons', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  discountPercent: bigint('discount_percent', { mode: 'number' }),
  code: varchar('code').notNull(),
  usageCount: bigint('usage_count', { mode: 'number' }),
  workspaceId: varchar('workspace_id'),
  isActive: boolean('is_active'),
});

export const workspaceSubscriptionTransactions = pgTable('workspace_subscription_transactions', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  paymentChannel: varchar('payment_channel'),
  paidAmount: real('paid_amount'),
  accountId: varchar('account_id'),
  workspaceId: varchar('workspace_id'),
  metadata: json('metadata'),
  status: varchar('status'),
  statusMetadata: json('status_metadata'),
});

// ═══════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════

export const accountNotifications = pgTable('account_notifications', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  markAsRead: boolean('mark_as_read'),
  accountId: varchar('account_id'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  workspaceId: varchar('workspace_id').notNull(),
  payload: jsonb('payload'),
});

// ═══════════════════════════════════════════════════
// CARDS & FAVORITES
// ═══════════════════════════════════════════════════

export const cards = pgTable('cards', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  title: text('title'),
  isApproved: boolean('is_approved').default(false),
  price: doublePrecision('price'),
  body: text('body'),
  storeId: varchar('store_id'),
  accountId: varchar('account_id'),
  storagePrefix: varchar('storage_prefix').unique(),
  location: json('location'),
  images: json('images'),
  cover: varchar('cover'),
  video: varchar('video'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  filtersOptions: jsonb('filters_options'),
  categories: jsonb('categories').default([]),
  workspaceId: varchar('workspace_id'),
});

export const favoriteCards = pgTable('favorite_cards', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  cardId: varchar('card_id').references(() => cards.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id').references(() => accounts.id, { onDelete: 'cascade' }),
});

// ═══════════════════════════════════════════════════
// CATEGORIES & FILTERS
// ═══════════════════════════════════════════════════

export const categories = pgTable('categories', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: jsonb('title').$type<{ az?: string; ru?: string; en?: string }>().default({}),
  isActive: boolean('is_active'),
  icon: varchar('icon'),
  description: jsonb('description').$type<{ az?: string; ru?: string; en?: string }>().default({}),
  parentId: varchar('parent_id'),
  hasOptions: boolean('has_options'),
  type: varchar('type'),
});

export const categoryFilters = pgTable('category_filters', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: varchar('category_id'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: jsonb('title').$type<{ az?: string; ru?: string; en?: string }>().default({}),
  type: varchar('type'),
});

export const categoryFilterOptions = pgTable('category_filter_options', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  title: jsonb('title').$type<{ az?: string; ru?: string; en?: string }>().default({}),
  filterId: varchar('filter_id'),
});

export const categoriesCardsStats = pgTable('categories_cards_stats', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: varchar('category_id'),
  allCardsCount: bigint('all_cards_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

export const categoriesAccountsCardsStats = pgTable('categories_accounts_cards_stats', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  accountId: varchar('account_id'),
  categoryId: varchar('category_id'),
  allCarsCount: bigint('all_cars_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

export const categoriesStoresCardsStats = pgTable('categories_stores_cards_stats', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  categoryId: varchar('category_id'),
  storeId: varchar('store_id'),
  allCardsCount: bigint('all_cards_count', { mode: 'number' }),
  publicCardsCount: bigint('public_cards_count', { mode: 'number' }),
});

// ═══════════════════════════════════════════════════
// SUPPORT (CONVERSATIONS & MESSAGES)
// ═══════════════════════════════════════════════════

export const conversations = pgTable('conversations', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  isActive: boolean('is_active'),
  hasNew: boolean('has_new'),
  cardId: varchar('card_id'),
  cardStoreId: varchar('card_store_id'),
  cardAccountId: varchar('card_account_id'),
  accountId: varchar('account_id'),
  workspaceId: varchar('workspace_id'),
});

export const messages = pgTable('messages', {
  id: varchar('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  conversationId: varchar('conversation_id').notNull(),
  senderId: varchar('sender_id').notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').default('text'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// ═══════════════════════════════════════════════════
// CONTENT (BLOGS & DOCS)
// ═══════════════════════════════════════════════════

export const blogs = pgTable('blogs', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  slug: varchar('slug'),
  isActive: boolean('is_active'),
  cover: text('cover'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  isFeatured: boolean('is_featured'),
  createdBy: varchar('created_by'),
  localizedContent: jsonb('localized_content'),
});

export const docs = pgTable('docs', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  type: varchar('type').unique(),
  updatedAt: timestamp('updated_at'),
  localizedContent: jsonb('localized_content'),
});

// ═══════════════════════════════════════════════════
// GEO (COUNTRIES & CITIES)
// ═══════════════════════════════════════════════════

export const countries = pgTable('countries', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  name: varchar('name').notNull().unique(),
  isoCode: varchar('iso_code').unique(),
  phoneCode: varchar('phone_code'),
  currency: varchar('currency').default('AZN'),
});

export const cities = pgTable('cities', {
  id: varchar('id').primaryKey().$defaultFn(() => generateSlimId()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  title: varchar('title'),
  countryId: varchar('country_id'),
});

// ═══════════════════════════════════════════════════
// DEACTIVATION REQUESTS
// ═══════════════════════════════════════════════════

export const deactivationRequests = pgTable('deactivation_requests', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: varchar('phone').notNull(),
  comment: text('comment'),
  status: varchar('status').default('pending'), // pending | processed | rejected
});

// ═══════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════

// Users & Auth
export type UserDbRecord = InferSelectModel<typeof users>;
export type UserDbInsert = InferInsertModel<typeof users>;
export type UserCredentialDbRecord = InferSelectModel<typeof userCredentials>;
export type UserCredentialDbInsert = InferInsertModel<typeof userCredentials>;
export type UserSessionDbRecord = InferSelectModel<typeof userSessions>;
export type UserSessionDbInsert = InferInsertModel<typeof userSessions>;
export type AccountOtpDbRecord = InferSelectModel<typeof accountOtps>;
export type AccountOtpDbInsert = InferInsertModel<typeof accountOtps>;

// Accounts
export type AccountDbRecord = InferSelectModel<typeof accounts>;
export type AccountDbInsert = InferInsertModel<typeof accounts>;

// Workspaces
export type WorkspaceDbRecord = InferSelectModel<typeof workspaces>;
export type WorkspaceDbInsert = InferInsertModel<typeof workspaces>;
export type WorkspaceAccessDbRecord = InferSelectModel<typeof workspaceAccesses>;
export type WorkspaceAccessDbInsert = InferInsertModel<typeof workspaceAccesses>;
export type WorkspaceRoleDbRecord = InferSelectModel<typeof workspaceRoles>;
export type WorkspaceRoleDbInsert = InferInsertModel<typeof workspaceRoles>;
export type WorkspaceInvitationDbRecord = InferSelectModel<typeof workspaceInvitations>;
export type WorkspaceInvitationDbInsert = InferInsertModel<typeof workspaceInvitations>;
export type WorkspaceSubscriptionCouponDbRecord = InferSelectModel<typeof workspaceSubscriptionCoupons>;
export type WorkspaceSubscriptionCouponDbInsert = InferInsertModel<typeof workspaceSubscriptionCoupons>;
export type WorkspaceSubscriptionTransactionDbRecord = InferSelectModel<typeof workspaceSubscriptionTransactions>;
export type WorkspaceSubscriptionTransactionDbInsert = InferInsertModel<typeof workspaceSubscriptionTransactions>;

// Notifications
export type AccountNotificationDbRecord = InferSelectModel<typeof accountNotifications>;
export type AccountNotificationDbInsert = InferInsertModel<typeof accountNotifications>;

// Cards
export type CardDbRecord = InferSelectModel<typeof cards>;
export type CardDbInsert = InferInsertModel<typeof cards>;
export type FavoriteCardDbRecord = InferSelectModel<typeof favoriteCards>;
export type FavoriteCardDbInsert = InferInsertModel<typeof favoriteCards>;

// Categories
export type CategoryDbRecord = InferSelectModel<typeof categories>;
export type CategoryDbInsert = InferInsertModel<typeof categories>;
export type CategoryFilterDbRecord = InferSelectModel<typeof categoryFilters>;
export type CategoryFilterDbInsert = InferInsertModel<typeof categoryFilters>;
export type CategoryFilterOptionDbRecord = InferSelectModel<typeof categoryFilterOptions>;
export type CategoryFilterOptionDbInsert = InferInsertModel<typeof categoryFilterOptions>;

// Support
export type ConversationDbRecord = InferSelectModel<typeof conversations>;
export type ConversationDbInsert = InferInsertModel<typeof conversations>;
export type MessageDbRecord = InferSelectModel<typeof messages>;
export type MessageDbInsert = InferInsertModel<typeof messages>;

// Content
export type BlogDbRecord = InferSelectModel<typeof blogs>;
export type BlogDbInsert = InferInsertModel<typeof blogs>;
export type DocDbRecord = InferSelectModel<typeof docs>;
export type DocDbInsert = InferInsertModel<typeof docs>;

// Geo
export type CountryDbRecord = InferSelectModel<typeof countries>;
export type CountryDbInsert = InferInsertModel<typeof countries>;
export type CityDbRecord = InferSelectModel<typeof cities>;
export type CityDbInsert = InferInsertModel<typeof cities>;

// Deactivation
export type DeactivationRequestDbRecord = InferSelectModel<typeof deactivationRequests>;
export type DeactivationRequestDbInsert = InferInsertModel<typeof deactivationRequests>;
