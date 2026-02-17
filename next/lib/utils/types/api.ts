/**
 * API Helper Types
 * Types for API call helpers (client-side and server-side)
 */

// ═══════════════════════════════════════════════════════════════
// API CALL CONFIG
// ═══════════════════════════════════════════════════════════════

export interface ApiCallConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
  retry?: RetryConfig;
  cache?: RequestCache;
}

export interface RetryConfig {
  attempts: number;
  delay: number;
  backoff?: 'linear' | 'exponential';
}

// ═══════════════════════════════════════════════════════════════
// API CALL RESULT
// ═══════════════════════════════════════════════════════════════

export interface ApiCallResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  status?: number;
  headers?: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════
// SSR API HELPER
// ═══════════════════════════════════════════════════════════════

export interface SsrApiCallOptions extends ApiCallConfig {
  cookies?: string;
  baseUrl?: string;
}

export interface SsrApiCallResult<T = any> extends ApiCallResult<T> {
  isServerSide: true;
}

// ═══════════════════════════════════════════════════════════════
// SPA API HELPER
// ═══════════════════════════════════════════════════════════════

export interface SpaApiCallOptions extends ApiCallConfig {
  showLoading?: boolean;
  showError?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface SpaApiCallResult<T = any> extends ApiCallResult<T> {
  isServerSide: false;
}

// ═══════════════════════════════════════════════════════════════
// API QUEUE (for SPA)
// ═══════════════════════════════════════════════════════════════

export interface ApiQueueItem {
  id: string;
  url: string;
  config: ApiCallConfig;
  timestamp: number;
  priority?: number;
}

export interface ApiQueueConfig {
  maxConcurrent: number;
  timeout: number;
  retryOnFailure: boolean;
}

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR
// ═══════════════════════════════════════════════════════════════

export interface RequestInterceptor {
  onRequest?: (config: ApiCallConfig) => ApiCallConfig | Promise<ApiCallConfig>;
  onResponse?: <T>(result: ApiCallResult<T>) => ApiCallResult<T> | Promise<ApiCallResult<T>>;
  onError?: (error: any) => void | Promise<void>;
}

// ═══════════════════════════════════════════════════════════════
// ABORT CONTROLLER
// ═══════════════════════════════════════════════════════════════

export interface ApiAbortController {
  signal: AbortSignal;
  abort: (reason?: string) => void;
}

