/**
 * Store Provider Types
 * Business seller profiles with domain-specific views
 */

import type { Money, Location, Pagination } from '@/types/values';
import type { Timestamps, ImageFile, EntityStatus } from '@/types/base';

export namespace StoreProvider {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    name: string;
    title?: string; // Database uses title
    description: string;
    logo?: string;
    banner?: string;
    cover?: string; // Database uses cover
    businessType: BusinessType;
    registrationNumber?: string;
    taxId?: string;
    email: string;
    phone?: string;
    website?: string;
    address: string;
    location?: Location;
    status: EntityStatus;
    isVerified: boolean;
    isApproved?: boolean; // Approval status
    isBlocked?: boolean; // Block status
    isActive?: boolean; // Active status
    verificationStatus: VerificationStatus;
    rating?: number;
    reviewCount: number;
    viewCount: number;
    totalListings: number;
    activeListings: number;
    totalSales: number;
    totalRevenue: Money;
    storeTagId?: number;
    tenantType: 'store';
    // Legacy snake_case for backward compatibility
    is_approved?: boolean;
    is_blocked?: boolean;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - what unauthenticated users see */
  export interface PublicAccess {
    id: number;
    name?: string;
    title?: string; // API uses title instead of name
    description?: string;
    logo?: string;
    banner?: string;
    cover?: string; // API uses cover instead of banner
    rating?: number;
    reviewCount?: number;
    viewCount?: number;
    totalListings?: number;
    activeListings?: number;
    isVerified?: boolean;
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
  // SUB-TYPES
  // ═══════════════════════════════════════════════════════════════

  export type BusinessType = 'individual' | 'company' | 'organization';
  export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    name: string;
    description: string;
    businessType: BusinessType;
    email: string;
    phone?: string;
    website?: string;
    address: string;
    location?: Location;
  }

  export interface UpdateInput extends Partial<CreateInput> {
    id: number;
    logo?: string;
    banner?: string;
  }

  export interface ListQuery {
    isVerified?: boolean;
    businessType?: BusinessType;
    search?: string;
    page?: number;
    pageSize?: number;
  }

  export interface ListResult {
    stores: PublicAccess[];
    pagination: Pagination;
  }
}

// ═══════════════════════════════════════════════════════════════
// DATABASE ENUMS
// ═══════════════════════════════════════════════════════════════

export enum StoreApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

