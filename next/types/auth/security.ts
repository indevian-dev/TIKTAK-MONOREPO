/**
 * Security Types
 * Types for security headers, CSRF protection, and security policies
 */

// ═══════════════════════════════════════════════════════════════
// CSRF PROTECTION
// ═══════════════════════════════════════════════════════════════

export interface CsrfToken {
  token: string;
  expiresAt: Date;
  userId?: string;
  sessionId?: string;
}

export interface GenerateCsrfTokenInput {
  userId?: string;
  sessionId?: string;
  expiresInMinutes?: number;
}

export interface GenerateCsrfTokenResult {
  token: string;
  expiresAt: Date;
}

export interface ValidateCsrfTokenInput {
  token: string;
  userId?: string;
  sessionId?: string;
}

export interface ValidateCsrfTokenResult {
  isValid: boolean;
  error?: CsrfError;
}

export type CsrfError =
  | 'CSRF_TOKEN_MISSING'
  | 'CSRF_TOKEN_INVALID'
  | 'CSRF_TOKEN_EXPIRED'
  | 'CSRF_TOKEN_MISMATCH';

// ═══════════════════════════════════════════════════════════════
// SECURITY HEADERS
// ═══════════════════════════════════════════════════════════════

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: 'DENY' | 'SAMEORIGIN';
  'X-Content-Type-Options'?: 'nosniff';
  'X-XSS-Protection'?: '1; mode=block';
  'Strict-Transport-Security'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
}

export interface SecurityHeadersConfig {
  enableCSP: boolean;
  cspDirectives?: Record<string, string[]>;
  enableFrameProtection: boolean;
  enableXSSProtection: boolean;
  enableHSTS: boolean;
  hstsMaxAge?: number;
}

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING (Note: Handled by Cloudflare, types for reference)
// ═══════════════════════════════════════════════════════════════

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// ═══════════════════════════════════════════════════════════════
// IP FILTERING
// ═══════════════════════════════════════════════════════════════

export interface IpWhitelistEntry {
  ip: string;
  description?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface IpBlacklistEntry {
  ip: string;
  reason: string;
  blockedAt: Date;
  expiresAt?: Date;
  blockedBy?: string;
}

export interface CheckIpAccessInput {
  ip: string;
  userId?: string;
}

export interface CheckIpAccessResult {
  isAllowed: boolean;
  reason?: string;
  isWhitelisted: boolean;
  isBlacklisted: boolean;
}

// ═══════════════════════════════════════════════════════════════
// AUDIT LOGGING
// ═══════════════════════════════════════════════════════════════

export interface SecurityAuditLog {
  id: number;
  timestamp: Date;
  userId?: string;
  accountId?: number;
  action: SecurityAction;
  resource: string;
  resourceId?: number | string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  details?: Record<string, any>;
}

export type SecurityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_reset'
  | 'password_change'
  | 'email_change'
  | 'two_factor_enabled'
  | 'two_factor_disabled'
  | 'oauth_linked'
  | 'oauth_unlinked'
  | 'suspicious_activity'
  | 'account_locked'
  | 'account_unlocked'
  | 'permission_granted'
  | 'permission_revoked';

// ═══════════════════════════════════════════════════════════════
// SUSPICIOUS ACTIVITY DETECTION
// ═══════════════════════════════════════════════════════════════

export interface SuspiciousActivityAlert {
  id: number;
  userId: string;
  accountId: number;
  type: SuspiciousActivityType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export type SuspiciousActivityType =
  | 'multiple_failed_logins'
  | 'unusual_location'
  | 'unusual_device'
  | 'rapid_requests'
  | 'privilege_escalation_attempt'
  | 'data_exfiltration_attempt'
  | 'brute_force_attempt'
  | 'suspicious_pattern';

// ═══════════════════════════════════════════════════════════════
// SECURITY POLICY
// ═══════════════════════════════════════════════════════════════

export interface SecurityPolicy {
  passwordPolicy: {
    minLength: number;
    requireComplexity: boolean;
    expiryDays?: number;
    preventReuse: number;
  };
  sessionPolicy: {
    maxAge: number;
    idleTimeout: number;
    singleSession: boolean;
  };
  twoFactorPolicy: {
    required: boolean;
    requiredForRoles: string[];
    allowedMethods: ('sms' | 'email' | 'authenticator')[];
  };
  ipPolicy: {
    enableWhitelist: boolean;
    enableBlacklist: boolean;
    enableGeoBlocking: boolean;
    blockedCountries: string[];
  };
}

