/**
 * Resources - Migration Layer
 * Re-exports from modular locations to avoid breaking changes during transition
 */

// ═══════════════════════════════════════════════════════════════
// MODULE RE-EXPORTS
// ═══════════════════════════════════════════════════════════════

export * from '@/lib/domain/cards';
export * from '@/lib/domain/stores';
export * from '@/lib/domain/categories';
export * from '@/lib/domain/user';
export * from '@/lib/domain/account';
export * from '@/lib/domain/notification';
export * from '@/lib/domain/payment';
export * from '@/lib/domain/support';
export * from '@/lib/domain/content';
export * from '@/lib/domain/base';
export * from '@/lib/domain/activity';

// ═══════════════════════════════════════════════════════════════
// LEGACY ALIASES (Backward Compatibility)
// ═══════════════════════════════════════════════════════════════

export type { Card, CardSearchResponse } from '@/lib/domain/cards/cards.types';
export type { StoreProvider as Store, StoreProviderRow as StoreRow, StoreProviderInsert as StoreInsert } from '@/lib/domain/stores/stores.types';
export type { Category } from '@/lib/domain/categories/categories.types';
export type { User } from '@/lib/domain/user/user.types';
export type { Account } from '@/lib/domain/account/account.types';

// Add more as needed
