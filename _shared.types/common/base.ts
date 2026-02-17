/**
 * Base Types
 * Foundational types used across the application
 */

// ═══════════════════════════════════════════════════════════════
// TIMESTAMPS & BASE ENTITIES
// ═══════════════════════════════════════════════════════════════

export interface Timestamps {
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}

export interface BaseEntity extends Timestamps {
  id: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface BaseUuidEntity extends Timestamps {
  id: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

// ═══════════════════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════════════════

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ═══════════════════════════════════════════════════════════════
// API RESPONSES
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T = any> {
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

// ═══════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// STATUS & STATE TYPES
// ═══════════════════════════════════════════════════════════════

export type EntityStatus = 
  | 'draft' 
  | 'active' 
  | 'inactive' 
  | 'suspended' 
  | 'deleted';

export type ApprovalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'under_review';

export type VisibilityLevel = 
  | 'public' 
  | 'private' 
  | 'unlisted' 
  | 'archived';

// ═══════════════════════════════════════════════════════════════
// MEDIA FILE TYPES
// ═══════════════════════════════════════════════════════════════

export interface MediaFile {
  id?: number;
  url: string;
  fileName?: string;
  fileSize?: number; // in bytes
  mimeType?: string;
  alt?: string;
  title?: string;
  order?: number;
}

export interface ImageFile extends MediaFile {
  width?: number;
  height?: number;
  thumbnail?: string;
  isPrimary?: boolean;
}

export interface VideoFile extends MediaFile {
  duration?: number; // in seconds
  thumbnail?: string;
  codec?: string;
  bitrate?: number;
}

// ═══════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Partial update type - all fields optional except ID
 */
export type PartialUpdate<T> = Partial<T> & { id: number };

/**
 * Create input type - omit timestamps and ID
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update input type - make all fields optional except ID
 */
export type UpdateInput<T> = Partial<CreateInput<T>> & { id: number };

/**
 * Public view type - remove sensitive fields
 */
export type PublicView<T> = Omit<
  T,
  | 'password'
  | 'passwordHash'
  | 'token'
  | 'refreshToken'
  | 'apiKey'
  | 'secret'
>;

// ═══════════════════════════════════════════════════════════════
// COORDINATES
// ═══════════════════════════════════════════════════════════════

export interface Coordinates {
  latitude: number;
  longitude: number;
}

