// ═══════════════════════════════════════════════════════════════
// AMBIENT MODULE DECLARATIONS
// Third-party packages without built-in TypeScript definitions
// ═══════════════════════════════════════════════════════════════


declare module 'zeptomail';

/**
 * ═══════════════════════════════════════════════════════════════
 * GLOBAL TYPE DECLARATIONS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Bun Runtime Global
 * Provides access to Bun-specific APIs including environment variables
 */
declare const Bun: {
  env: Record<string, string | undefined>;
  version: string;
  serve?: (options: any) => Promise<void>;
};
