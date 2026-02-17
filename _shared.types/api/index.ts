/**
 * API Types - Central Export
 * All API-related types
 */

// Handlers
export type {
  ApiHandlerContext,
  TypedApiHandler,
  PaginatedApiHandler,
  PaginationParams,
  PaginationMeta,
} from './handlers';

export {
  extractPaginationParams,
  createPaginationMeta,
  successResponse,
  errorResponse,
  paginatedResponse,
} from './handlers';

// Responses
export {
  ApiErrorCodes,
} from './responses';

export type {
  ApiResponse,
  ApiError,
  SuccessApiResponse,
  ErrorApiResponse,
  PaginatedApiResponse,
  ApiErrorCode,
} from './responses';

// Requests
export type {
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
} from './requests';

// Endpoints
export type {
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
} from './endpoints';

