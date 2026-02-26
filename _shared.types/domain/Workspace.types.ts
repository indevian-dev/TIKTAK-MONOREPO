/**
 * Workspace Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper bridges WorkspaceDbRecord (from schema.ts) → these types.
 *
 * Input types (what clients SEND) live in Workspace.schemas.ts (Zod).
 * ════════════════════════════════════════════════════════════════
 */

export namespace Workspace {
    // ═══════════════════════════════════════════════════════════════
    // APPLICATION (Provider → Staff review flow)
    // ═══════════════════════════════════════════════════════════════

    /** Application submitted by a provider to get a workspace (store) approved */
    export interface Application {
        id: string;
        contact_name: string;
        phone: string;
        email: string;
        voen: string;
        store_name: string;
        store_address: string;
        status?: 'pending' | 'approved' | 'rejected' | null;
        rejection_reason?: string | null;
        created_at: string;
        updated_at?: string | null;
    }
}
