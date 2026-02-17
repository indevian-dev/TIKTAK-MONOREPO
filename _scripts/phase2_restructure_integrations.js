/**
 * Phase 2: Restructure Integrations
 * 
 * Groups the 16 flat integration client files into vendor-based subdirectories.
 * Also moves mail/sms notification services to lib/notifications/.
 */

const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(__dirname, '..', 'next');
const LIB_DIR = path.join(NEXT_DIR, 'lib');
const INTEGRATIONS_DIR = path.join(LIB_DIR, 'integrations');

// ═══════════════════════════════════════════════════════════════
// File moves: { from (relative to integrations), to (relative to integrations), newName (optional) }
// ═══════════════════════════════════════════════════════════════

const fileMoves = [
    // Ably
    { file: 'ablyChatClient.ts', dir: 'ably' },
    { file: 'ablyClient.ts', dir: 'ably' },

    // AWS
    { file: 'awsClient.ts', dir: 'aws' },

    // Axiom
    { file: 'axiomClient.ts', dir: 'axiom' },

    // Google
    { file: 'geminiClient.ts', dir: 'google' },

    // QStash
    { file: 'qstashClient.ts', dir: 'qstash' },

    // Supabase
    { file: 'supabasePublicRoleClient.ts', dir: 'supabase' },
    { file: 'supabaseServiceRoleClient.ts', dir: 'supabase' },

    // Upstash Redis
    { file: 'redisUpstahCacheClient.ts', dir: 'upstash', newName: 'redisCacheClient.ts' },
    { file: 'redisUpstashSessionClient.ts', dir: 'upstash', newName: 'redisSessionClient.ts' },
    { file: 'redisUpstashStoreClient.ts', dir: 'upstash', newName: 'redisStoreClient.ts' },

    // Redis re-export files  
    { file: 'cacheRedis.ts', dir: 'upstash' },
    { file: 'sessionRedis.ts', dir: 'upstash' },
    { file: 'storeRedis.ts', dir: 'upstash' },

    // Notification services → lib/notifications/
    { file: 'mailService.ts', dir: '__notifications_mail__' },
    { file: 'smsService.ts', dir: '__notifications_sms__' },
];

// ═══════════════════════════════════════════════════════════════
// Import path replacements
// ═══════════════════════════════════════════════════════════════

const importReplacements = [
    // Ably
    { from: '@/lib/integrations/ablyChatClient', to: '@/lib/integrations/ably/ablyChatClient' },
    { from: '@/lib/integrations/ablyClient', to: '@/lib/integrations/ably/ablyClient' },

    // AWS
    { from: '@/lib/integrations/awsClient', to: '@/lib/integrations/aws/awsClient' },

    // Axiom
    { from: '@/lib/integrations/axiomClient', to: '@/lib/integrations/axiom/axiomClient' },

    // Google
    { from: '@/lib/integrations/geminiClient', to: '@/lib/integrations/google/geminiClient' },

    // QStash
    { from: '@/lib/integrations/qstashClient', to: '@/lib/integrations/qstash/qstashClient' },

    // Supabase
    { from: '@/lib/integrations/supabasePublicRoleClient', to: '@/lib/integrations/supabase/supabasePublicRoleClient' },
    { from: '@/lib/integrations/supabaseServiceRoleClient', to: '@/lib/integrations/supabase/supabaseServiceRoleClient' },

    // Upstash Redis (with renames)
    { from: '@/lib/integrations/redisUpstahCacheClient', to: '@/lib/integrations/upstash/redisCacheClient' },
    { from: '@/lib/integrations/redisUpstashSessionClient', to: '@/lib/integrations/upstash/redisSessionClient' },
    { from: '@/lib/integrations/redisUpstashStoreClient', to: '@/lib/integrations/upstash/redisStoreClient' },

    // Redis re-export files
    { from: '@/lib/integrations/cacheRedis', to: '@/lib/integrations/upstash/cacheRedis' },
    { from: '@/lib/integrations/sessionRedis', to: '@/lib/integrations/upstash/sessionRedis' },
    { from: '@/lib/integrations/storeRedis', to: '@/lib/integrations/upstash/storeRedis' },

    // Notification services
    { from: '@/lib/integrations/mailService', to: '@/lib/notifications/mail/mailService' },
    { from: '@/lib/integrations/smsService', to: '@/lib/notifications/sms/smsService' },
];

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function getAllFiles(dir, extensions = ['.ts', '.tsx']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.git', '.next'].includes(entry.name)) continue;
            results = results.concat(getAllFiles(fullPath, extensions));
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
            results.push(fullPath);
        }
    }
    return results;
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function fixImportsInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    for (const { from, to } of replacements) {
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
    }
    return changes;
}

// ═══════════════════════════════════════════════════════════════
// Execute
// ═══════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 2: Restructure Integrations');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// Move files
console.log('📁 Moving integration files into vendor subdirectories...');
let moveCount = 0;

for (const { file, dir, newName } of fileMoves) {
    const srcPath = path.join(INTEGRATIONS_DIR, file);
    if (!fs.existsSync(srcPath)) {
        console.log(`  ⚠️  SKIP (not found): ${file}`);
        continue;
    }

    let destDir;
    if (dir === '__notifications_mail__') {
        destDir = path.join(LIB_DIR, 'notifications', 'mail');
    } else if (dir === '__notifications_sms__') {
        destDir = path.join(LIB_DIR, 'notifications', 'sms');
    } else {
        destDir = path.join(INTEGRATIONS_DIR, dir);
    }

    ensureDir(destDir);
    const destFile = newName || file;
    const destPath = path.join(destDir, destFile);

    fs.renameSync(srcPath, destPath);
    const label = newName ? `${file} → ${dir}/${newName}` : `${file} → ${dir}/`;
    console.log(`  ✅ ${label}`);
    moveCount++;
}

console.log(`\n📊 Files moved: ${moveCount}`);

// Fix imports
console.log('\n📝 Fixing import paths...');
const allFiles = getAllFiles(NEXT_DIR);
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
console.log('  PHASE 2 COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
