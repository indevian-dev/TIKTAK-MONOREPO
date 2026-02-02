/**
 * Category Types
 * Hierarchical category system with tree structure
 */

import type { Timestamps } from '@/types/base';

export namespace Category {
  // ═══════════════════════════════════════════════════════════════
  // FULL ENTITY (Database/Internal)
  // ═══════════════════════════════════════════════════════════════
  
  export interface Full extends Timestamps {
    id: number;
    title: string;
    titleRu?: string;
    titleEn?: string;
    description?: string;
    descriptionRu?: string;
    descriptionEn?: string;
    parentId?: number;
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
    id: number;
    title: string;
    titleRu?: string;
    titleEn?: string;
    description?: string;
    descriptionRu?: string;
    descriptionEn?: string;
    parentId?: number;
    icon?: string;
    isActive: boolean;
  }

  /** Private access - what authenticated users see */
  export interface PrivateAccess extends Full {
    parent?: {
      id: number;
      title: string;
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
    title: string;
    titleRu?: string;
    titleEn?: string;
    description?: string;
    descriptionRu?: string;
    descriptionEn?: string;
    parentId?: number;
    icon?: string;
    hasOptions?: boolean;
    type?: string;
  }

  export interface UpdateInput extends Partial<CreateInput> {
    id: number;
    isActive?: boolean;
  }

  export interface ListQuery {
    parentId?: number;
    type?: string;
    isActive?: boolean;
    search?: string;
  }
}

