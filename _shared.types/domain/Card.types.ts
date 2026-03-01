/**
 * Card Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * They are NOT mirrors of DB columns. The mapper (next/lib/domain/cards/Cards.mapper.ts)
 * is the enforced bridge: CardDbRecord (from schema.ts) → Card.PublicAccess.
 *
 * Input types (what clients SEND) live in Card.schemas.ts (Zod).
 * ════════════════════════════════════════════════════════════════
 */

export namespace Card {
    // ═══════════════════════════════════════════════════════════════
    // PRIMITIVE HELPERS
    // ═══════════════════════════════════════════════════════════════

    /** Filter option stored in the card's filtersOptions JSONB column */
    export interface FilterOption {
        type: 'STATIC' | 'DYNAMIC';
        option_id?: string;
        option_group_id?: string;
        dynamic_value?: string;
    }

    // ═══════════════════════════════════════════════════════════════
    // API OUTPUT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public-facing card shape — camelCase, matches public API output */
    export interface PublicAccess {
        id: string;
        workspaceId: string;
        accountId?: string | null;
        title: string | null;
        body: string | null;
        price: number | null;
        cover: string | null;
        images: string[] | null;
        video: { url: string } | null;
        categories: string[] | null;
        filtersOptions: FilterOption[] | null;
        /** Public API uses {lat, lng} */
        location: { lat: number; lng: number } | null;
        isApproved: boolean | null;
        createdAt: Date | string | null;
        updatedAt?: Date | string | null;

        // Optional joined fields (when API performs a DB JOIN)
        workspace?: {
            id: string;
            title: string;
            logo?: string | null;
            phone?: string | null;
        } | null;
        accounts?: {
            name?: string | null;
            phone?: string | null;
        } | null;
    }

    /** Extended shape accessible to authenticated/provider users */
    export interface PrivateAccess extends PublicAccess {
        /** Internal storage prefix used for R2/S3 object paths */
        storagePrefix?: string;
        isActive?: boolean;
    }

    /**
     * Raw shape returned by the provider cards REST API.
     * Uses snake_case for fields that come from legacy SQL views.
     */
    export interface ProviderApiShape {
        id: string;
        title: string | null;
        body: string | null;
        price: number | null;
        cover: string | null;
        images?: string[];
        video?: { url: string } | null;
        location?: { latitude: number; longitude: number } | string | null;
        categories?: string[] | null;
        is_approved?: boolean | null;
        created_at: Date;
        updated_at?: Date | null;
        storage_prefix?: string;
        published_data?: { is_active?: boolean };
    }
}
