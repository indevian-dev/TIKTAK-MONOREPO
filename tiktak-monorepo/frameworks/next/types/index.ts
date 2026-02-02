/**
 * TIKTAK Type System - Central Export Hub
 * Centralized domain-driven types with multiple architectural layers
 * 
 * Import from this file: import type { User, Card, BaseModalProps } from '@/types';
 */

// ═══════════════════════════════════════════════════════════════
// RESOURCE TYPES (Domain Entities)
// ═══════════════════════════════════════════════════════════════

export type {
  User,
  Account,
  Card,
  CardSearchResponse,
  Store,
  Category,
  Order,
  Notification,
  Role,
  Permission,
  PermissionCategory,
  StoreApplication,
} from './resources';

// ═══════════════════════════════════════════════════════════════
// AUTH TYPES
// ═══════════════════════════════════════════════════════════════

export {
  CookieNames,
  OAuthProviders,
  OtpType,
  PermissionCategory as AuthPermissionCategory,
  PermissionAction,
  CommonPermissions,
  TwoFactorMethods,
} from './auth';

export type {
  // Core Auth
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
  // Session
  Session,
  DeviceInfo,
  CreateSessionInput,
  UpdateSessionInput,
  SessionListItem,
  SessionListResponse,
  RevokeSessionRequest,
  RevokeSessionResponse,
  RevokeAllSessionsResponse,
  // JWT
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
  // Cookies
  CookieName,
  CookieOptions,
  SecureCookieConfig,
  CookiePresets,
  SetCookieInput,
  GetCookieInput,
  DeleteCookieInput,
  CookieParseResult,
  // OAuth
  OAuthProvider,
  OAuthTokenData,
  OAuthUserInfo,
  OAuthConfig,
  OAuthAuthorizationRequest,
  OAuthAuthorizationResponse,
  OAuthCallbackRequest,
  OAuthCallbackResponse,
  LinkedOAuthProvider,
  OAuthProfileResponse,
  // OTP
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
  // Password
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
  // Permissions
  Permission as AuthPermission,
  PermissionDefinition,
  PermissionScope,
  RolePermissions,
  CheckPermissionInput,
  CheckPermissionResult,
  GrantPermissionInput,
  RevokePermissionInput,
  PermissionChangeResult,
  PermissionGroup,
  // Security
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
  SecurityAuditLog,
  SecurityAction,
  SuspiciousActivityAlert,
  SuspiciousActivityType,
  SecurityPolicy,
  // 2FA
  TwoFactorMethod,
  TwoFactorConfig,
  SetupTwoFactorRequest,
  SetupTwoFactorResponse,
  VerifyTwoFactorRequest,
  VerifyTwoFactorResponse,
  TwoFactorChallenge,
  BackupCode,
  GenerateBackupCodesRequest,
  GenerateBackupCodesResponse,
  AuthenticatorSetup,
  TrustedDevice,
  TwoFactorStatusResponse,
  // Tokens
  TokenLifecycle,
  TokenType,
  TokenStatus,
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
  TokenRefreshError,
  RevokeTokenRequest,
  RevokeTokenResponse,
  RevokeAllTokensRequest,
  RevokeAllTokensResponse,
  ValidateTokenInput,
  ValidateTokenResult,
  TokenValidationError,
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  RevokeApiKeyRequest,
  RevokeApiKeyResponse,
  ListApiKeysResponse,
  // Verification
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
  ResendVerificationRequest,
  ResendVerificationResponse,
  CheckVerificationStatusRequest,
  CheckVerificationStatusResponse,
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangePhoneRequest,
  ChangePhoneResponse,
  VerificationConfig,
} from './auth';

// ═══════════════════════════════════════════════════════════════
// LIB TYPES (Infrastructure & Services)
// ═══════════════════════════════════════════════════════════════

export {
  ApiErrorCodes,
  LogLevels as LibLogLevels,
  AzerbaijanPhoneConfig,
} from './lib';

// Export Next.js API types
export type {
  ApiHandlerOptions,
  ApiRouteHandler,
} from './next';

