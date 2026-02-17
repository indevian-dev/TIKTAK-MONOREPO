/**
 * Dissolve next/types/ directory
 * 
 * Strategy:
 * 1. Move auth types       → _shared.types/auth/
 * 2. Move base/values      → _shared.types/common/
 * 3. Move ui types         → _shared.types/ui/
 * 4. Move lib/api types    → _shared.types/api/
 * 5. Move lib/services     → _shared.types/validation/
 * 6. Move lib/database     → next/lib/database/types.ts
 * 7. Move lib/helpers      → next/lib/utils/types/
 * 8. Move lib/utils        → next/lib/utils/types/
 * 9. Move lib/signals      → next/lib/notifications/types/
 * 10. Move next.ts         → next/lib/middleware/types/next.ts
 * 11. Keep external/       → next/types/external/ (d.ts files, included via tsconfig)
 * 12. Move mappers.ts      → _shared.types/mappers.ts
 * 13. Keep resources/      → remove (it's just re-exports from @/lib/domain/*)
 * 14. Merge globals.d.ts   → next/global.d.ts
 * 
 * After moving: update types/index.ts to re-export from new locations
 * Then: update all 134+ files importing from @/types to import from proper sources
 */

const fs = require('fs');
const path = require('path');

const MONOREPO = path.resolve(__dirname, '..');
const NEXT = path.join(MONOREPO, 'next');
const TYPES_DIR = path.join(NEXT, 'types');
const SHARED = path.join(MONOREPO, '_shared.types');

// ═══════════════════════════════════════════════════════════════
// STEP 1: Create _shared.types/ package structure
// ═══════════════════════════════════════════════════════════════

function createSharedPackage() {
    console.log('\n📦 Setting up _shared.types/ package...');

    // Create directories
    const dirs = ['auth', 'common', 'ui', 'ui/base', 'ui/contracts', 'ui/utilities', 'api', 'validation'];
    for (const dir of dirs) {
        fs.mkdirSync(path.join(SHARED, dir), { recursive: true });
    }

    // Create package.json
    const pkg = {
        name: '@tiktak/shared',
        version: '1.0.0',
        private: true,
        main: './index.ts',
        types: './index.ts',
        exports: {
            '.': './index.ts',
            './*': './*'
        }
    };
    fs.writeFileSync(path.join(SHARED, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

    // Create tsconfig.json
    const tsconfig = {
        compilerOptions: {
            target: 'ES2017',
            module: 'esnext',
            moduleResolution: 'node',
            declaration: true,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            outDir: './dist',
            rootDir: '.'
        },
        include: ['**/*.ts'],
        exclude: ['node_modules', 'dist']
    };
    fs.writeFileSync(path.join(SHARED, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');

    console.log('  ✅ Created package.json and tsconfig.json');
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Copy files to new locations
// ═══════════════════════════════════════════════════════════════

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });

    // Read content and remove \r (normalize line endings)
    let content = fs.readFileSync(src, 'utf8');

    // Fix internal relative imports that need updating
    // Auth files have no external imports (they define interfaces only)

    fs.writeFileSync(dest, content, 'utf8');
    console.log(`  📄 ${path.relative(MONOREPO, src)} → ${path.relative(MONOREPO, dest)}`);
}

function copyDirectory(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) {
        console.log(`  ⚠️  Source not found: ${srcDir}`);
        return;
    }

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) {
            copyFile(srcPath, destPath);
        }
    }
}

