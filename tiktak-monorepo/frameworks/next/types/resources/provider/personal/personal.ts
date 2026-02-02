/**
 * Personal Provider Types
 * Individual seller profiles with domain-specific views
 */

import type { Money, Location, Pagination } from '@/types/values';
import type { Timestamps, EntityStatus } from '@/types/base';

export namespace PersonalProvider {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    title?: string;
    description?: string;
    logo?: string;
    cover?: string;
    address?: string;
    phone?: string;
    location?: Location;
    status: EntityStatus;
    isBlocked: boolean;
    isActive: boolean;
    isApproved: boolean;
    rating?: number;
    reviewCount: number;
    viewCount: number;
    totalListings: number;
    activeListings: number;
    totalSales: number;
    totalRevenue: Money;
    storeTagId?: number;
    tenantType: 'personal';
    tenantAccessKey: string;
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - what unauthenticated users see */
  export interface PublicAccess {
    id: number;
    title?: string;
    description?: string;
    logo?: string;
    cover?: string;
    rating?: number;
    reviewCount?: number;
    viewCount?: number;
    totalListings?: number;
    activeListings?: number;
    createdAt?: string;
    responseTime?: string;
  }

  /** Private access - what authenticated owners see */
  export interface PrivateAccess extends Full {
    isOwner: boolean;
    canEdit: boolean;
    canDelete: boolean;
    stats: {
      totalListings: number;
      activeListings: number;
      totalOrders: number;
      totalRevenue: Money;
      averageRating: number;
      responseRate: number;
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    title: string;
    description?: string;
    phone?: string;
    address?: string;
    location?: Location;
  }

  export interface UpdateInput extends Partial<CreateInput> {
    id: number;
    logo?: string;
    cover?: string;
  }

  export interface ListQuery {
    search?: string;
    page?: number;
    pageSize?: number;
  }

  export interface ListResult {
    providers: PublicAccess[];
    pagination: Pagination;
  }
}

