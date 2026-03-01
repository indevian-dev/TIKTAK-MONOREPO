/**
 * Auth View Types — Shared API Contract
 * ════════════════════════════════════════════════════════════════
 * These are the OUTPUT types — the shape of data the API *returns* to clients.
 * The mapper bridges UserDbRecord/AccountDbRecord/UserSessionDbRecord → these views.
 * ════════════════════════════════════════════════════════════════
 */

export namespace Auth {
    // ═══════════════════════════════════════════════════════════════
    // USER VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public: other users see — display name only */
    export interface UserPublicView {
        id: string;
        firstName: string | null;
        lastName: string | null;
    }

    /** Private: user sees their own profile */
    export interface UserPrivateView extends UserPublicView {
        email: string;
        phone: string | null;
        emailIsVerified: boolean | null;
        phoneIsVerified: boolean | null;
        createdAt: Date | null;
    }

    /** Full: staff/admin — everything including FIN, sessions, 2FA timestamps */
    export interface UserFullView extends UserPrivateView {
        fin: string | null;
        sessionsGroupId: string | null;
        twoFactorAuthEmailExpireAt: string | null;
        twoFactorAuthPhoneExpireAt: string | null;
        updatedAt: Date | null;
    }

    // ═══════════════════════════════════════════════════════════════
    // ACCOUNT VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Private: account holder sees their own account */
    export interface AccountPrivateView {
        id: string;
        userId: string | null;
        subscribedUntil: Date | null;
        subscriptionType: string | null;
        createdAt: Date;
    }

    /** Full: staff/admin — entire account record */
    export interface AccountFullView extends AccountPrivateView {
        suspended: boolean | null;
        updatedAt: Date | null;
    }

    // ═══════════════════════════════════════════════════════════════
    // SESSION VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Private: user sees their active sessions */
    export interface SessionPrivateView {
        id: string;
        device: string | null;
        browser: string | null;
        os: string | null;
        createdAt: Date;
        expireAt: Date | null;
    }

    /** Full: staff — includes IP, metadata */
    export interface SessionFullView extends SessionPrivateView {
        ip: string | null;
        metadata: unknown;
        accountId: string | null;
        sessionsGroupId: string | null;
    }
}
