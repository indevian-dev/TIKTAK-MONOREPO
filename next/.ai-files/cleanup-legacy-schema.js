/**
 * Legacy Cleanup Script
 * Deletes domain directories, API route files, and other code
 * that references tables NOT in the SQL schema source of truth.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════
// 1. DELETE ENTIRE LEGACY DOMAIN DIRECTORIES
// ═══════════════════════════════════════════════════
const legacyDomainDirs = [
    'lib/domain/stores',
    'lib/domain/payment',
    'lib/domain/activity',
];

// ═══════════════════════════════════════════════════
// 2. DELETE LEGACY STAFF API ROUTES (marketplace)
// ═══════════════════════════════════════════════════
const legacyStaffApiDirs = [
    'app/api/workspaces/staff/[workspaceId]/cards',
    'app/api/workspaces/staff/[workspaceId]/stores',
    'app/api/workspaces/staff/[workspaceId]/roles',
    'app/api/workspaces/staff/[workspaceId]/pages',
    'app/api/workspaces/staff/[workspaceId]/open-search',
    'app/api/workspaces/staff/[workspaceId]/mail',
];

// ═══════════════════════════════════════════════════
// 3. DELETE LEGACY PROVIDER API ROUTES (marketplace)
// ═══════════════════════════════════════════════════
const legacyProviderApiDirs = [
    'app/api/workspaces/provider/[workspaceId]/cards',
    'app/api/workspaces/provider/[workspaceId]/favorites',
    'app/api/workspaces/provider/[workspaceId]/conversations',
];

// ═══════════════════════════════════════════════════
// 4. DELETE LEGACY WEBHOOK ROUTES
// ═══════════════════════════════════════════════════
const legacyWebhookDirs = [
    'app/api/webhooks/coconut',
];

const allDirsToDelete = [
    ...legacyDomainDirs,
    ...legacyStaffApiDirs,
    ...legacyProviderApiDirs,
    ...legacyWebhookDirs,
];

let deletedCount = 0;
let skippedCount = 0;

for (const dir of allDirsToDelete) {
    const fullPath = path.join(ROOT, dir);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ DELETED: ${dir}`);
        deletedCount++;
    } else {
        console.log(`⏭️  SKIPPED (not found): ${dir}`);
        skippedCount++;
    }
}

console.log(`\n═══════════════════════════════════════════`);
console.log(`Total deleted: ${deletedCount}`);
console.log(`Total skipped: ${skippedCount}`);
console.log(`═══════════════════════════════════════════`);
