
import type { UserDbRecord, AccountDbRecord, UserSessionDbRecord } from "@/lib/database/schema";

// ═══════════════════════════════════════════════════════════════
// USER VIEWS — Public / Private / Full
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
// ACCOUNT VIEWS — Private / Full
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
// SESSION VIEWS — Private / Full
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

// ═══════════════════════════════════════════════════════════════
// MAPPERS
// ═══════════════════════════════════════════════════════════════

export function toUserPublicView(row: UserDbRecord): UserPublicView {
    return {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
    };
}

export function toUserPrivateView(row: UserDbRecord): UserPrivateView {
    return {
        ...toUserPublicView(row),
        email: row.email,
        phone: row.phone,
        emailIsVerified: row.emailIsVerified,
        phoneIsVerified: row.phoneIsVerified,
        createdAt: row.createdAt,
    };
}

export function toUserFullView(row: UserDbRecord): UserFullView {
    return {
        ...toUserPrivateView(row),
        fin: row.fin,
        sessionsGroupId: row.sessionsGroupId,
        twoFactorAuthEmailExpireAt: row.twoFactorAuthEmailExpireAt,
        twoFactorAuthPhoneExpireAt: row.twoFactorAuthPhoneExpireAt,
        updatedAt: row.updatedAt,
    };
}

export function toAccountPrivateView(row: AccountDbRecord): AccountPrivateView {
    return {
        id: row.id,
        userId: row.userId,
        subscribedUntil: row.subscribedUntil,
        subscriptionType: row.subscriptionType,
        createdAt: row.createdAt,
    };
}

export function toAccountFullView(row: AccountDbRecord): AccountFullView {
    return {
        ...toAccountPrivateView(row),
        suspended: row.suspended,
        updatedAt: row.updatedAt,
    };
}

export function toSessionPrivateView(row: UserSessionDbRecord): SessionPrivateView {
    return {
        id: row.id,
        device: row.device,
        browser: row.browser,
        os: row.os,
        createdAt: row.createdAt,
        expireAt: row.expireAt,
    };
}

export function toSessionFullView(row: UserSessionDbRecord): SessionFullView {
    return {
        ...toSessionPrivateView(row),
        ip: row.ip,
        metadata: row.metadata,
        accountId: row.accountId,
        sessionsGroupId: row.groupId,
    };
}
