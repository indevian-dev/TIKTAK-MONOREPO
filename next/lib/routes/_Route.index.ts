// ═══════════════════════════════════════════════════════════════
// CENTRALIZED API ENDPOINT CONFIGURATION INDEX
// Organized by workspace and resource groups for better maintainability
// ═══════════════════════════════════════════════════════════════

import type { RoutesMap } from '@/lib/routes/Route.types';

import { authRoutes } from './auth/Auth.routes';
import { publicRoutes } from './public/Public.routes';
import { systemRoutes } from './system/System.routes';
import { workspacesRootRoutes } from './workspaces/WorkspaceRoot.routes';
// Provider Routes (Consolidated)
import { providerRoutes } from './workspaces/provider/Provider.routes';
import { staffRoutes } from './workspaces/staff/Staff.routes';
import { moderatorRoutes } from './workspaces/moderator/Moderator.routes';
// Custom Routes
import { customRoutes } from './custom/Custom.routes';

export {
  authRoutes,
  publicRoutes,
  systemRoutes,
  workspacesRootRoutes,
  providerRoutes,
  staffRoutes,
  moderatorRoutes,
  customRoutes,
};

// ═══════════════════════════════════════════════════════════════
// SHARED ENDPOINT FACTORIES
// Universal endpoint configuration creator for all workspaces
// ═══════════════════════════════════════════════════════════════
export {
  createRouteFactory,
  createRoute,
  type RouteConfigOptions,
} from './Route.factory';

// ═══════════════════════════════════════════════════════════════
// COMBINED ENDPOINT MAPS
// For applications that need all Routes in a single map
// ═══════════════════════════════════════════════════════════════

/**
 * All API Routes across all workspaces
 */
export const allRoutes: RoutesMap = {
  ...authRoutes,
  ...workspacesRootRoutes,
  ...providerRoutes,
  ...staffRoutes,
  ...moderatorRoutes,
  ...publicRoutes,
  ...systemRoutes,
  ...customRoutes,
};

export const getAllRoutes = () => allRoutes;
