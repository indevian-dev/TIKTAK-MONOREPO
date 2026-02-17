/**
 * Permission Types
 * RBAC (Role-Based Access Control) permission definitions
 */

// ═══════════════════════════════════════════════════════════════
// PERMISSION STRINGS
// ═══════════════════════════════════════════════════════════════

export type Permission = string;

// ═══════════════════════════════════════════════════════════════
// PERMISSION CATEGORIES
// ═══════════════════════════════════════════════════════════════

export enum PermissionCategory {
  CARDS = 'cards',
  STORES = 'stores',
  ORDERS = 'orders',
  USERS = 'users',
  ACCOUNTS = 'accounts',
  CATEGORIES = 'categories',
  REPORTS = 'reports',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  SYSTEM = 'system',
  MODERATION = 'moderation',
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION ACTIONS
// ═══════════════════════════════════════════════════════════════

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  APPROVE = 'approve',
  REJECT = 'reject',
  SUSPEND = 'suspend',
  RESTORE = 'restore',
  EXPORT = 'export',
  IMPORT = 'import',
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION DEFINITION
// ═══════════════════════════════════════════════════════════════

export interface PermissionDefinition {
  id: string;
  name: string;
  description?: string;
  category: PermissionCategory;
  action: PermissionAction;
  resource: string;
  scope?: PermissionScope;
}

export type PermissionScope = 'own' | 'team' | 'organization' | 'global';

// ═══════════════════════════════════════════════════════════════
// ROLE PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export interface RolePermissions {
  roleId: number;
  roleName: string;
  permissions: Permission[];
  pagePermissions: Permission[];
  apiPermissions: Permission[];
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION CHECK
// ═══════════════════════════════════════════════════════════════

export interface CheckPermissionInput {
  userId: string;
  accountId: number;
  permission: Permission;
  resourceId?: number | string;
}

export interface CheckPermissionResult {
  hasPermission: boolean;
  reason?: string;
  requiredRole?: string;
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION GRANT/REVOKE
// ═══════════════════════════════════════════════════════════════

export interface GrantPermissionInput {
  accountId: number;
  permissions: Permission[];
}

export interface RevokePermissionInput {
  accountId: number;
  permissions: Permission[];
}

export interface PermissionChangeResult {
  success: boolean;
  affectedPermissions: Permission[];
  message?: string;
}

// ═══════════════════════════════════════════════════════════════
// PERMISSION GROUPS
// ═══════════════════════════════════════════════════════════════

export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystem: boolean;
}

// ═══════════════════════════════════════════════════════════════
// COMMON PERMISSION SETS
// ═══════════════════════════════════════════════════════════════

export const CommonPermissions = {
  // Cards
  CARDS_CREATE: 'cards.create',
  CARDS_READ: 'cards.read',
  CARDS_UPDATE: 'cards.update',
  CARDS_DELETE: 'cards.delete',
  CARDS_APPROVE: 'cards.approve',
  CARDS_SUSPEND: 'cards.suspend',

  // Stores
  STORES_CREATE: 'stores.create',
  STORES_READ: 'stores.read',
  STORES_UPDATE: 'stores.update',
  STORES_DELETE: 'stores.delete',
  STORES_APPROVE: 'stores.approve',
  STORES_SUSPEND: 'stores.suspend',

  // Orders
  ORDERS_CREATE: 'orders.create',
  ORDERS_READ: 'orders.read',
  ORDERS_UPDATE: 'orders.update',
  ORDERS_CANCEL: 'orders.cancel',
  ORDERS_REFUND: 'orders.refund',

  // Users
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_SUSPEND: 'users.suspend',

  // System
  SYSTEM_SETTINGS: 'system.settings',
  SYSTEM_LOGS: 'system.logs',
  SYSTEM_ANALYTICS: 'system.analytics',
} as const;

