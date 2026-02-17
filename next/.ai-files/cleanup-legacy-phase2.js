/**
 * Legacy Cleanup Script - Phase 2
 * Handles remaining file-level cleanup:
 *  1. Delete entire directories that are pure legacy
 *  2. Delete individual route files that are pure legacy  
 *  3. Clean import references in files that have mixed content
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════
// 1. DELETE ENTIRE LEGACY API ROUTE DIRECTORIES
// ═══════════════════════════════════════════════════
const dirsToDelete = [
    // Staff categories - all routes use actionLogs heavily
    'app/api/workspaces/staff/[workspaceId]/categories',
    // Staff users - all routes use actionLogs heavily 
    'app/api/workspaces/staff/[workspaceId]/users',
    // Staff accounts
    'app/api/workspaces/staff/[workspaceId]/accounts',
    // Staff access-endpoints
    'app/api/workspaces/staff/[workspaceId]/access-endpoints',
    // Provider notifications - uses old accountsNotifications
    'app/api/workspaces/provider/[workspaceId]/notifications',
    // Provider conversations
    'app/api/workspaces/provider/[workspaceId]/conversations',
    // Coconut webhook - uses old accountsNotifications
    'app/api/webhooks/coconut',
    // Auth update-contact - uses actionLogs
    'app/api/auth/update-contact',
    // Auth accounts switch - uses actionLogs
    'app/api/auth/accounts/switch',
    // Legacy cards domain (entire directory - uses cardsPublished/stores)
    'lib/domain/cards',
];

let deletedCount = 0;
let skippedCount = 0;

for (const dir of dirsToDelete) {
    const fullPath = path.join(ROOT, dir);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ DELETED DIR: ${dir}`);
        deletedCount++;
    } else {
        console.log(`⏭️  SKIPPED (not found): ${dir}`);
        skippedCount++;
    }
}

// ═══════════════════════════════════════════════════
// 2. CLEAN UP database/types.ts if it exists
// ═══════════════════════════════════════════════════
const typesPath = path.join(ROOT, 'lib/database/types.ts');
if (fs.existsSync(typesPath)) {
    let content = fs.readFileSync(typesPath, 'utf-8');
    const original = content;

    // Remove lines referencing legacy tables
    const legacyPatterns = [
        /.*accountsRoles.*/g,
        /.*cardsPublished.*/g,
        /.*accountsNotifications.*/g,
        /.*actionLogs.*/g,
        /.*storesApplications.*/g,
        /.*tenantsProvidersTypePersonal.*/g,
        /.*tenantsProvidersTypeStore.*/g,
        /.*tenantsApplications.*/g,
        /.*storesTags.*/g,
        /.*stores.*/g,
        /.*transactions.*/g,
    ];

    for (const pattern of legacyPatterns) {
        content = content.replace(pattern, '');
    }

    // Clean up empty lines
    content = content.replace(/\n{3,}/g, '\n\n');

    if (content !== original) {
        fs.writeFileSync(typesPath, content);
        console.log(`✅ CLEANED: lib/database/types.ts`);
    }
}

console.log(`\n═══════════════════════════════════════════`);
console.log(`Directories deleted: ${deletedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`═══════════════════════════════════════════`);
