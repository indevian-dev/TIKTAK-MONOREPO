/**
 * Phase 1: Rename Core lib/ Directories
 * 
 * Directory renames:
 *   app-core-modules  → domain
 *   app-access-control → middleware
 *   app-route-configs  → routes
 *   app-infrastructure → dissolved (contents promoted to lib/)
 * 
 * Sub-renames:
 *   domain/domain/       → domain/base/
 *   middleware/interceptors/ → middleware/handlers/
 *   middleware/responders/   → middleware/responses/
 *   app-infrastructure/database    → database (at lib level)
 *   app-infrastructure/loggers     → logging (at lib level)
 *   app-infrastructure/notificators → notifications (at lib level)
 *   app-infrastructure/api         → middleware/types (merged)
 */

const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(__dirname, '..', 'next');
const LIB_DIR = path.join(NEXT_DIR, 'lib');

// ═══════════════════════════════════════════════════════════════
// STEP 1: Define directory moves
// ═══════════════════════════════════════════════════════════════

const dirMoves = [
    // Main renames (order matters — do infrastructure dissolution first)
    { from: path.join(LIB_DIR, 'app-infrastructure', 'database'), to: path.join(LIB_DIR, 'database') },
    { from: path.join(LIB_DIR, 'app-infrastructure', 'loggers'), to: path.join(LIB_DIR, 'logging') },
    { from: path.join(LIB_DIR, 'app-infrastructure', 'notificators'), to: path.join(LIB_DIR, 'notifications') },
    { from: path.join(LIB_DIR, 'app-infrastructure', 'api'), to: path.join(LIB_DIR, '_infra_api_temp') },

    // Main directory renames
    { from: path.join(LIB_DIR, 'app-core-modules'), to: path.join(LIB_DIR, 'domain') },
    { from: path.join(LIB_DIR, 'app-access-control'), to: path.join(LIB_DIR, 'middleware') },
    { from: path.join(LIB_DIR, 'app-route-configs'), to: path.join(LIB_DIR, 'routes') },

    // Sub-renames (after main moves)
    { from: path.join(LIB_DIR, 'domain', 'domain'), to: path.join(LIB_DIR, 'domain', 'base') },
    { from: path.join(LIB_DIR, 'middleware', 'interceptors'), to: path.join(LIB_DIR, 'middleware', 'handlers') },
    { from: path.join(LIB_DIR, 'middleware', 'responders'), to: path.join(LIB_DIR, 'middleware', 'responses') },

    // Move infra API types into middleware/types
    { from: path.join(LIB_DIR, '_infra_api_temp'), to: path.join(LIB_DIR, 'middleware', 'types') },
];

// ═══════════════════════════════════════════════════════════════
// STEP 2: Define import path replacements
// ═══════════════════════════════════════════════════════════════

const importReplacements = [
    // Infrastructure dissolution — most specific first
    { from: '@/lib/app-infrastructure/database', to: '@/lib/database' },
    { from: '@/lib/app-infrastructure/loggers', to: '@/lib/logging' },
    { from: '@/lib/app-infrastructure/notificators', to: '@/lib/notifications' },
    { from: '@/lib/app-infrastructure/api', to: '@/lib/middleware/types' },
    { from: '@/lib/app-infrastructure', to: '@/lib' }, // catch-all for any remaining

    // Main directory renames
    { from: '@/lib/app-core-modules/domain/', to: '@/lib/domain/base/' },
    { from: '@/lib/app-core-modules/domain', to: '@/lib/domain/base' },
    { from: '@/lib/app-core-modules/', to: '@/lib/domain/' },
    { from: '@/lib/app-core-modules', to: '@/lib/domain' },

    { from: '@/lib/app-access-control/interceptors/', to: '@/lib/middleware/handlers/' },
    { from: '@/lib/app-access-control/interceptors', to: '@/lib/middleware/handlers' },
    { from: '@/lib/app-access-control/responders/', to: '@/lib/middleware/responses/' },
    { from: '@/lib/app-access-control/responders', to: '@/lib/middleware/responses' },
    { from: '@/lib/app-access-control/', to: '@/lib/middleware/' },
    { from: '@/lib/app-access-control', to: '@/lib/middleware' },

    { from: '@/lib/app-route-configs/', to: '@/lib/routes/' },
    { from: '@/lib/app-route-configs', to: '@/lib/routes' },
];

