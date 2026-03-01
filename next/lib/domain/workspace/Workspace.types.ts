
import type { Workspace } from '@tiktak/shared/types/domain/Workspace.types';

// ═══════════════════════════════════════════════════════════════
// WORKSPACE MODULE TYPES (Server-only)
// ═══════════════════════════════════════════════════════════════

// Re-export shared types for backward compatibility
export type WorkspaceProfile = Workspace.Profile;
export type WorkspaceType = Workspace.WorkspaceType;

// ═══════════════════════════════════════════════════════════════
// SERVICE INPUT TYPES (Server-only — not in shared)
// ═══════════════════════════════════════════════════════════════

export interface ProviderListOptions {
    limit?: number;
    offset?: number;
    sortField?: 'title' | 'price' | 'createdAt' | string;
    orderDir?: 'asc' | 'desc';
    search?: string;
}

export interface CreateWorkspaceDetails {
    title: string;
    type: string;
    metadata?: any;
}

export interface ProviderApplicationDetails {
    title: string;
    metadata: any;
}

export interface CreateStudentWorkspaceDetails {
    displayName: string;
    gradeLevel?: any;
    providerId: string;
}
