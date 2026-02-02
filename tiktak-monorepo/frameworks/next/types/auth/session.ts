/**
 * Session Management Types
 * User session tracking and management
 */

// ═══════════════════════════════════════════════════════════════
// SESSION ENTITY
// ═══════════════════════════════════════════════════════════════

export interface Session {
  id: string;
  userId: string;
  accountId: number;
  createdAt: string;
  expiresAt?: string;
  lastActivityAt?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: DeviceInfo;
}

// ═══════════════════════════════════════════════════════════════
// DEVICE INFO
// ═══════════════════════════════════════════════════════════════

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os?: string;
  browser?: string;
  deviceName?: string;
}

// ═══════════════════════════════════════════════════════════════
// SESSION OPERATIONS
// ═══════════════════════════════════════════════════════════════

export interface CreateSessionInput {
  userId: string;
  accountId: number;
  ipAddress?: string;
  userAgent?: string;
  expiresIn?: number; // in seconds
}

export interface UpdateSessionInput {
  sessionId: string;
  lastActivityAt?: string;
  expiresAt?: string;
}

export interface SessionListItem extends Session {
  isCurrent: boolean;
  isExpired: boolean;
}

export interface SessionListResponse {
  sessions: SessionListItem[];
  total: number;
}

export interface RevokeSessionRequest {
  sessionId: string;
}

export interface RevokeSessionResponse {
  success: boolean;
  message?: string;
}

export interface RevokeAllSessionsResponse {
  success: boolean;
  revokedCount: number;
  message?: string;
}

