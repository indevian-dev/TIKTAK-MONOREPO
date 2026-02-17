/**
 * Account Types
 * User account entity with domain-specific views
 */

import type { Timestamps } from '@/types/base';

export namespace Account {
    // ═══════════════════════════════════════════════════════════════
    // FULL ENTITY (Database/Internal)
    // ═══════════════════════════════════════════════════════════════

    export interface Full extends Timestamps {
        id: number;
        userId: string;
        suspended: boolean;
        isPersonal: boolean;
        role: string;
        isDeleted: boolean;
        tenantType?: string; // 'personal', 'store', 'staff', or null
        tenantAccessKey?: number;
    }

    // ═══════════════════════════════════════════════════════════════
    // DOMAIN VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public access - minimal safe fields */
    export interface PublicAccess {
        id: number;
        isPersonal: boolean;
        role: string;
    }

    /** Private access - full account details for owner */
    export interface PrivateAccess extends Full {
        canEdit: boolean;
        canDelete: boolean;
        permissions?: string[];
    }

    // ═══════════════════════════════════════════════════════════════
    // ROLE & PERMISSION NAMESPACE
    // ═══════════════════════════════════════════════════════════════

    export namespace Role {
        export interface Entity extends Timestamps {
            id: number;
            name: string;
            description?: string;
            permissions: string[];
            isSystem: boolean;
            // Legacy
            created_at: string;
        }

        export interface Public extends Pick<Entity, 'id' | 'name' | 'description'> { }
    }

    // ═══════════════════════════════════════════════════════════════
    // SUB-TYPES
    // ═══════════════════════════════════════════════════════════════

    export interface Role {
        id: number;
        name: string;
        permissions?: Record<string, any>;
        version?: number;
        type?: string;
        createdAt: string;
    }

    // ═══════════════════════════════════════════════════════════════
    // OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    export interface CreateInput {
        userId: string;
        isPersonal?: boolean;
        role?: string;
        tenantType?: string;
        tenantAccessKey?: number;
    }

    export interface UpdateInput extends Partial<CreateInput> {
        id: number;
        suspended?: boolean;
    }
}

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
