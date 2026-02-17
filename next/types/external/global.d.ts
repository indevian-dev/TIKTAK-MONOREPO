// ═══════════════════════════════════════════════════════════════
// GLOBAL AUGMENTATIONS
// ═══════════════════════════════════════════════════════════════

declare global {
  interface Window {
    __globalForceTokenRefresh?: () => Promise<boolean>;
  }
}

export {};