export type {
  // API Handlers
  ApiHandlerContext,
  TypedApiHandler,
  PaginatedApiHandler,
  PaginationParams,
  PaginationMeta,
  // API Responses
  ApiResponse,
  ApiError,
  SuccessApiResponse,
  ErrorApiResponse,
  PaginatedApiResponse,
  ApiErrorCode,
  // API Requests
  PaginationQuery,
  SortQuery,
  SearchQuery,
  FilterQuery,
  DateRangeQuery,
  ListQuery,
  FilteredListQuery,
  IdParams,
  SlugParams,
  CreateRequestBody,
  UpdateRequestBody,
  BulkOperationRequestBody,
  BulkDeleteRequestBody,
  FileUploadRequest,
  MultiFileUploadRequest,
  FileUploadResponse,
  BatchRequest,
  BatchResponse,
  ExportRequest,
  ExportResponse,
  ImportRequest,
  ImportResponse,
  // API Endpoints
  EndpointConfig,
  EndpointsMap,
  ActionLogConfig,
  RouteValidation,
  ApiValidationResult,
  RateLimitConfig as ApiRateLimitConfig,
  CacheConfig,
  EndpointMetadata,
  ApiVersion,
  VersionedEndpoint,
  // Database
  DrizzleDb,
  DbTransaction,
  InferSelectModel,
  InferInsertModel,
  OwnershipCondition,
  OwnedDb,
  // Services - Validation
  ValidationError,
  ValidationResult,
  ValidationRule,
  SanitizerFunction,
  ValidationSchema,
  FieldValidationConfig,
  EmailValidationResult,
  UrlValidationResult,
  ValidationOptions,
  ValidatorPresets,
  // Services - Logger
  LogLevel,
  LogContext,
  LogEntry,
  LoggerInstance,
  LoggerConfig,
  LogTransport,
  PerformanceLog,
  PerformanceTimer,
  // Helpers - API
  ApiCallConfig,
  RetryConfig,
  ApiCallResult,
  SsrApiCallOptions,
  SsrApiCallResult,
  SpaApiCallOptions,
  SpaApiCallResult,
  ApiQueueItem,
  ApiQueueConfig,
  RequestInterceptor,
  ApiAbortController,
  // Helpers - File
  FileUploadConfig,
  ImageResizeConfig,
  FileUploadResult,
  MultiFileUploadResult,
  FileMetadata,
  ImageMetadata,
  VideoMetadata,
  FileValidationResult,
  FileValidationRules,
  FileProcessingOptions,
  FileProcessingResult,
  StorageProvider,
  // Utils - Phone
  PhoneValidationResult,
  PhoneFormatOptions,
  CleanPhoneResult,
  FormattedPhoneResult,
  ParsedPhone,
  PhoneNumberType,
  CountryPhoneConfig,
  // Utils - Password
  HashPasswordResult,
  HashPasswordOptions,
  VerifyPasswordResult,
  VerifyPasswordOptions,
  GeneratePasswordOptions,
  GeneratePasswordResult,
  // Signals
  EmailTemplate,
  EmailRecipient,
  SendEmailInput,
  EmailAttachment,
  SendEmailResult,
  SMSTemplate,
  SendSMSInput,
  SendSMSResult,
} from './lib';

export {
  extractPaginationParams,
  createPaginationMeta,
  successResponse,
  errorResponse,
  paginatedResponse,
} from './lib';

// ═══════════════════════════════════════════════════════════════
// UI TYPES
// ═══════════════════════════════════════════════════════════════

export {
  FormModes,
  ButtonVariants,
  StatusVariants,
} from './ui';

export type {
  // Base types (to extend)
  BaseModalProps,
  BaseFormProps,
  BaseCardProps,
  BaseTableProps,
  TableColumn,
  BaseListProps,
  // Contracts (to use)
  SelectOption,
  FormMode,
  ButtonVariant,
  ButtonSize,
  StatusVariant,
  StatusBadgeSize,
  // Utilities
  FormState,
  FormField,
  FormErrors,
  FormTouched,
  FormValues,
  TableState,
  TableSort,
  TableSelection,
  FilterState,
  FilterOption,
  DateRangeFilter as UiDateRangeFilter,
  PriceRangeFilter,
} from './ui';

// ═══════════════════════════════════════════════════════════════
// BASE TYPES (Foundational)
// ═══════════════════════════════════════════════════════════════

export type {
  // Timestamps & Base Entities
  Timestamps,
  BaseEntity,
  BaseUuidEntity,
  // Status types
  EntityStatus,
  ApprovalStatus,
  VisibilityLevel,
  // Media
  MediaFile,
  ImageFile,
  VideoFile,
  // Coordinates
  Coordinates,
  // Utility types
  PartialUpdate,
  CreateInput,
  UpdateInput,
  PublicView,
} from './base';

// Re-export pagination and response types from base.ts (not lib/api)
export type {
  PaginationMeta as BasePaginationMeta,
  PaginatedResponse as BasePaginatedResponse,
  ApiResponse as BaseApiResponse,
  ValidationResult as BaseValidationResult,
} from './base';

// ═══════════════════════════════════════════════════════════════
// VALUE OBJECTS (With Business Logic)
// ═══════════════════════════════════════════════════════════════

// Export both interface and namespace (no need for separate type export)
export { Money, PhoneNumber, Location, Pagination } from './values';

// ═══════════════════════════════════════════════════════════════
// NEXT.JS TYPES
// ═══════════════════════════════════════════════════════════════

export type {
  NextPageProps,
  NextLayoutProps,
  NextErrorProps,
  NextGenerateMetadata,
  PageParams,
  SearchParams,
} from './next';

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export {
  // Store mappers
  mapStoreToPublic,
  mapStoreToProvider,
  mapStoreToAdmin,
  // Card mappers
  mapCardToPublic,
  mapCardToProvider,
  mapCardToAdmin,
  // Account mappers
  mapAccountToPublic,
  mapAccountToSelf,
  mapAccountToAdmin,
  // Utility functions
  dateToIsoString,
  snakeToCamel,
  transformKeys,
  pickFields,
  omitFields,
  mapArray,
  mapArrayAsync,
} from './mappers';

// ═══════════════════════════════════════════════════════════════
// DATABASE TYPES (Re-export for convenience)
// ═══════════════════════════════════════════════════════════════

export type { StoreApplicationRow } from './resources/store/storeDb';

// ═══════════════════════════════════════════════════════════════
// LEGACY COMPATIBILITY (DEPRECATED - DO NOT USE IN NEW CODE)
// ═══════════════════════════════════════════════════════════════

// Note: Old import paths from src/types/ are deprecated.
// All new code should import from '@/types' central hub.
// Legacy types kept for backwards compatibility but may be removed.
