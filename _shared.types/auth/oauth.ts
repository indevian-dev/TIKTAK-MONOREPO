/**
 * OAuth Types
 * Types for OAuth authentication with third-party providers
 */

// ═══════════════════════════════════════════════════════════════
// OAUTH PROVIDERS
// ═══════════════════════════════════════════════════════════════

export type OAuthProvider = 'google' | 'facebook' | 'apple';

export const OAuthProviders = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
} as const;

// ═══════════════════════════════════════════════════════════════
// OAUTH TOKEN DATA
// ═══════════════════════════════════════════════════════════════

export interface OAuthTokenData {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

// ═══════════════════════════════════════════════════════════════
// OAUTH USER INFO
// ═══════════════════════════════════════════════════════════════

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  avatarUrl?: string; // Alternative property name for avatar
  verified_email?: boolean;
  email_verified?: boolean;
  provider: OAuthProvider;
}

// ═══════════════════════════════════════════════════════════════
// OAUTH CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

// ═══════════════════════════════════════════════════════════════
// OAUTH FLOW TYPES
// ═══════════════════════════════════════════════════════════════

export interface OAuthAuthorizationRequest {
  provider: OAuthProvider;
  redirectUri: string;
  state?: string;
  scope?: string[];
}

export interface OAuthAuthorizationResponse {
  authorizationUrl: string;
  state: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface OAuthCallbackResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  isNewUser?: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// OAUTH LINK/UNLINK TYPES
// ═══════════════════════════════════════════════════════════════

export interface LinkOAuthProviderRequest {
  provider: OAuthProvider;
  accessToken: string;
  userInfo: OAuthUserInfo;
}

export interface LinkOAuthProviderResponse {
  success: boolean;
  message: string;
  provider: OAuthProvider;
}

export interface UnlinkOAuthProviderRequest {
  provider: OAuthProvider;
}

export interface UnlinkOAuthProviderResponse {
  success: boolean;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// OAUTH PROFILE
// ═══════════════════════════════════════════════════════════════

export interface LinkedOAuthProvider {
  provider: OAuthProvider;
  providerId: string;
  email?: string;
  linkedAt: string;
  lastUsedAt?: string;
}

export interface OAuthProfileResponse {
  linkedProviders: LinkedOAuthProvider[];
  availableProviders: OAuthProvider[];
}

