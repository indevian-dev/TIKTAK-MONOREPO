/**
 * Cookie Management Types
 * Types for secure cookie handling and configuration
 */

// ═══════════════════════════════════════════════════════════════
// COOKIE NAMES
// ═══════════════════════════════════════════════════════════════

export const CookieNames = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  SESSION_ID: 'session_id',
  ACCOUNT_ID: 'account_id',
  CSRF_TOKEN: 'csrf_token',
  TWO_FACTOR_TOKEN: 'two_factor_token',
  REMEMBER_ME: 'remember_me',
} as const;

export type CookieName = (typeof CookieNames)[keyof typeof CookieNames];

// ═══════════════════════════════════════════════════════════════
// COOKIE OPTIONS
// ═══════════════════════════════════════════════════════════════

export interface CookieOptions {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
  maxAge?: number; // in seconds
  expires?: Date;
}

// ═══════════════════════════════════════════════════════════════
// SECURE COOKIE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface SecureCookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
}

// ═══════════════════════════════════════════════════════════════
// COOKIE PRESETS
// ═══════════════════════════════════════════════════════════════

export interface CookiePresets {
  accessToken: SecureCookieConfig;
  refreshToken: SecureCookieConfig;
  session: SecureCookieConfig;
  csrf: SecureCookieConfig;
  twoFactor: SecureCookieConfig;
}

// ═══════════════════════════════════════════════════════════════
// COOKIE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export interface SetCookieInput {
  name: CookieName | string;
  value: string;
  options?: Partial<SecureCookieConfig>;
}

export interface GetCookieInput {
  name: CookieName | string;
}

export interface DeleteCookieInput {
  name: CookieName | string;
  path?: string;
  domain?: string;
}

export interface CookieParseResult {
  [key: string]: string;
}

