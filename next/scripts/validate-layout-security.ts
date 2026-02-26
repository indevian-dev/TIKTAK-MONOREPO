/**
 * validate-layout-security.ts
 * 
 * Pre-build validation: Ensures layout files in workspace directories
 * include necessary security wrappers (ViewInterceptor usage).
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';

const APP_DIR = join(import.meta.dirname, '..', 'app');

function findLayoutFiles(dir: string, results: string[] = []): string[] {
    if (!existsSync(dir)) return results;
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.next') continue;
            findLayoutFiles(fullPath, results);
        } else if (entry.name === 'layout.tsx' || entry.name === 'layout.ts') {
            results.push(fullPath);
        }
    }
    return results;
}

async function validate() {
    console.log('');
    console.log('🔒 Validating layout security...');
    console.log('');

    const layoutFiles = findLayoutFiles(APP_DIR);
    const warnings: string[] = [];
    let checked = 0;

    for (const filePath of layoutFiles) {
        const rel = relative(APP_DIR, filePath).replace(sep === '\\' ? /\\/g : /\//g, '/');
        checked++;

        // Only check workspace layouts — they must have auth protection
        if (!rel.includes('workspaces')) continue;

        const content = readFileSync(filePath, 'utf8');

        // Check for ViewInterceptor or auth wrapper usage
        const hasAuthProtection =
            content.includes('ViewInterceptor') ||
            content.includes('withPageAuth') ||
            content.includes('validateSession') ||
            content.includes('redirect') ||
            content.includes('getSession');

        if (!hasAuthProtection) {
            warnings.push(rel);
        }
    }

    console.log(`  Checked ${checked} layout files`);

    if (warnings.length > 0) {
        console.log('');
        console.log(`  ⚠️  ${warnings.length} workspace layouts may lack auth protection:`);
        for (const path of warnings) {
            console.log(`     - ${path}`);
        }
        console.log('');
        console.log('  Workspace layouts should use ViewInterceptor or');
        console.log('  session validation to prevent unauthorized access.');
        console.log('');
    } else {
        console.log('  ✅ All workspace layouts have security wrappers');
    }

    console.log('');
}

validate().catch(err => {
    console.error('Validation script error:', err);
});
