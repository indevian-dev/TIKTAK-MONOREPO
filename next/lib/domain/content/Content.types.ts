
import type { Timestamps } from '../base/Base.types';

// ═══════════════════════════════════════════════════════════════
// CONTENT MODULE TYPES (CMS)
// ═══════════════════════════════════════════════════════════════

export type BlogId = string & { readonly __brand: 'BlogId' };
export type DocId = string & { readonly __brand: 'DocId' };


export interface LocalizedContent {
    az?: {
        title?: string;
        content?: string;
        metaTitle?: string;
        metaDescription?: string;
    };
    ru?: {
        title?: string;
        content?: string;
        metaTitle?: string;
        metaDescription?: string;
    };
    en?: {
        title?: string;
        content?: string;
        metaTitle?: string;
        metaDescription?: string;
    };
}

// ═══════════════════════════════════════════════════════════════
// BLOGS
// ═══════════════════════════════════════════════════════════════

export namespace Blog {
    export interface Entity {
        id: string;
        slug: string;
        isActive: boolean;
        isFeatured: boolean;
        cover?: string;
        createdBy?: string;
        localizedContent?: LocalizedContent;
        createdAt: Date;
        updatedAt?: Date;
    }

    export interface CreateInput {
        id: string;
        slug: string;
        isActive?: boolean;
        isFeatured?: boolean;
        cover?: string;
        localizedContent?: LocalizedContent;
    }
}

// ═══════════════════════════════════════════════════════════════
// DOCS (Formerly PAGES)
// ═══════════════════════════════════════════════════════════════

export namespace Doc {
    export interface Entity {
        id: string;
        type: string;
        localizedContent?: LocalizedContent;
        createdAt: Date;
        updatedAt?: Date;
    }
}

// Alias for backward compatibility
export namespace Page {
    export type Entity = Doc.Entity;
}


