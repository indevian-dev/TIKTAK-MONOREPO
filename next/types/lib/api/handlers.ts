/**
 * API Handler Types
 * Typed wrappers for API route handlers
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ApiResponse, PaginatedApiResponse } from './responses';
import type { ApiHandlerContext } from '../../next';

// Re-export ApiHandlerContext for backward compatibility
export type { ApiHandlerContext };

// ═══════════════════════════════════════════════════════════════
// TYPED API HANDLER
// ═══════════════════════════════════════════════════════════════

/**
 * Typed API handler function
 * @template TResponse - The response data type
 * @template TContext - Additional context fields (extends ApiHandlerContext)
 */
export type TypedApiHandler<
  TResponse = unknown,
  TContext extends ApiHandlerContext = ApiHandlerContext
> = (
  request: NextRequest,
  context: TContext
) => Promise<NextResponse<ApiResponse<TResponse>> | NextResponse<TResponse>>;

// ═══════════════════════════════════════════════════════════════
// PAGINATED API HANDLER
// ═══════════════════════════════════════════════════════════════

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * Typed paginated API handler
 * @template TItem - The item type in the paginated list
 * @template TContext - Additional context fields
 */
export type PaginatedApiHandler<
  TItem = unknown,
  TContext extends ApiHandlerContext = ApiHandlerContext
> = TypedApiHandler<PaginatedApiResponse<TItem>, TContext>;

// ═══════════════════════════════════════════════════════════════
// QUERY PARAMS PARSER
// ═══════════════════════════════════════════════════════════════

/**
 * Extracts pagination params from URL search params
 */
export function extractPaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    pageSize: Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '10'))),
  };
}

/**
 * Creates pagination metadata
 */
export function createPaginationMeta(
  page: number,
  pageSize: number,
  total: number
): PaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page < Math.ceil(total / pageSize),
    hasPrev: page > 1,
  };
}

// ═══════════════════════════════════════════════════════════════
// RESPONSE HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Creates a typed success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    timestamp: Date.now(),
  } as ApiResponse<T>, { status });
}

/**
 * Creates a typed error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({
    success: false,
    error: { code, message },
    timestamp: Date.now(),
  } as ApiResponse<never>, { status });
}

/**
 * Creates a paginated success response
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  status: number = 200
): NextResponse<PaginatedApiResponse<T>> {
  return NextResponse.json({
    data,
    pagination,
  }, { status });
}

