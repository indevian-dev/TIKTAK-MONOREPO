// Phase 7 Fixup: Fix stale .schema barrel exports in domain index.ts files
const fs = require('fs');
const path = require('path');

const fixes = [
    { file: 'next/lib/domain/workspace/index.ts', from: "./workspace.schema", to: "./workspace.inputs" },
    { file: 'next/lib/domain/learning/index.ts', from: "./learning.schema", to: "./learning.inputs" },
    { file: 'next/lib/domain/jobs/index.ts', from: "./jobs.schema", to: "./jobs.inputs" },
    { file: 'next/lib/domain/content/index.ts', from: "./content.schema", to: "./content.inputs" },
    { file: 'next/lib/domain/auth/index.ts', from: "./auth.schema", to: "./auth.inputs" },
    { file: 'next/lib/domain/activity/index.ts', from: "./activity.schema", to: "./activity.inputs" },
];

const root = path.join(__dirname, '..');
let fixed = 0;

for (const { file, from, to } of fixes) {
    const filePath = path.join(root, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(from)) {
        content = content.replace(from, to);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed: " + file);
        fixed++;
    }
}

console.log("Total fixed: " + fixed);
