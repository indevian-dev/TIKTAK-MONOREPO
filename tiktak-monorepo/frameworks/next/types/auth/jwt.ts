/**
 * JWT (JSON Web Token) Types
 * Types for token generation, verification, and payload structures
 */

// ═══════════════════════════════════════════════════════════════
// JWT PAYLOAD TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Access token payload
 * Short-lived token for API authentication
 */
export interface AccessTokenPayload {
  userId: string;
  accountId: number;
  sessionId: string;
  role: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  permissions?: string[];
  tenantType?: string;
  tenantAccessKey?: number;
  iat?: number;
  exp?: number;
}

/**
 * Refresh token payload
 * Long-lived token for obtaining new access tokens
 */
export interface RefreshTokenPayload {
  userId: string;
  accountId: number;
  sessionId: string;
  tokenId: string;
  // Abbreviated properties for JWT compactness
  uid?: string; // userId
  sid?: string; // sessionId
  iat?: number;
  exp?: number;
}

/**
 * Generic JWT payload
 * For contexts that work with either token type
 */
export interface JwtPayload {
  userId: string;
  accountId: number;
  email: string;
  permissions: string[];
  exp: number;
  iat?: number;
}

// ═══════════════════════════════════════════════════════════════
// DECODED TOKEN TYPES
// ═══════════════════════════════════════════════════════════════

export interface DecodedAccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export interface DecodedRefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
  valid?: boolean;
  error?: string;
  payload?: RefreshTokenPayload;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN PAIR
// ═══════════════════════════════════════════════════════════════

export interface JwtTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Access token expiry in seconds
  tokenType: 'Bearer';
}

// ═══════════════════════════════════════════════════════════════
// TOKEN GENERATION RESULTS
// ═══════════════════════════════════════════════════════════════

export interface TokenGenerationResult {
  accessToken: string;
  refreshToken: string;
  token?: string; // Legacy compatibility
  expiresIn: number;
  error?: string;
}

export interface TokenSignResult {
  token: string | null;
  error: string | null;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN VERIFICATION RESULTS
// ═══════════════════════════════════════════════════════════════

export interface TokenVerificationResult {
  valid: boolean;
  payload?: AccessTokenPayload | RefreshTokenPayload;
  error?: string;
  errorCode?: TokenErrorCode;
}

export interface JwtVerificationResult {
  isValid: boolean;
  payload?: JwtPayload;
  error?: TokenErrorCode;
  message?: string;
}

// ═══════════════════════════════════════════════════════════════
// TOKEN ERROR CODES
// ═══════════════════════════════════════════════════════════════

export type TokenErrorCode =
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_MALFORMED'
  | 'TOKEN_MISSING'
  | 'TOKEN_REVOKED'
  | 'SIGNATURE_INVALID'
  | 'PAYLOAD_INVALID';

// ═══════════════════════════════════════════════════════════════
// TOKEN REFRESH
// ═══════════════════════════════════════════════════════════════

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

