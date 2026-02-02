/**
 * API Request Types
 * Common request body and query parameter types
 */

// ═══════════════════════════════════════════════════════════════
// COMMON QUERY PARAMETERS
// ═══════════════════════════════════════════════════════════════

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface SearchQuery {
  query?: string;
  q?: string;
  search?: string;
}

export interface FilterQuery {
  filters?: Record<string, any>;
  [key: string]: any;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
  from?: string;
  to?: string;
  createdAfter?: string;
  createdBefore?: string;
}

// ═══════════════════════════════════════════════════════════════
// COMPOSITE QUERY TYPES
// ═══════════════════════════════════════════════════════════════

export interface ListQuery extends PaginationQuery, SortQuery, SearchQuery {
  // Combined query parameters for list endpoints
}

export interface FilteredListQuery extends ListQuery, FilterQuery, DateRangeQuery {
  // Combined query with filtering support
}

// ═══════════════════════════════════════════════════════════════
// PATH PARAMETERS
// ═══════════════════════════════════════════════════════════════

export interface IdParams {
  id: string | number;
}

export interface SlugParams {
  slug: string;
}

export interface NestedIdParams {
  parentId: string | number;
  childId: string | number;
}

// ═══════════════════════════════════════════════════════════════
// REQUEST BODY TYPES
// ═══════════════════════════════════════════════════════════════

export interface CreateRequestBody<T = any> {
  data: T;
}

export interface UpdateRequestBody<T = any> {
  data: Partial<T>;
}

export interface BulkOperationRequestBody<T = any> {
  items: T[];
}

export interface BulkDeleteRequestBody {
  ids: (string | number)[];
}

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD TYPES
// ═══════════════════════════════════════════════════════════════

export interface FileUploadRequest {
  file: File | Blob;
  filename?: string;
  mimetype?: string;
  metadata?: Record<string, any>;
}

export interface MultiFileUploadRequest {
  files: (File | Blob)[];
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  urls?: string[];
  fileId?: string;
  size?: number;
  mimetype?: string;
}

// ═══════════════════════════════════════════════════════════════
// BATCH OPERATIONS
// ═══════════════════════════════════════════════════════════════

export interface BatchRequest<T = any> {
  operations: Array<{
    operation: 'create' | 'update' | 'delete';
    data?: T;
    id?: string | number;
  }>;
}

export interface BatchResponse<T = any> {
  success: boolean;
  results: Array<{
    success: boolean;
    data?: T;
    error?: string;
  }>;
  totalSuccessful: number;
  totalFailed: number;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT/IMPORT TYPES
// ═══════════════════════════════════════════════════════════════

export interface ExportRequest {
  format?: 'json' | 'csv' | 'xlsx';
  filters?: Record<string, any>;
  fields?: string[];
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  expiresAt?: string;
  format: string;
  recordCount: number;
}

export interface ImportRequest {
  file: File | Blob;
  format: 'json' | 'csv' | 'xlsx';
  options?: {
    skipDuplicates?: boolean;
    updateExisting?: boolean;
    dryRun?: boolean;
  };
}

export interface ImportResponse {
  success: boolean;
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

