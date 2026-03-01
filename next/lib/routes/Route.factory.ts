import type { RouteConfig } from '@/lib/routes/Route.types';

/**
 * Common route configuration options
 */
export interface RouteConfigOptions {
  method: string;
  authRequired: boolean;
  permission?: string;
  needEmailVerification?: boolean;
  needPhoneVerification?: boolean;
  twoFactorAuth?: boolean;
  twoFactorAuthType?: string;
  workspace?: 'moderator' | 'staff' | 'provider' | 'advertiser' | 'root' | undefined;
  type: "page" | "api";
  collectActionLogs?: boolean;
  collectLogs?: boolean;
  queryDataAuthenticated?: boolean; // 🔒 Require all query values come from authData
  checkSubscriptionStatus?: boolean; // 🔒 Require valid subscription
}

/**
 * Creates a route configuration factory for a specific workspace
 */
export const createRouteFactory = (defaults: {
  workspace: 'moderator' | 'staff' | 'provider' | 'advertiser' | 'root' | undefined;
  verifyOwnership?: boolean;
  needEmailVerification?: boolean;
  needPhoneVerification?: boolean;
}) => {
  return (config: RouteConfigOptions): RouteConfig & Record<string, any> => ({
    method: config.method,
    authRequired: config.authRequired,
    permission: config.permission,
    needEmailVerification: config.needEmailVerification ?? defaults.needEmailVerification ?? false,
    needPhoneVerification: config.needPhoneVerification ?? defaults.needPhoneVerification ?? false,
    twoFactorAuth: config.twoFactorAuth ?? false,
    twoFactorAuthType: config.twoFactorAuthType,
    workspace: config.workspace ?? defaults.workspace,
    type: config.type,
    collectActionLogs: config.collectActionLogs ?? false,
    collectLogs: config.collectLogs ?? false,
    queryDataAuthenticated: config.queryDataAuthenticated ?? false,
    checkSubscriptionStatus: config.checkSubscriptionStatus ?? false,

  });
};

/**
 * Generic route factory - create routes with custom workspace configuration
 */
export const createRoute = createRouteFactory({
  workspace: undefined,
});
