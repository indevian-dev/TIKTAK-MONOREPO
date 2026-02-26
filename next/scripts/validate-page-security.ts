/**
 * validate-page-security.ts
 * 
 * Pre-build validation: Ensures every page.tsx in app/[locale]/
 * (except public and auth routes) has a corresponding page route config.
 */

import { readdirSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';

const APP_DIR = join(import.meta.dirname, '..', 'app');
const LOCALE_DIR = join(APP_DIR, '[locale]');

function findPageFiles(dir: string, results: string[] = []): string[] {
    if (!existsSync(dir)) return results;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            findPageFiles(fullPath, results);
        } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
            results.push(fullPath);
        }
    }
    return results;
}

function toPagePath(filePath: string): string {
    const rel = relative(LOCALE_DIR, filePath)
        .replace(sep === '\\' ? /\\/g : /\//g, '/')
        .replace('/page.tsx', '')
        .replace('/page.ts', '');

    // Remove Next.js route groups: (public), (global), (widgets)
    const cleaned = rel
        .split('/')
        .filter(seg => !seg.startsWith('('))
        .join('/');

    return '/' + cleaned.replace(/\[([^\]]+)\]/g, ':$1');
}

async function validate() {
    console.log('');
    console.log('🔒 Validating page security configurations...');
    console.log('');

    const { allRoutes } = await import('../lib/routes/_Route.index');
    const registeredPaths = Object.keys(allRoutes);

    function pathMatchesRegistered(pagePath: string): boolean {
        if (registeredPaths.includes(pagePath)) return true;
        for (const registered of registeredPaths) {
            const regex = new RegExp(
                '^' + registered.replace(/:[^/]+/g, '[^/]+') + '$'
            );
            if (regex.test(pagePath)) return true;
        }
        return false;
    }

    const pageFiles = findPageFiles(LOCALE_DIR);
    const missing: string[] = [];
    let checked = 0;

    // Skip public/auth pages and root pages — they have their own security
    const skipPrefixes = ['/auth', '/'];

    for (const filePath of pageFiles) {
        const pagePath = toPagePath(filePath);
        checked++;

        // Skip root-level pages (homepage etc.)
        if (pagePath === '/') continue;
        // Skip auth pages
        if (pagePath.startsWith('/auth')) continue;

        if (!pathMatchesRegistered(pagePath)) {
            missing.push(pagePath);
        }
    }

    console.log(`  Checked ${checked} page routes`);

    if (missing.length > 0) {
        console.log('');
        console.log(`  ⚠️  ${missing.length} pages missing security config:`);
        for (const path of missing) {
            console.log(`     - ${path}`);
        }
        console.log('');
        console.log('  Fix: Add entries (type: "page") to the appropriate');
        console.log('  Routes file in lib/routes/');
        console.log('');
    } else {
        console.log('  ✅ All pages have security configurations');
    }

    console.log('');
}

validate().catch(err => {
    console.error('Validation script error:', err);
});
