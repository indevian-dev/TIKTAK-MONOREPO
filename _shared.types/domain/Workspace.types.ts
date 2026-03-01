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
    // WORKSPACE TYPE
    // ═══════════════════════════════════════════════════════════════

    export type WorkspaceType = 'provider' | 'staff' | 'advertiser' | 'moderator';

    // ═══════════════════════════════════════════════════════════════
    // PROFILE JSONB SUB-TYPES (per workspace type)
    // ═══════════════════════════════════════════════════════════════

    /** Provider workspace profile — store/school/course center */
    export interface ProviderProfile {
        logo?: string | null;
        cover?: string | null;
        phone?: string | null;
        description?: string | null;
        address?: string | null;
        tags?: string[] | null;
        providerSubscriptionPrice?: number | null;
        providerTrialDaysCount?: number | null;
        providerProgramDescription?: string | null;
    }

    /** Staff workspace profile — internal admin/operations */
    export interface StaffProfile {
        department?: string | null;
        role?: string | null;
        permissions?: string[] | null;
    }

    /** Advertiser workspace profile — ad campaigns & brand presence */
    export interface AdvertiserProfile {
        companyName?: string | null;
        logo?: string | null;
        phone?: string | null;
        website?: string | null;
        description?: string | null;
    }

    /** Moderator workspace profile — content moderation */
    export interface ModeratorProfile {
        assignedRegions?: string[] | null;
        level?: string | null;
    }

    /** Student workspace profile — learner metadata */
    export interface StudentProfile {
        type?: string | null;
        gradeLevel?: string | number | null;
    }

    /** Union of all workspace profile shapes */
    export type Profile = ProviderProfile | StaffProfile | AdvertiserProfile | ModeratorProfile | StudentProfile;

    // ═══════════════════════════════════════════════════════════════
    // API OUTPUT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public: provider listing, catalog — only external-facing fields */
    export interface PublicView {
        id: string;
        title: string;
        type: string;
        profile: Profile | null;
        isStore: boolean | null;
    }

    /** Private: workspace owner/member — operational fields */
    export interface PrivateView extends PublicView {
        isActive: boolean | null;
        cityId: string | null;
        createdAt: Date | null;
    }

    /** Full: staff/admin — everything including block status */
    export interface FullView extends PrivateView {
        isBlocked: boolean | null;
        updatedAt: Date | null;
    }

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

    // ═══════════════════════════════════════════════════════════════
    // MEMBER MANAGEMENT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** A direct member of a workspace */
    export interface MemberView {
        id: string;
        accountId: string;
        accessId: string;
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        accessRole: string | null;
        subscribedUntil: string | null;
        createdAt: string | undefined;
    }

    /** A pending invitation to join a workspace */
    export interface InvitationView {
        id: string;
        invitedEmail: string;
        invitedFirstName: string;
        invitedLastName: string;
        accessRole: string | null;
        isApproved: boolean | null;
        isDeclined: boolean | null;
        expireAt: string | null;
        createdAt: string;
    }

    /** A workspace role definition */
    export interface RoleView {
        id: string;
        name: string;
        description: string | null;
        permissions: Record<string, boolean> | unknown;
        forWorkspaceType: string | null;
    }
}

