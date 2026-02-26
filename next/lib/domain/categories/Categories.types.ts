/**
 * Category Types
 * Hierarchical category system with tree structure
 */

/** Shared timestamp fields */
interface Timestamps {
    createdAt: Date;
    updatedAt?: Date | null;
}

/** JSONB shape for localized text fields */
export type LocalizedText = { az?: string; ru?: string; en?: string };

export namespace Category {
    // ═══════════════════════════════════════════════════════════════
    // FULL ENTITY (Database/Internal)
    // ═══════════════════════════════════════════════════════════════

    export interface Full extends Timestamps {
        id: string;
        title: LocalizedText;
        description?: LocalizedText;
        parentId?: string;
        icon?: string;
        hasOptions?: boolean;
        type?: string;
        isActive: boolean;
    }

    // ═══════════════════════════════════════════════════════════════
    // DOMAIN VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public access - what unauthenticated users see */
    export interface PublicAccess {
        id: string;
        title: LocalizedText;
        description?: LocalizedText;
        parentId?: string;
        icon?: string;
        isActive: boolean;
    }

    /** Private access - what authenticated users see */
    export interface PrivateAccess extends Full {
        parent?: {
            id: string;
            title: LocalizedText;
        };
        canEdit?: boolean;
        canDelete?: boolean;
    }

    /** Tree view - hierarchical structure */
    export interface Tree extends PublicAccess {
        children?: Tree[];
    }

    // ═══════════════════════════════════════════════════════════════
    // OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    export interface CreateInput {
        title: LocalizedText;
        description?: LocalizedText;
        parentId?: string;
        icon?: string;
        hasOptions?: boolean;
        type?: string;
    }

    export interface UpdateInput extends Partial<CreateInput> {
        id: string;
        isActive?: boolean;
    }

    export interface ListQuery {
        parentId?: string;
        type?: string;
        isActive?: boolean;
        search?: string;
    }
}
