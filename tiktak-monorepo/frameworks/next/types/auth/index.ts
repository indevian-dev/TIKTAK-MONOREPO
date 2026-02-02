/**
 * Auth Types - Central Export
 * All authentication, authorization, and security types
 */

// ═══════════════════════════════════════════════════════════════
// AUTH CONTEXT & CORE
// ═══════════════════════════════════════════════════════════════

export type {
  AuthData,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from './authContext';

// ═══════════════════════════════════════════════════════════════
// SESSION
// ═══════════════════════════════════════════════════════════════

export type {
  Session,
  DeviceInfo,
  CreateSessionInput,
  UpdateSessionInput,
  SessionListItem,
  SessionListResponse,
  RevokeSessionRequest,
  RevokeSessionResponse,
  RevokeAllSessionsResponse,
} from './session';

// ═══════════════════════════════════════════════════════════════
// JWT
// ═══════════════════════════════════════════════════════════════

export type {
  AccessTokenPayload,
  RefreshTokenPayload,
  JwtPayload,
  DecodedAccessToken,
  DecodedRefreshToken,
  JwtTokenPair,
  TokenGenerationResult,
  TokenSignResult,
  TokenVerificationResult,
  JwtVerificationResult,
  TokenErrorCode,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './jwt';

// ═══════════════════════════════════════════════════════════════
// COOKIES
// ═══════════════════════════════════════════════════════════════

export {
  CookieNames,
} from './cookies';

export type {
  CookieName,
  CookieOptions,
  SecureCookieConfig,
  CookiePresets,
  SetCookieInput,
  GetCookieInput,
  DeleteCookieInput,
  CookieParseResult,
} from './cookies';

// ═══════════════════════════════════════════════════════════════
// OAUTH
// ═══════════════════════════════════════════════════════════════

export {
  OAuthProviders,
} from './oauth';

export type {
  OAuthProvider,
  OAuthTokenData,
  OAuthUserInfo,
  OAuthConfig,
  OAuthAuthorizationRequest,
  OAuthAuthorizationResponse,
  OAuthCallbackRequest,
  OAuthCallbackResponse,
  LinkOAuthProviderRequest,
  LinkOAuthProviderResponse,
  UnlinkOAuthProviderRequest,
  UnlinkOAuthProviderResponse,
  LinkedOAuthProvider,
  OAuthProfileResponse,
} from './oauth';

// ═══════════════════════════════════════════════════════════════
// OTP
// ═══════════════════════════════════════════════════════════════

export {
  OtpType,
} from './otp';

export type {
  OtpRecord,
  RecentOtpRecord,
  OtpPartialRecord,
  GenerateOtpInput,
  GenerateOtpResult,
  ValidateOtpInput,
  ValidateOtpResult,
  OtpValidationError,
  StoreOtpResult,
  SendOtpInput,
  SendOtpResult,
  StoreAndSendOtpResult,
  ResendOtpRequest,
  ResendOtpResponse,
  OtpConfig,
} from './otp';

// ═══════════════════════════════════════════════════════════════
// PASSWORD
// ═══════════════════════════════════════════════════════════════

export type {
  PasswordRequirements,
  PasswordStrength,
  PasswordStrengthResult,
  ValidatePasswordInput,
  PasswordValidationResult,
  PasswordHashResult,
  PasswordVerifyInput,
  PasswordVerifyResult,
  PasswordResetToken,
  GeneratePasswordResetTokenInput,
  GeneratePasswordResetTokenResult,
  ValidatePasswordResetTokenInput,
  ValidatePasswordResetTokenResult,
  PasswordResetTokenError,
  PasswordHistoryEntry,
  CheckPasswordHistoryInput,
  CheckPasswordHistoryResult,
} from './password';

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export {
  PermissionCategory,
  PermissionAction,
  CommonPermissions,
} from './permissions';

export type {
  Permission,
  PermissionDefinition,
  PermissionScope,
  RolePermissions,
  CheckPermissionInput,
  CheckPermissionResult,
  GrantPermissionInput,
  RevokePermissionInput,
  PermissionChangeResult,
  PermissionGroup,
} from './permissions';

// ═══════════════════════════════════════════════════════════════
// SECURITY
// ═══════════════════════════════════════════════════════════════

export type {
  CsrfToken,
  GenerateCsrfTokenInput,
  GenerateCsrfTokenResult,
  ValidateCsrfTokenInput,
  ValidateCsrfTokenResult,
  CsrfError,
  SecurityHeaders,
  SecurityHeadersConfig,
  RateLimitConfig,
  RateLimitInfo,
  IpWhitelistEntry,
  IpBlacklistEntry,
  CheckIpAccessInput,
  CheckIpAccessResult,
  SecurityAuditLog,
  SecurityAction,
  SuspiciousActivityAlert,
  SuspiciousActivityType,
  SecurityPolicy,
} from './security';

// ═══════════════════════════════════════════════════════════════
// TWO-FACTOR AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

export {
  TwoFactorMethods,
} from './twoFactor';

export type {
  TwoFactorMethod,
  TwoFactorConfig,
  SetupTwoFactorRequest,
  SetupTwoFactorResponse,
  VerifyTwoFactorRequest,
  VerifyTwoFactorResponse,
  TwoFactorChallenge,
  CreateTwoFactorChallengeInput,
  CreateTwoFactorChallengeResult,
  BackupCode,
  GenerateBackupCodesRequest,
  GenerateBackupCodesResponse,
  UseBackupCodeRequest,
  UseBackupCodeResponse,
  AuthenticatorSetup,
  VerifyAuthenticatorRequest,
  VerifyAuthenticatorResponse,
  TrustedDevice,
  RegisterTrustedDeviceInput,
  RegisterTrustedDeviceResult,
  RemoveTrustedDeviceRequest,
  RemoveTrustedDeviceResponse,
  DisableTwoFactorRequest,
  DisableTwoFactorResponse,
  TwoFactorStatusResponse,
} from './twoFactor';

// ═══════════════════════════════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════════════════════════════

export type {
  TokenLifecycle,
  TokenType,
  TokenStatus,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
  TokenRefreshError,
  TokenRotationConfig,
  RotateTokenInput,
  RotateTokenResult,
  RevokeTokenRequest,
  RevokeTokenResponse,
  RevokeAllTokensRequest,
  RevokeAllTokensResponse,
  BlacklistedToken,
  CheckTokenBlacklistInput,
  CheckTokenBlacklistResult,
  ValidateTokenInput,
  ValidateTokenResult,
  TokenValidationError,
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  RevokeApiKeyRequest,
  RevokeApiKeyResponse,
  ListApiKeysResponse,
  TokenMetrics,
  TokenUsageStats,
} from './tokens';

// ═══════════════════════════════════════════════════════════════
// VERIFICATION
// ═══════════════════════════════════════════════════════════════

export type {
  VerificationType,
  VerificationStatus,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  SendPhoneVerificationRequest,
  SendPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  VerificationToken,
  GenerateVerificationCodeInput,
  GenerateVerificationCodeResult,
  ValidateVerificationCodeInput,
  ValidateVerificationCodeResult,
  VerificationError,
  ResendVerificationRequest,
  ResendVerificationResponse,
  CheckVerificationStatusRequest,
  CheckVerificationStatusResponse,
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangePhoneRequest,
  ChangePhoneResponse,
  VerificationConfig,
} from './verification';

