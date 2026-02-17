/**
 * API Response Types
 * Standardized API response structures
 */

import type { PaginationMeta } from './handlers';

// ═══════════════════════════════════════════════════════════════
// API RESPONSE & ERROR
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: number;
  requestId?: string;
}

export interface ApiError extends Error {
  code?: string;
  status?: number;
  response?: {
    data?: any;
    status?: number;
  };
  details?: any;
}

// ═══════════════════════════════════════════════════════════════
// SUCCESS RESPONSE
// ═══════════════════════════════════════════════════════════════

export interface SuccessApiResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

// ═══════════════════════════════════════════════════════════════
// ERROR RESPONSE
// ═══════════════════════════════════════════════════════════════

export interface ErrorApiResponse extends ApiResponse<never> {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ═══════════════════════════════════════════════════════════════
// PAGINATED RESPONSE
// ═══════════════════════════════════════════════════════════════

export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ═══════════════════════════════════════════════════════════════
// COMMON ERROR CODES
// ═══════════════════════════════════════════════════════════════

export const ApiErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_NEEDS_REFRESH: 'TOKEN_NEEDS_REFRESH',
  
  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Operations
  OPERATION_FAILED: 'OPERATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ApiErrorCode = (typeof ApiErrorCodes)[keyof typeof ApiErrorCodes];

