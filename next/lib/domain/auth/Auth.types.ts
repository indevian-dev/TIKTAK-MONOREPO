
// ═══════════════════════════════════════════════════════════════
// AUTH MODULE TYPES (Server-only)
// ═══════════════════════════════════════════════════════════════

export type UserId = string & { readonly __brand: 'UserId' };
export type AccountId = string & { readonly __brand: 'AccountId' };
