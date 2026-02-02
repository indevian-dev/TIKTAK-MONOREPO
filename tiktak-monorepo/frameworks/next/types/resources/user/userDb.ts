/**
 * User Database Schema & Operations
 * Drizzle table definitions and queries
 */

import {
  pgTable,
  bigserial,
  timestamp,
  uuid,
  boolean,
  text,
  varchar,
  json,
} from 'drizzle-orm/pg-core';

// ═══════════════════════════════════════════════════════════════
// TABLE SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * Users table - Core user authentication and profile
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  phone: varchar('phone'),
  emailIsVerified: boolean('email_is_verified'),
  phoneIsVerified: boolean('phone_is_verified'),
  provider: varchar('provider'),
  avatarUrl: text('avatar_url'),
  name: text('name'),
  lastName: text('last_name'),
  avatarBase64: varchar('avatar_base64'),
  sessions: json('sessions'),
  facebookId: varchar('facebook_id'),
  appleId: varchar('apple_id'),
  googleId: varchar('google_id'),
  twoFactorAuthPhoneExpireAt: timestamp('two_factor_auth_phone_expire_at', { withTimezone: true }),
  twoFactorAuthEmailExpireAt: timestamp('two_factor_auth_email_expire_at', { withTimezone: true }),
});

/**
 * OTPs table - One-time passwords for verification
 */
export const otps = pgTable('otps', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  code: varchar('code'),
  expireAt: timestamp('expire_at', { withTimezone: true }),
  userId: uuid('user_id'),
  type: varchar('type'),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type OtpRow = typeof otps.$inferSelect;
export type OtpInsert = typeof otps.$inferInsert;

