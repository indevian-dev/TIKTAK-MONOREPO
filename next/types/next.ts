/**
 * Next.js API Route Types
 * Type definitions for Next.js API routes and handlers
 */

import type { NextRequest } from 'next/server';
import type { AuthData } from './auth';
import type { GetUserDataResult } from '@/lib/auth/AuthDataRepository';
import type { DrizzleDb, OwnedDb } from './lib/database';

// ═══════════════════════════════════════════════════════════════
// API ROUTE HANDLER TYPES
// ═══════════════════════════════════════════════════════════════

export interface ApiHandlerContext {
  authData?: GetUserDataResult | null;
  params?: Record<string, string | string[]>;
  db: DrizzleDb; // Database instance (properly typed)
  ownedDb?: OwnedDb | null; // Ownership-enforced database instance
  endpointConfig?: any; // Endpoint configuration
  requestId?: string; // Request ID for logging
  log: {
    info: (message: string, data?: any) => void;
    error: (message: string, error?: any) => void;
    warn: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
    apiComplete?: (data: any) => void;
  };
}

export interface ApiHandlerOptions {
  ownership?: {
    table: string;
    column?: string;
    columns?: Array<{ column: string; authKey: string }>;
  };
  requireAuth?: boolean;
  requireTwoFactor?: boolean;
  allowedRoles?: string[];
}

export type ApiRouteHandler = (
  request: NextRequest,
  context: ApiHandlerContext
) => Promise<Response> | Response;

// ═══════════════════════════════════════════════════════════════
// NEXT.JS PAGE & LAYOUT TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Standard Next.js page props
 */
export interface NextPageProps<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[] | undefined>
> {
  params: TParams;
  searchParams: TSearchParams;
}

/**
 * Standard Next.js layout props
 */
export interface NextLayoutProps<TParams = Record<string, string>> {
  children: React.ReactNode;
  params: TParams;
}

/**
 * Next.js error page props
 */
export interface NextErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js metadata generation function type
 */
export type NextGenerateMetadata<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[] | undefined>
> = (props: NextPageProps<TParams, TSearchParams>) => Promise<any> | any;

/**
 * Page params type helper
 */
export type PageParams<T = Record<string, string>> = T;

/**
 * Search params type helper
 */
export type SearchParams<T = Record<string, string | string[] | undefined>> = T;