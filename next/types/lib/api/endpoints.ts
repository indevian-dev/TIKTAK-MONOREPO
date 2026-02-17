/**
 * API Endpoint Configuration Types
 * Types for endpoint routing, validation, and access control
 */

// ═══════════════════════════════════════════════════════════════
// ENDPOINT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface EndpointConfig {
  method: string | string[];
  authRequired: boolean;
  skipEmailOrPhoneVerification?: boolean;
  permission?: string | null;
  twoFactorAuth?: boolean;
  twoFactorAuthType?: string | null;
  domain?: 'base' | 'dashboard' | 'console' | 'provider' | 'staff' | 'guest';
  authOptional?: boolean;
  verifyOwnership?: boolean; // Auto-filter queries by tenant_access_key
  rateLimit?: RateLimitConfig;
  cache?: CacheConfig;
  storeActionLog?: ActionLogConfig | boolean; // Auto-store action logs
  logErrors?: boolean; // Auto-log errors to railway (default: true)
}

// ═══════════════════════════════════════════════════════════════
// ACTION LOG CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface ActionLogConfig {
  action: string; // Action name (e.g., 'create_product', 'update_order')
  resourceType: string; // Resource type (e.g., 'products', 'orders')
  extractResourceId?: (response: any, request: any) => number | null; // Custom extractor for resource ID
  enabled?: boolean; // Can disable selectively (default: true)
}

export type EndpointsMap = Record<string, EndpointConfig>;

// ═══════════════════════════════════════════════════════════════
// ROUTE VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface RouteValidation {
  isValid: boolean;
  endpoint: EndpointConfig | undefined;
  normalizedPath: string | undefined;
}

export interface ApiValidationResult {
  valid: boolean;
  code?: string;
  authData?: any;
  accountId?: number;
  userId?: string;
  sessionId?: string;
  needsRefresh?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// CACHE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // in seconds
  key?: string;
  tags?: string[];
  revalidate?: number;
}

// ═══════════════════════════════════════════════════════════════
// ENDPOINT METADATA
// ═══════════════════════════════════════════════════════════════

export interface EndpointMetadata {
  path: string;
  method: string;
  domain: string;
  isPublic: boolean;
  requiresAuth: boolean;
  requiredPermissions: string[];
  description?: string;
  deprecated?: boolean;
  version?: string;
}

// ═══════════════════════════════════════════════════════════════
// API VERSION
// ═══════════════════════════════════════════════════════════════

export type ApiVersion = 'v1' | 'v2' | 'v3';

export interface VersionedEndpoint {
  version: ApiVersion;
  path: string;
  config: EndpointConfig;
}

