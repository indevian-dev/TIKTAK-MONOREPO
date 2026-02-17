export * from "../../types/auth/authContext";
export type { AuthContext } from "../../types/auth/authContext";
export * from "../../types/auth/session";
export * from "../../types/auth/permissions";

export interface EndpointConfig {
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
