/**
 * Provider Resource - Unified Export
 * Re-exports both personal and store provider types
 */

import type { PersonalProvider } from './personal/personal';
import type { StoreProvider } from './store/store';

// ═══════════════════════════════════════════════════════════════
// PERSONAL PROVIDER
// ═══════════════════════════════════════════════════════════════

export type { PersonalProvider };
export * from './personal/personalDb';
export * from './personal/personalMapper';

// ═══════════════════════════════════════════════════════════════
// STORE PROVIDER
// ═══════════════════════════════════════════════════════════════

export type { StoreProvider };
export { StoreApplicationStatus } from './store/store';
export * from './store/storeDb';
export * from './store/storeMapper';

// ═══════════════════════════════════════════════════════════════
// UNION TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Union type for all provider types (Full entities)
 */
export type Provider = PersonalProvider.Full | StoreProvider.Full;

/**
 * Provider type discriminator
 */
export type ProviderType = 'personal' | 'store';

/**
 * Provider public access union
 */
export type ProviderPublicAccess = PersonalProvider.PublicAccess | StoreProvider.PublicAccess;

/**
 * Provider private access union
 */
export type ProviderPrivateAccess = PersonalProvider.PrivateAccess | StoreProvider.PrivateAccess;