// ═══════════════════════════════════════════════════════════════
// STEP 3: Helper functions
// ═══════════════════════════════════════════════════════════════

function getAllFiles(dir, extensions = ['.ts', '.tsx']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
            results = results.concat(getAllFiles(fullPath, extensions));
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
            results.push(fullPath);
        }
    }
    return results;
}

function moveDir(from, to) {
    if (!fs.existsSync(from)) {
        console.log(`  ⚠️  SKIP (not found): ${from}`);
        return false;
    }
    if (fs.existsSync(to)) {
        console.log(`  ⚠️  SKIP (target exists): ${to}`);
        return false;
    }

    // Ensure parent dir exists
    const parentDir = path.dirname(to);
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.renameSync(from, to);
    console.log(`  ✅ ${path.relative(LIB_DIR, from)} → ${path.relative(LIB_DIR, to)}`);
    return true;
}

function fixImportsInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    for (const { from, to } of replacements) {
        // Match import/export statements containing the old path
        // Use string replacement — safe for non-regex special chars
        const fromEscaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(fromEscaped, 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, to);
            changes += matches.length;
        }
    }

    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        return changes;
    }
    return 0;
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: Execute
// ═══════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 1: Rename Core lib/ Directories');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// 4a: Move directories
console.log('📁 Moving directories...');
let movesCompleted = 0;
let movesFailed = 0;

for (const { from, to } of dirMoves) {
    const success = moveDir(from, to);
    if (success) movesCompleted++;
    else movesFailed++;
}

// Clean up empty app-infrastructure directory
const infraDir = path.join(LIB_DIR, 'app-infrastructure');
if (fs.existsSync(infraDir)) {
    try {
        // Check if there are remaining files
        const remaining = fs.readdirSync(infraDir);
        if (remaining.length === 0) {
            fs.rmdirSync(infraDir);
            console.log('  🗑️  Removed empty app-infrastructure/');
        } else {
            console.log(`  ⚠️  app-infrastructure/ still has: ${remaining.join(', ')}`);
            // Move remaining items
            for (const item of remaining) {
                const itemPath = path.join(infraDir, item);
                const destPath = path.join(LIB_DIR, item);
                if (!fs.existsSync(destPath)) {
                    fs.renameSync(itemPath, destPath);
                    console.log(`  ✅ Moved remaining: ${item}`);
                }
            }
            // Try removing again
            const stillRemaining = fs.readdirSync(infraDir);
            if (stillRemaining.length === 0) {
                fs.rmdirSync(infraDir);
                console.log('  🗑️  Removed empty app-infrastructure/');
            }
        }
    } catch (e) {
        console.log(`  ⚠️  Could not clean up app-infrastructure: ${e.message}`);
    }
}

console.log(`\n📊 Directory moves: ${movesCompleted} completed, ${movesFailed} skipped`);

// 4b: Fix imports
console.log('\n📝 Fixing import paths across codebase...');
const allFiles = getAllFiles(NEXT_DIR);
console.log(`   Found ${allFiles.length} .ts/.tsx files to scan`);

let filesChanged = 0;
let totalReplacements = 0;

for (const filePath of allFiles) {
    const changes = fixImportsInFile(filePath, importReplacements);
    if (changes > 0) {
        filesChanged++;
        totalReplacements += changes;
    }
}

console.log(`\n📊 Import fixes: ${totalReplacements} replacements across ${filesChanged} files`);
console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 1 COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
