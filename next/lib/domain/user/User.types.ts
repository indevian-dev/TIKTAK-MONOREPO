/**
 * User Types
 * User entity with domain-specific views
 */

import type { Timestamps } from '../base/Base.types';

export namespace User {
    // ═══════════════════════════════════════════════════════════════
    // FULL ENTITY (Database/Internal)
    // ═══════════════════════════════════════════════════════════════

    export interface Full extends Timestamps {
        id: string;
        email: string;
        name?: string;
        phone?: string;
        avatar?: string;
        emailIsVerified: boolean;
        phoneIsVerified: boolean;
        status: Status;
        lastLoginAt?: string;
    }

    // ═══════════════════════════════════════════════════════════════
    // DOMAIN VIEWS
    // ═══════════════════════════════════════════════════════════════

    /** Public access - minimal safe fields */
    export interface PublicAccess {
        id: string;
        name?: string;
        avatar?: string;
        isVerified: boolean;
        memberSince: string;
    }

    /** Private access - user's own data */
    export interface PrivateAccess extends Pick<Full,
        | 'id' | 'email' | 'name' | 'phone' | 'avatar'
        | 'emailIsVerified' | 'phoneIsVerified' | 'status'
        | 'lastLoginAt' | 'createdAt'
    > {
        accounts: ProfileAccount[];
        preferences?: UserPreferences;
        canEdit: boolean;
        canDelete: boolean;
    }

    // ═══════════════════════════════════════════════════════════════
    // SUB-TYPES
    // ═══════════════════════════════════════════════════════════════

    export interface ProfileAccount {
        id: number;
        name: string;
        type: string;
        role: string;
        isActive: boolean;
    }

    export interface AdminAccount extends ProfileAccount {
        createdAt: string;
        lastAccessedAt?: string;
        suspended?: boolean;
    }

    export interface LoginRecord {
        timestamp: string;
        ipAddress: string;
        userAgent: string;
        success: boolean;
    }

    export interface UserPreferences {
        language: string;
        currency: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    }

    export type Status = 'active' | 'suspended' | 'pending' | 'deleted';

    // ═══════════════════════════════════════════════════════════════
    // OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    export interface UpdateProfileInput {
        name?: string;
        phone?: string;
        avatar?: string;
    }

    export interface UpdatePreferencesInput {
        language?: string;
        currency?: string;
        notifications?: {
            email?: boolean;
            sms?: boolean;
            push?: boolean;
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// DATABASE ENUMS
// ═══════════════════════════════════════════════════════════════

export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PHONE_VERIFICATION = 'phone_verification',
    TWO_FACTOR_EMAIL = '2fa_email',
    TWO_FACTOR_PHONE = '2fa_phone',
    PASSWORD_RESET = 'password_reset'
}
