/**
 * Role & Permission Types
 * RBAC system for authorization
 */

import type { Timestamps } from '@/types/base';

export namespace Role {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    name: string;
    description?: string;
    permissions: string[];
    isSystem: boolean;
    // Legacy property names for backward compatibility
    created_at: string;
    pages_permissions: string[];
    apis_permissions: string[];
  }

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN VIEWS
  // ═══════════════════════════════════════════════════════════════

  /** Public access - basic role information */
  export interface PublicAccess {
    id: number;
    name: string;
    description?: string;
  }

  /** Private access - full role details with permissions */
  export interface PrivateAccess extends Full {
    canEdit: boolean;
    canDelete: boolean;
  }

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  export interface CreateInput {
    name: string;
    description?: string;
    permissions: string[];
  }

  export interface UpdateInput extends Partial<CreateInput> {
    id: number;
  }
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION TYPES
// ═══════════════════════════════════════════════════════════════

export interface Permission {
  id: string;
  name: string;
  description?: string;
  category: PermissionCategory;
}

export type PermissionCategory = 
  | 'cards'
  | 'stores'
  | 'orders'
  | 'users'
  | 'categories'
  | 'reports'
  | 'settings'
  | 'system';

// ═══════════════════════════════════════════════════════════════
// STORE APPLICATION (for backwards compatibility)
// ═══════════════════════════════════════════════════════════════

export interface StoreApplication {
  id: number;
  storeId: number;
  accountId: number;
  status: 'pending' | 'approved' | 'rejected';
  businessType: string;
  registrationNumber?: string;
  taxId?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  // Additional fields used in UI
  store_name: string;
  contact_name: string;
  email: string;
  phone: string;
  voen?: string;
  store_address: string;
  created_at: string;
}

