/**
 * Role Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper bridges WorkspaceRoleDbRecord (from schema.ts) → these types.
 *
 * Input types (what clients SEND) live in Workspace.schemas.ts (Zod):
 * RoleCreateSchema, RoleUpdateSchema, RolePermissionsSchema.
 * ════════════════════════════════════════════════════════════════
 */

export namespace Role {
    // ═══════════════════════════════════════════════════════════════
    // API OUTPUT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public view — returned by the roles API (mapped from DB rows) */
    export interface PublicView {
        id: string;
        name: string;
        permissions: string[];
        forWorkspaceType: string | null;
        description: string | null
    }
}
