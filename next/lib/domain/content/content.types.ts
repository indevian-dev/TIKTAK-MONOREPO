
import type { Timestamps } from '../../../types/base';

// ═══════════════════════════════════════════════════════════════
// CONTENT MODULE TYPES (CMS)
// ═══════════════════════════════════════════════════════════════

export type BlogId = string & { readonly __brand: 'BlogId' };
export type DocId = string & { readonly __brand: 'DocId' };
export type PromptId = string & { readonly __brand: 'PromptId' };

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
    export interface Entity extends Timestamps {
        id: string;
        slug: string;
        isActive: boolean;
        isFeatured: boolean;
        cover?: string;
        createdBy?: string;
        localizedContent?: LocalizedContent;
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
    export interface Entity extends Timestamps {
        id: string;
        type: string;
        localizedContent?: LocalizedContent;
        updatedAt?: Date;
    }
}

// Alias for backward compatibility
export namespace Page {
    export type Entity = Doc.Entity;
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════════

export namespace Prompt {
    export interface Entity extends Timestamps {
        id: string;
        name: string;
        prompt: string;
        version: number;
        description?: string;
    }
}
