// ═══════════════════════════════════════════════════════════════
// AMBIENT MODULE DECLARATIONS
// Third-party packages without built-in TypeScript definitions
// ═══════════════════════════════════════════════════════════════

// EditorJS Plugins
declare module '@editorjs/header';
declare module '@editorjs/table';
declare module '@editorjs/link';
declare module '@editorjs/simple-image';
declare module '@editorjs/embed';
declare module '@editorjs/checklist';
declare module '@editorjs/raw';
declare module '@editorjs/list';
declare module '@editorjs/quote';
declare module '@editorjs/code';
declare module '@editorjs/delimiter';

// Mail
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
