/**
 * Logger Service Types
 * Types for structured logging
 */

// ═══════════════════════════════════════════════════════════════
// LOG LEVELS
// ═══════════════════════════════════════════════════════════════

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'HTTP' | 'DEBUG' | 'TRACE' | 'FATAL';

export const LogLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  HTTP: 'HTTP',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE',
  FATAL: 'FATAL',
} as const;

// ═══════════════════════════════════════════════════════════════
// LOG CONTEXT
// ═══════════════════════════════════════════════════════════════

export interface LogContext {
  requestId?: string;
  correlationId?: string;
  userId?: string;
  accountId?: number;
  sessionId?: string;
  path?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
}

// ═══════════════════════════════════════════════════════════════
// LOG ENTRY
// ═══════════════════════════════════════════════════════════════

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  correlationId?: string;
  userId?: string;
  accountId?: number;
  sessionId?: string;
  path?: string;
  method?: string;
  durationMs?: number;
  statusCode?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  metadata?: Record<string, any>;
  tags?: string[];
  environment?: string;
  service?: string;
  version?: string;
}

// ═══════════════════════════════════════════════════════════════
// LOGGER INSTANCE
// ═══════════════════════════════════════════════════════════════

export interface LoggerInstance {
  info: (message: string, metadata?: Record<string, any>) => void;
  warn: (message: string, metadata?: Record<string, any>) => void;
  error: (message: string, error?: Error, metadata?: Record<string, any>) => void;
  debug: (message: string, metadata?: Record<string, any>) => void;
  http: (message: string, metadata?: Record<string, any>) => void;
  trace: (message: string, metadata?: Record<string, any>) => void;
  child: (context: Partial<LogContext>) => LoggerInstance;
}

// ═══════════════════════════════════════════════════════════════
// LOGGER CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface LoggerConfig {
  level: LogLevel;
  console: boolean;
  file?: {
    enabled: boolean;
    path: string;
    maxSize?: number;
    maxFiles?: number;
  };
  structured: boolean;
  colorize: boolean;
  timestamp: boolean;
  includeContext: boolean;
  redactSensitive: boolean;
  sensitiveFields?: string[];
}

// ═══════════════════════════════════════════════════════════════
// LOG TRANSPORT
// ═══════════════════════════════════════════════════════════════

export interface LogTransport {
  name: string;
  level: LogLevel;
  log: (entry: LogEntry) => void | Promise<void>;
}

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE LOGGING
// ═══════════════════════════════════════════════════════════════

export interface PerformanceLog {
  operation: string;
  durationMs: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface PerformanceTimer {
  start: () => void;
  end: (operation: string, metadata?: Record<string, any>) => void;
}