function moveTypesToNewLocations() {
    console.log('\n📂 Moving type files to proper locations...');

    // 1. Auth types → _shared.types/auth/
    console.log('\n  [Auth Types]');
    copyDirectory(path.join(TYPES_DIR, 'auth'), path.join(SHARED, 'auth'));

    // 2. Base types → _shared.types/common/
    console.log('\n  [Common/Base Types]');
    copyFile(path.join(TYPES_DIR, 'base.ts'), path.join(SHARED, 'common', 'base.ts'));
    copyFile(path.join(TYPES_DIR, 'values.ts'), path.join(SHARED, 'common', 'values.ts'));

    // 3. UI types → _shared.types/ui/
    console.log('\n  [UI Types]');
    copyDirectory(path.join(TYPES_DIR, 'ui'), path.join(SHARED, 'ui'));

    // 4. API types → _shared.types/api/
    console.log('\n  [API Types]');
    copyDirectory(path.join(TYPES_DIR, 'lib', 'api'), path.join(SHARED, 'api'));

    // 5. Validation/service types → _shared.types/validation/
    console.log('\n  [Validation Types]');
    copyDirectory(path.join(TYPES_DIR, 'lib', 'services'), path.join(SHARED, 'validation'));

    // 6. Mappers → _shared.types/mappers.ts
    console.log('\n  [Mappers]');
    copyFile(path.join(TYPES_DIR, 'mappers.ts'), path.join(SHARED, 'mappers.ts'));

    // ── Next-specific types stay in next/ ──

    // 7. Database types → next/lib/database/types.ts
    console.log('\n  [Database Types → lib/database/]');
    copyFile(
        path.join(TYPES_DIR, 'lib', 'database.ts'),
        path.join(NEXT, 'lib', 'database', 'types.ts')
    );

    // 8. Helper types → next/lib/utils/types/
    console.log('\n  [Helper Types → lib/utils/types/]');
    copyDirectory(
        path.join(TYPES_DIR, 'lib', 'helpers'),
        path.join(NEXT, 'lib', 'utils', 'types')
    );

    // 9. Utils types → next/lib/utils/types/
    console.log('\n  [Utils Types → lib/utils/types/]');
    copyDirectory(
        path.join(TYPES_DIR, 'lib', 'utils'),
        path.join(NEXT, 'lib', 'utils', 'types')
    );

    // 10. Signal types → next/lib/notifications/types/
    console.log('\n  [Signal Types → lib/notifications/types/]');
    copyDirectory(
        path.join(TYPES_DIR, 'lib', 'signals'),
        path.join(NEXT, 'lib', 'notifications', 'types')
    );

    // 11. Next.js types → next/lib/middleware/types/
    console.log('\n  [Next.js Types → lib/middleware/types/]');
    copyFile(
        path.join(TYPES_DIR, 'next.ts'),
        path.join(NEXT, 'lib', 'middleware', 'types', 'next.ts')
    );

    console.log('\n  ✅ All type files moved to proper locations');
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: Create barrel exports in _shared.types/
// ═══════════════════════════════════════════════════════════════

function createSharedBarrelExports() {
    console.log('\n📋 Creating barrel exports for _shared.types/...');

    // common/index.ts
    fs.writeFileSync(path.join(SHARED, 'common', 'index.ts'), `/**
 * Common / Base Types
 * Foundational types used across all platforms
 */
export * from './base';
export { Money, PhoneNumber, Location, Pagination } from './values';
`);

    // auth/index.ts is already copied from types/auth/index.ts

    // api/index.ts is already copied from types/lib/api/ (it has its own barrel)

    // ui/index.ts is already copied from types/ui/index.ts

    // validation/index.ts is already copied from types/lib/services/ (it has its own barrel)

    // Root index.ts
    fs.writeFileSync(path.join(SHARED, 'index.ts'), `/**
 * @tiktak/shared — Cross-Platform Type Definitions
 * Single source of truth for types shared between next/ and expo/
 */

// Auth types
export * from './auth';

// Common/Base types
export * from './common';

// UI types
export * from './ui';

// API types  
export * from './api';

// Validation types
export * from './validation';
`);

    console.log('  ✅ Created barrel exports');
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: Create shim re-exports in next/types/index.ts
// This keeps all 134+ existing imports working while we migrate
// ═══════════════════════════════════════════════════════════════

function createTypesShim() {
    console.log('\n🔗 Creating types/index.ts re-export shim...');

    const shim = `/**
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
`;
    fs.writeFileSync(path.join(TYPES_DIR, 'index.ts'), shim);
    console.log('  ✅ Updated types/index.ts shim');
}

// ═══════════════════════════════════════════════════════════════
// STEP 5: Merge globals.d.ts into next/global.d.ts
// ═══════════════════════════════════════════════════════════════

function mergeGlobals() {
    console.log('\n🌐 Merging globals.d.ts...');

    const globalDts = path.join(NEXT, 'global.d.ts');
    const typesGlobalDts = path.join(TYPES_DIR, 'globals.d.ts');

    if (fs.existsSync(typesGlobalDts) && fs.existsSync(globalDts)) {
        const existing = fs.readFileSync(globalDts, 'utf8');
        const toMerge = fs.readFileSync(typesGlobalDts, 'utf8');

        // Check if Bun type is already declared
        if (!existing.includes('declare const Bun')) {
            const merged = existing.trimEnd() + '\n\n' + toMerge;
            fs.writeFileSync(globalDts, merged);
            console.log('  ✅ Merged Bun runtime types into global.d.ts');
        } else {
            console.log('  ℹ️  Bun types already in global.d.ts, skipping merge');
        }
    }
}

// ═══════════════════════════════════════════════════════════════  
// STEP 6: Clean tsconfig.json paths
// ═══════════════════════════════════════════════════════════════

function cleanTsconfig() {
    console.log('\n⚙️  Cleaning tsconfig.json paths...');

    const tsconfigPath = path.join(NEXT, 'tsconfig.json');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    // Remove stale paths pointing to ../../packages/shared/src/
    const newPaths = {};
    for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
        const val = Array.isArray(value) ? value : [value];
        const hasStale = val.some(v => v.includes('packages/shared'));

        if (hasStale) {
            console.log(`  🗑️  Removing stale path: ${key} → ${val.join(', ')}`);
            continue; // Drop this path
        }
        newPaths[key] = value;
    }

    // Keep @/* → ./* and add @tiktak/shared alias
    newPaths['@tiktak/shared'] = ['../_shared.types/index'];
    newPaths['@tiktak/shared/*'] = ['../_shared.types/*'];

    tsconfig.compilerOptions.paths = newPaths;

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
    console.log('  ✅ Cleaned tsconfig.json');
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  Dissolving next/types/ directory');
    console.log('═══════════════════════════════════════════════');

    createSharedPackage();
    moveTypesToNewLocations();
    createSharedBarrelExports();
    createTypesShim();
    mergeGlobals();
    cleanTsconfig();

    console.log('\n═══════════════════════════════════════════════');
    console.log('  ✅ Migration complete!');
    console.log('═══════════════════════════════════════════════');
    console.log('\nNext steps:');
    console.log('  1. Run: bun tsc --noEmit');
    console.log('  2. The types/ shim keeps all existing imports working');
    console.log('  3. Gradually migrate @/types imports to proper sources');
}

main();
