/**
 * Resources - Colocated Domain Entities
 * Central export for all resource types, schemas, and mappers
 */

// ═══════════════════════════════════════════════════════════════
// SHARED TABLES (Communication, Content, Audit)
// ═══════════════════════════════════════════════════════════════

export * from './shared/sharedDb';

// ═══════════════════════════════════════════════════════════════
// ACCOUNT RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Account } from './account/account';
export * from './account/accountDb';
export * from './account/accountMapper';

// ═══════════════════════════════════════════════════════════════
// CARD RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Card, CardSearchResponse } from './card/card';
export * from './card/cardDb';
export * from './card/cardMapper';

// ═══════════════════════════════════════════════════════════════
// CATEGORY RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Category } from './category/category';
export * from './category/categoryDb';
export * from './category/categoryMapper';

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Notification } from './notification/notification';
export * from './notification/notificationDb';
export * from './notification/notificationMapper';

// ═══════════════════════════════════════════════════════════════
// ORDER RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Order } from './order/order';
export * from './order/orderDb';
export * from './order/orderMapper';

// ═══════════════════════════════════════════════════════════════
// ROLE RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { Role, Permission, PermissionCategory, StoreApplication } from './role/role';
export type { RoleRow, RoleInsert } from './role/roleDb';
export * from './role/roleMapper';

// ═══════════════════════════════════════════════════════════════
// PROVIDER RESOURCE (Personal & Store Sellers)
// ═══════════════════════════════════════════════════════════════

export * from './provider';

// ═══════════════════════════════════════════════════════════════
// STORE RESOURCE (Legacy - kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════

// Re-export store types from new provider/store location for backward compatibility
export type { StoreProvider as Store } from './provider/store/store';
export { StoreApplicationStatus } from './provider/store/store';
export type { 
  StoreProviderRow as StoreRow, 
  StoreProviderInsert as StoreInsert,
  TenantApplicationRow as StoreApplicationRow,
  TenantApplicationInsert as StoreApplicationInsert,
  StoreTagRow,
  StoreTagInsert
} from './provider/store/storeDb';
export {
  mapStoreProviderToPublic as mapStoreToPublic,
  mapStoreProviderToFull as mapStoreToFull,
  mapStoreProviderToPrivate as mapStoreToPrivate,
  mapStoreProvidersToPublic as mapStoresToPublic,
  mapStoreProvidersToFull as mapStoresToFull
} from './provider/store/storeMapper';

// ═══════════════════════════════════════════════════════════════
// USER RESOURCE
// ═══════════════════════════════════════════════════════════════

export type { User } from './user/user';
export { OtpType } from './user/user';
export * from './user/userDb';
export * from './user/userMapper';

