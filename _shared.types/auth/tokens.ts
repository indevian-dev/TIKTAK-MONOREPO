/**
 * Token Management Types
 * Types for token lifecycle management and refresh flows
 */

// ═══════════════════════════════════════════════════════════════
// TOKEN LIFECYCLE
// ═══════════════════════════════════════════════════════════════

export interface TokenLifecycle {
  tokenId: string;
  userId: string;
  accountId: number;
  type: TokenType;
  issuedAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
  revokedBy?: string;
  revokedReason?: string;
  status: TokenStatus;
}

export type TokenType = 'access' | 'refresh' | 'reset' | 'verification' | 'api_key';
export type TokenStatus = 'active' | 'expired' | 'revoked' | 'suspended';

// ═══════════════════════════════════════════════════════════════
// TOKEN REFRESH
// ═══════════════════════════════════════════════════════════════

export interface RefreshAccessTokenRequest {
  refreshToken: string;
}

export interface RefreshAccessTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string; // Optionally rotate refresh token
  expiresIn?: number;
  error?: TokenRefreshError;
}

export type TokenRefreshError =
  | 'REFRESH_TOKEN_INVALID'
  | 'REFRESH_TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_REVOKED'
  | 'USER_NOT_FOUND'
  | 'ACCOUNT_SUSPENDED'
  | 'SESSION_INVALID';

// ═══════════════════════════════════════════════════════════════
// TOKEN ROTATION
// ═══════════════════════════════════════════════════════════════

export interface TokenRotationConfig {
  enabled: boolean;
  rotateOnRefresh: boolean;
  gracePeriodSeconds: number;
  maxRotations: number;
}

export interface RotateTokenInput {
  oldToken: string;
  tokenType: TokenType;
}

export interface RotateTokenResult {
  success: boolean;
  newToken?: string;
  expiresAt?: Date;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN REVOCATION
// ═══════════════════════════════════════════════════════════════

export interface RevokeTokenRequest {
  token: string;
  tokenType: TokenType;
  reason?: string;
}

export interface RevokeTokenResponse {
  success: boolean;
  message: string;
  revokedAt?: Date;
}

export interface RevokeAllTokensRequest {
  userId: string;
  exceptCurrent?: boolean;
}

export interface RevokeAllTokensResponse {
  success: boolean;
  revokedCount: number;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN BLACKLIST
// ═══════════════════════════════════════════════════════════════

export interface BlacklistedToken {
  tokenId: string;
  userId: string;
  tokenHash: string;
  blacklistedAt: Date;
  expiresAt: Date;
  reason?: string;
}

export interface CheckTokenBlacklistInput {
  tokenId: string;
}

export interface CheckTokenBlacklistResult {
  isBlacklisted: boolean;
  reason?: string;
  blacklistedAt?: Date;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidateTokenInput {
  token: string;
  tokenType: TokenType;
  checkBlacklist?: boolean;
  checkExpiry?: boolean;
}

export interface ValidateTokenResult {
  isValid: boolean;
  payload?: Record<string, any>;
  error?: TokenValidationError;
  expiresAt?: Date;
  isExpired: boolean;
  isBlacklisted: boolean;
}

export type TokenValidationError =
  | 'TOKEN_INVALID'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_BLACKLISTED'
  | 'TOKEN_MALFORMED'
  | 'SIGNATURE_INVALID'
  | 'ISSUER_INVALID';

// ═══════════════════════════════════════════════════════════════
// API KEYS
// ═══════════════════════════════════════════════════════════════

export interface ApiKey {
  id: string;
  userId: string;
  accountId: number;
  name: string;
  key: string;
  keyHash: string;
  permissions: string[];
  isActive: boolean;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expiresInDays?: number;
}

export interface CreateApiKeyResponse {
  success: boolean;
  apiKey?: string; // Full key only shown once
  keyId?: string;
  expiresAt?: Date;
  message: string;
}

export interface RevokeApiKeyRequest {
  keyId: string;
}

export interface RevokeApiKeyResponse {
  success: boolean;
  message: string;
}

export interface ListApiKeysResponse {
  keys: Array<Omit<ApiKey, 'key' | 'keyHash'>>;
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN METRICS
// ═══════════════════════════════════════════════════════════════

export interface TokenMetrics {
  userId: string;
  activeTokens: number;
  expiredTokens: number;
  revokedTokens: number;
  totalIssued: number;
  lastIssuedAt?: Date;
  averageLifetime: number; // in seconds
}

export interface TokenUsageStats {
  tokenId: string;
  totalRequests: number;
  lastUsedAt: Date;
  ipAddresses: string[];
  userAgents: string[];
}

