/**
 * Card Domain Types
 * Domain-specific types for Card entities (Marketplace listings/ads)
 */

import type { Timestamps, ImageFile, VideoFile, EntityStatus } from '@/types/base';
import type { Money, Location } from '@/types/values';

// ═══════════════════════════════════════════════════════════════
// CARD NAMESPACE (Domain Entity)
// ═══════════════════════════════════════════════════════════════

export namespace Card {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════

  export interface Full extends Timestamps {
    id: number;
    title: string;
    body?: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
    cover?: string;
    video?: {
      url: string;
      title?: string;
    };
    storage_prefix?: string;
    location?: Location;
    category_id?: number;
    categories?: number[];
    filters_options?: Record<string, any>;
    account_id: number;
    store_id?: number;
    status: 'draft' | 'published' | 'suspended' | 'deleted';
    is_approved?: boolean;
    is_active?: boolean;
    featured?: boolean;
    priority?: number;
    expires_at?: Date;
    metadata?: Record<string, any>;
    view_count: number;
    favorite_count: number;
    contact_count: number;
    share_count: number;
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - what unauthenticated users see */
  export interface PublicAccess {
    id: number;
    title: string;
    body?: string;
    price?: number;
    currency?: string;
    images?: string[];
    cover?: string;
    video?: {
      url: string;
      title?: string;
    };
    storage_prefix?: string;
    location?: Location;
    categories?: number[];
    view_count: number;
    favorite_count: number;
    contact_count: number;
    share_count: number;
    store_id?: number | null;
    // Legacy snake_case properties for backward compatibility
    created_at?: Date;
    updated_at?: Date | null;
    // Modern camelCase properties
    createdAt: Date;
    updatedAt?: Date;
    // Relationships
    store?: {
      id: number;
      name: string;
      logo?: string;
      isVerified: boolean;
    };
    category?: {
      id: number;
      name: string;
    };
    distance?: number; // Calculated field for location-based search
  }

  /** Private access - what authenticated users/owners see */
  export interface PrivateAccess extends Full {
    is_favorited?: boolean;
    is_bookmarked?: boolean;
    canEdit: boolean;
    canDelete: boolean;
    // Relationships
    store?: {
      id: number;
      name: string;
      logo?: string;
      isVerified: boolean;
    };
    category?: {
      id: number;
      name: string;
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // SUB-TYPES
  // ═══════════════════════════════════════════════════════════════

  export type CardStatus = 'draft' | 'published' | 'suspended' | 'deleted';

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    title: string;
    body?: string;
    price?: number;
    categories?: number[];
    images?: string[];
    cover?: string;
    video?: string;
    location?: Location;
    filters_options?: Record<string, any>;
    store_id?: number;
  }

  export interface UpdateInput extends Partial<CreateInput> {
    id: number;
    is_approved?: boolean;
    status?: CardStatus;
  }

  export interface SearchFilters {
    query?: string;
    category_ids?: number[];
    min_price?: number;
    max_price?: number;
    currency?: string;
    latitude?: number;
    longitude?: number;
    radius?: number; // in kilometers
    status?: CardStatus[];
    featured?: boolean;
    sort_by?: 'created_at' | 'price' | 'distance' | 'popularity' | 'relevance';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    created_after?: Date;
    created_before?: Date;
    account_id?: number;
    store_id?: number;
    tags?: string[];
  }
}

/**
 * Search response with pagination
 */
export interface CardSearchResponse {
  cards: Card.PublicAccess[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  filters_applied: Card.SearchFilters;
}

