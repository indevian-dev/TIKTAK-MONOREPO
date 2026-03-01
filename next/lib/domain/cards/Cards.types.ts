/**
 * Cards Domain Types
 * All camelCase — snake_case lives only in the DB layer.
 */

export namespace Card {
    // ═══════════════════════════════════════════════════════════════
    // VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public-facing card shape returned by all public APIs */
    export interface PublicAccess {
        id: string;
        workspaceId: string;
        title: string | null;
        body: string | null;
        price: number | null;
        cover: string | null;
        images: string[] | null;
        video: { url: string } | null;
        location: { lat: number; lng: number } | null;
        categories: string[] | null;
        filtersOptions: FilterOption[] | null;
        accountId: string | null;
        isApproved: boolean;
        createdAt: Date;
        updatedAt?: Date | null;
    }

    export interface FilterOption {
        type: string;
        option_id: string;
        option_group_id: string;
    }

    // ═══════════════════════════════════════════════════════════════
    // SEARCH
    // ═══════════════════════════════════════════════════════════════

    /** Parameters accepted by the search endpoint */
    export interface SearchQuery {
        categoryIds?: string;    // comma-separated
        searchText?: string;
        priceMin?: number;
        priceMax?: number;
        workspaceId?: string;
        pagination?: number;
    }

    /** Shape of a raw row from the neon_search_cards table */
    export interface NeonSearchRow {
        id: string;
        workspace_id: string;
        data: Record<string, unknown>;
        synced_at: string;
    }

    /** Result returned by searchCards */
    export interface SearchResult {
        cards: PublicAccess[];
        total: number;
    }
}
