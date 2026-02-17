/**
 * TIKTAK Type System — Compatibility Shim
 * 
 * ⚠️  DEPRECATED: Do not add new imports from '@/types'.
 * Instead, import from the proper source:
 *   - '@/types/auth'            → Auth types (remains here)
 *   - '@/types/lib/database'    → '@/lib/database/types'
 *   - '@/types/lib/api'         → '@/lib/middleware/types' 
 *   - '@/types/next'            → '@/lib/middleware/types/next'
 *   - '@/types/resources'       → '@/lib/domain/<module>'
 *   - '@/types/ui'              → UI types (remains here)
 *   - '@/types/base'            → Base types (remains here)
 *   - '@/types/values'          → Value objects (remains here)
 * 
 * This file re-exports everything so existing imports keep working.
 */

// ── Auth ──
export * from './auth';

// ── Base / Common ──
export * from './base';
export { Money, PhoneNumber, Location, Pagination } from './values';

// ── UI ──
export * from './ui';

// ── Resources (re-exports from @/lib/domain/*) ──
export * from './resources';

// ── Lib (API, Services, Helpers, Utils, Database, Signals) ──
export * from './lib';

// ── Mappers ──
export * from './mappers';

// ── Next.js Types ──
export type {
  ApiHandlerOptions,
  ApiRouteHandler,
  NextPageProps,
  NextLayoutProps,
  NextErrorProps,
  NextGenerateMetadata,
  PageParams,
  SearchParams,
} from './next';

// ── Database Types (re-export for legacy) ──
export type { StoreApplicationRow } from './resources/store/storeDb';
