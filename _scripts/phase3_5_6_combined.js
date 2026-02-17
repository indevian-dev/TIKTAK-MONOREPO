/**
 * Phase 3+5+6 Combined: 
 *   - Move unifiedApiHandler.ts from utils/ to middleware/handlers/
 *   - Rename *.schema.ts → *.inputs.ts in domain modules
 *   - Categorize utils/ into subdirectories
 */

const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(__dirname, '..', 'next');
const LIB_DIR = path.join(NEXT_DIR, 'lib');

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

function moveFile(from, to) {
    if (!fs.existsSync(from)) {
        console.log(`  ⚠️  SKIP (not found): ${path.basename(from)}`);
        return false;
    }
    ensureDir(path.dirname(to));
    fs.renameSync(from, to);
    console.log(`  ✅ ${path.relative(NEXT_DIR, from)} → ${path.relative(NEXT_DIR, to)}`);
    return true;
}

function fixImports(replacements) {
    const allFiles = getAllFiles(NEXT_DIR);
    let filesChanged = 0;
    let totalReplacements = 0;

    for (const filePath of allFiles) {
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
            filesChanged++;
            totalReplacements += changes;
        }
    }
    return { filesChanged, totalReplacements };
}

// ═══════════════════════════════════════════════════════════════
// PHASE 3: Move unifiedApiHandler
// ═══════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 3: Move unifiedApiHandler to middleware/handlers/');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const phase3Moves = [
    {
        from: path.join(LIB_DIR, 'utils', 'unifiedApiHandler.ts'),
        to: path.join(LIB_DIR, 'middleware', 'handlers', 'unifiedApiHandler.ts'),
    },
];

for (const { from, to } of phase3Moves) {
    moveFile(from, to);
}

const phase3Imports = [
    { from: '@/lib/utils/unifiedApiHandler', to: '@/lib/middleware/handlers/unifiedApiHandler' },
];

const p3 = fixImports(phase3Imports);
console.log(`📊 Phase 3: ${p3.totalReplacements} import fixes across ${p3.filesChanged} files`);

// ═══════════════════════════════════════════════════════════════
// PHASE 5: Rename *.schema.ts → *.inputs.ts
// ═══════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 5: Rename *.schema.ts → *.inputs.ts');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const DOMAIN_DIR = path.join(LIB_DIR, 'domain');
const phase5Renames = [];
const phase5ImportReplacements = [];

// Scan domain modules for *.schema.ts files
function findSchemaFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findSchemaFiles(fullPath);
        } else if (entry.name.endsWith('.schema.ts')) {
            const newName = entry.name.replace('.schema.ts', '.inputs.ts');
            const newPath = path.join(dir, newName);
            phase5Renames.push({ from: fullPath, to: newPath });

            // Build the import path replacement
            const relFromDomain = path.relative(DOMAIN_DIR, fullPath).replace(/\\/g, '/').replace('.ts', '');
            const relToDomain = path.relative(DOMAIN_DIR, newPath).replace(/\\/g, '/').replace('.ts', '');

            phase5ImportReplacements.push({
                from: `@/lib/domain/${relFromDomain}`,
                to: `@/lib/domain/${relToDomain}`,
            });
        }
    }
}

findSchemaFiles(DOMAIN_DIR);

let renamedCount = 0;
for (const { from, to } of phase5Renames) {
    if (moveFile(from, to)) renamedCount++;
}

if (phase5ImportReplacements.length > 0) {
    const p5 = fixImports(phase5ImportReplacements);
    console.log(`📊 Phase 5: ${renamedCount} files renamed, ${p5.totalReplacements} import fixes across ${p5.filesChanged} files`);
} else {
    console.log(`📊 Phase 5: ${renamedCount} files renamed, no import fixes needed`);
}

// ═══════════════════════════════════════════════════════════════
// PHASE 6: Categorize utils/
// ═══════════════════════════════════════════════════════════════

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASE 6: Categorize utils/ into subdirectories');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const UTILS_DIR = path.join(LIB_DIR, 'utils');

const utilsMoves = [
    // Formatting
    { file: 'caseConversionUtility.ts', dir: 'formatting' },
    { file: 'phoneFormatterUtility.ts', dir: 'formatting' },
    { file: 'timeFormatttingUtility.ts', dir: 'formatting' },
    { file: 'slugify.ts', dir: 'formatting' },

    // HTTP
    { file: 'apiCallForSpaHelper.ts', dir: 'http' },
    { file: 'apiCallForSsrHelper.ts', dir: 'http' },
    { file: 'queryHelpers.ts', dir: 'http' },

    // IDs
    { file: 'slimUlidUtility.ts', dir: 'ids' },

    // Upload
    { file: 'fileUploadHelper.ts', dir: 'upload' },
    { file: 'multipartUploadHelper.ts', dir: 'upload' },

    // Security
    { file: 'passwordUtility.ts', dir: 'security' },
    { file: 'otpHandlingUtility.ts', dir: 'security' },
    { file: 'finValidatorUtility.ts', dir: 'security' },

    // AI
    { file: 'geminiPdfProcessorUtility.ts', dir: 'ai' },
    { file: 'staffAiLabApiHelper.ts', dir: 'ai' },
    { file: 'pdfUtility.ts', dir: 'ai' },

    // Jobs
    { file: 'qstashScheduleHelper.ts', dir: 'jobs' },
    { file: 'staffJobsApiHelper.ts', dir: 'jobs' },

    // Path
    { file: 'PathNormalizerUtility.ts', dir: 'path' },
    { file: 'skopeUtility.ts', dir: 'path' },
];

const phase6ImportReplacements = [];
let utilsMoveCount = 0;

for (const { file, dir } of utilsMoves) {
    const srcPath = path.join(UTILS_DIR, file);
    if (!fs.existsSync(srcPath)) {
        console.log(`  ⚠️  SKIP (not found): ${file}`);
        continue;
    }

    const destDir = path.join(UTILS_DIR, dir);
    ensureDir(destDir);
    const destPath = path.join(destDir, file);
    fs.renameSync(srcPath, destPath);
    console.log(`  ✅ ${file} → ${dir}/`);
    utilsMoveCount++;

    // Build import replacement
    const baseName = file.replace('.ts', '');
    phase6ImportReplacements.push({
        from: `@/lib/utils/${baseName}`,
        to: `@/lib/utils/${dir}/${baseName}`,
    });
}

if (phase6ImportReplacements.length > 0) {
    const p6 = fixImports(phase6ImportReplacements);
    console.log(`\n📊 Phase 6: ${utilsMoveCount} files moved, ${p6.totalReplacements} import fixes across ${p6.filesChanged} files`);
} else {
    console.log(`\n📊 Phase 6: ${utilsMoveCount} files moved, no import fixes needed`);
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  PHASES 3+5+6 COMPLETE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
