import {
    pgTable,
    timestamp,
    boolean,
    text,
    varchar,
    json,
    time,
} from 'drizzle-orm/pg-core';

/**
 * Users table - Core user identity and profile
 * ID: varchar (slimulid)
 */
export const users = pgTable('users', {
    id: varchar('id').primaryKey(),
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

/**
 * User Credentials table - Authentication credentials (password + social)
 * ID: varchar (slimulid)
 */
export const userCredentials = pgTable('user_credentials', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    password: text('password'),
    facebookId: varchar('facebook_id').unique(),
    googleId: varchar('google_id').unique(),
    appleId: varchar('apple_id').unique(),
    userId: varchar('user_id'),
});

/**
 * User Sessions table - Active login sessions
 * ID: varchar (slimulid)
 */
export const userSessions = pgTable('user_sessions', {
    id: varchar('id').primaryKey(),
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

/**
 * Account OTPs table - One-time passwords for verification
 * ID: varchar (slimulid)
 */
export const accountOtps = pgTable('account_otps', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    code: varchar('code'),
    expireAt: timestamp('expire_at', { withTimezone: true }),
    type: varchar('type'),
    accountId: varchar('account_id'),
    destination: varchar('destination'),
});

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type UserCredentialRow = typeof userCredentials.$inferSelect;
export type UserCredentialInsert = typeof userCredentials.$inferInsert;
export type UserSessionRow = typeof userSessions.$inferSelect;
export type UserSessionInsert = typeof userSessions.$inferInsert;
export type AccountOtpRow = typeof accountOtps.$inferSelect;
export type AccountOtpInsert = typeof accountOtps.$inferInsert;
