export type { AuthContext, AuthContextPayload, AuthUser, AuthAccount, AuthSession, ClientAuthData } from "@tiktak/shared/types/auth/AuthData.types";
export type { SecurityEvent, CsrfToken, RateLimitRule, RateLimitStatus } from "@tiktak/shared/types/auth/Security.types";

export interface RouteConfig {
    method: string;
    authRequired: boolean;
    permission?: string;
    needEmailVerification?: boolean;
    needPhoneVerification?: boolean;
    twoFactorAuth?: boolean;
    twoFactorAuthType?: string;
    workspace?: 'moderator' | 'staff' | 'provider' | 'root' | undefined;
    type: "page" | "api";
    collectActionLogs?: boolean;
    collectLogs?: boolean;
    queryDataAuthenticated?: boolean;
    [key: string]: any;
}
