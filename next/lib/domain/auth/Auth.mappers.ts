
import type { UserDbRecord, AccountDbRecord, UserSessionDbRecord } from "@/lib/database/schema";
import type { Auth } from '@tiktak/shared/types/domain/Auth.views';

// ═══════════════════════════════════════════════════════════════
// AUTH MAPPERS — satisfies Auth.* from _shared.types
// ═══════════════════════════════════════════════════════════════

// ─── USER ────────────────────────────────────────────────────

export function toUserPublicView(row: UserDbRecord) {
    return {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
    } satisfies Auth.UserPublicView;
}

export function toUserPrivateView(row: UserDbRecord) {
    return {
        ...toUserPublicView(row),
        email: row.email,
        phone: row.phone,
        emailIsVerified: row.emailIsVerified,
        phoneIsVerified: row.phoneIsVerified,
        createdAt: row.createdAt,
    } satisfies Auth.UserPrivateView;
}

export function toUserFullView(row: UserDbRecord) {
    return {
        ...toUserPrivateView(row),
        fin: row.fin,
        sessionsGroupId: row.sessionsGroupId,
        twoFactorAuthEmailExpireAt: row.twoFactorAuthEmailExpireAt,
        twoFactorAuthPhoneExpireAt: row.twoFactorAuthPhoneExpireAt,
        updatedAt: row.updatedAt,
    } satisfies Auth.UserFullView;
}

// ─── ACCOUNT ─────────────────────────────────────────────────

export function toAccountPrivateView(row: AccountDbRecord) {
    return {
        id: row.id,
        userId: row.userId,
        subscribedUntil: row.subscribedUntil,
        subscriptionType: row.subscriptionType,
        createdAt: row.createdAt,
    } satisfies Auth.AccountPrivateView;
}

export function toAccountFullView(row: AccountDbRecord) {
    return {
        ...toAccountPrivateView(row),
        suspended: row.suspended,
        updatedAt: row.updatedAt,
    } satisfies Auth.AccountFullView;
}

// ─── SESSION ─────────────────────────────────────────────────

export function toSessionPrivateView(row: UserSessionDbRecord) {
    return {
        id: row.id,
        device: row.device,
        browser: row.browser,
        os: row.os,
        createdAt: row.createdAt,
        expireAt: row.expireAt,
    } satisfies Auth.SessionPrivateView;
}

export function toSessionFullView(row: UserSessionDbRecord) {
    return {
        ...toSessionPrivateView(row),
        ip: row.ip,
        metadata: row.metadata,
        accountId: row.accountId,
        sessionsGroupId: row.groupId,
    } satisfies Auth.SessionFullView;
}
