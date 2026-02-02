/**
 * Lib Types - Central Export
 * All library/infrastructure types mirroring src/lib/
 */

// ═══════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════

export type {
  // Handlers
  ApiHandlerContext,
  TypedApiHandler,
  PaginatedApiHandler,
  PaginationParams,
  PaginationMeta,
  // Responses
  ApiResponse,
  ApiError,
  SuccessApiResponse,
  ErrorApiResponse,
  PaginatedApiResponse,
  ApiErrorCode,
  // Requests
  PaginationQuery,
  SortQuery,
  SearchQuery,
  FilterQuery,
  DateRangeQuery,
  ListQuery,
  FilteredListQuery,
  IdParams,
  SlugParams,
  NestedIdParams,
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
  // Endpoints
  EndpointConfig,
  EndpointsMap,
  ActionLogConfig,
  RouteValidation,
  ApiValidationResult,
  RateLimitConfig,
  CacheConfig,
  EndpointMetadata,
  ApiVersion,
  VersionedEndpoint,
} from './api';

export {
  // Handler helpers
  extractPaginationParams,
  createPaginationMeta,
  successResponse,
  errorResponse,
  paginatedResponse,
  // Response constants
  ApiErrorCodes,
} from './api';

// ═══════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════

export type {
  // Validation
  ValidationError,
  ValidationResult,
  ValidationRule,
  SanitizerFunction,
  ValidationSchema,
  FieldValidationConfig,
  EmailValidationResult,
  PhoneValidationResult as ServicePhoneValidationResult,
  UrlValidationResult,
  ValidationOptions,
  ValidatorPresets,
  // Logger
  LogLevel,
  LogContext,
  LogEntry,
  LoggerInstance,
  LoggerConfig,
  LogTransport,
  PerformanceLog,
  PerformanceTimer,
} from './services';

export {
  LogLevels,
} from './services';

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export type {
  // API Helpers
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
  // File Helpers
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
} from './helpers';

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

export type {
  // Phone Utils
  PhoneValidationResult,
  PhoneFormatOptions,
  CleanPhoneResult,
  FormattedPhoneResult,
  ParsedPhone,
  PhoneNumberType,
  CountryPhoneConfig,
  // Password Utils
  PasswordValidationResult as UtilPasswordValidationResult,
  PasswordStrength as UtilPasswordStrength,
  HashPasswordResult,
  HashPasswordOptions,
  VerifyPasswordResult,
  VerifyPasswordOptions,
  GeneratePasswordOptions,
  GeneratePasswordResult,
} from './utils';

export {
  AzerbaijanPhoneConfig,
} from './utils';

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════

export type {
  DrizzleDb,
  DbTransaction,
  InferSelectModel,
  InferInsertModel,
  OwnershipCondition,
  OwnedDb,
} from './database';

// ═══════════════════════════════════════════════════════════════
// SIGNALS (Email, SMS, Push)
// ═══════════════════════════════════════════════════════════════

export type {
  EmailTemplate,
  EmailRecipient,
  SendEmailInput,
  EmailAttachment,
  SendEmailResult,
  SMSTemplate,
  SendSMSInput,
  SendSMSResult,
} from './signals';

