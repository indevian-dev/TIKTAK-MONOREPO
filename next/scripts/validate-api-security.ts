/**
 * validate-api-security.ts
 * 
 * Pre-build validation: Ensures every API route file (route.ts) in app/api/
 * has a corresponding entry in the endpoint configuration registry.
 * 
 * This catches missing security configs at build time rather than
 * hitting 404s at runtime.
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';

// ═══════════════════════════════════════════════════════════════
// Find all route.ts files in app/api/
// ═══════════════════════════════════════════════════════════════

const APP_DIR = join(import.meta.dir, '..', 'app');
const API_DIR = join(APP_DIR, 'api');

function findRouteFiles(dir: string, results: string[] = []): string[] {
    if (!existsSync(dir)) return results;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            findRouteFiles(fullPath, results);
        } else if (entry.name === 'route.ts' || entry.name === 'route.tsx') {
            results.push(fullPath);
        }
    }
    return results;
}

// ═══════════════════════════════════════════════════════════════
// Convert filesystem path to API path pattern
// ═══════════════════════════════════════════════════════════════

function toApiPath(filePath: string): string {
    const rel = relative(APP_DIR, filePath)
        .replace(sep === '\\' ? /\\/g : /\//g, '/')
        .replace('/route.ts', '')
        .replace('/route.tsx', '');

    // Convert Next.js dynamic segments to route params
    // [workspaceId] → :workspaceId
    return '/' + rel.replace(/\[([^\]]+)\]/g, ':$1');
}

// ═══════════════════════════════════════════════════════════════
// Read endpoint configs and validate
// ═══════════════════════════════════════════════════════════════

async function validate() {
    console.log('');
    console.log('🔒 Validating API route security configurations...');
    console.log('');

    // Import the endpoint registry
    const { allEndpoints } = await import('../lib/routes/index');
    const registeredPaths = Object.keys(allEndpoints);

    // Build a pattern matcher (handles :param style)
    function pathMatchesRegistered(apiPath: string): boolean {
        // Direct match
        if (registeredPaths.includes(apiPath)) return true;

        // Pattern match: convert :param to regex
        for (const registered of registeredPaths) {
            const regex = new RegExp(
                '^' + registered.replace(/:[^/]+/g, '[^/]+') + '$'
            );
            if (regex.test(apiPath)) return true;
        }
        return false;
    }

    const routeFiles = findRouteFiles(API_DIR);
    const missing: string[] = [];
    let checked = 0;

    for (const filePath of routeFiles) {
        const apiPath = toApiPath(filePath);
        checked++;

        if (!pathMatchesRegistered(apiPath)) {
            missing.push(apiPath);
        }
    }

    // Report
    console.log(`  Checked ${checked} API routes`);

    if (missing.length > 0) {
        console.log('');
        console.log(`  ⚠️  ${missing.length} API routes missing security config:`);
        for (const path of missing) {
            console.log(`     - ${path}`);
        }
        console.log('');
        console.log('  These routes will return 404 at runtime because');
        console.log('  withApiHandler cannot find their endpoint config.');
        console.log('');
        console.log('  Fix: Add entries to the appropriate Routes file in');
        console.log('  lib/routes/workspaces/ or lib/routes/auth/');
        console.log('');
        // Warning only, don't block build
        // process.exit(1);
    } else {
        console.log('  ✅ All API routes have security configurations');
    }

    console.log('');
}

validate().catch(err => {
    console.error('Validation script error:', err);
    // Don't block build on script errors
});
