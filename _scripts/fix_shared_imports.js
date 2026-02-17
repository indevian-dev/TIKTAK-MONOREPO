const fs = require('fs');
const path = require('path');

const NEXT = path.join(__dirname, '..', 'next');

const files = [
    'app/[locale]/workspaces/staff/[workspaceId]/StaffClientLayout.tsx',
    'app/[locale]/(global)/(widgets)/layout/GlobalHeaderWidget.tsx',
    'app/[locale]/(global)/(widgets)/layout/GlobalFullNavigationWidget.tsx',
    'app/[locale]/(global)/(widgets)/layout/GlobalFastNavigationWidget.tsx',
    'app/[locale]/(global)/(widgets)/GlobalHeaderWidget.tsx',
    'app/[locale]/(global)/(widgets)/GlobalFullNavigationWidget.tsx',
    'app/[locale]/(global)/(widgets)/GlobalFastNavigationWidget.tsx',
    'app/[locale]/workspaces/provider/[workspaceId]/ProviderClientLayout.tsx',
    'app/[locale]/(public)/layout.tsx',
];

let count = 0;
files.forEach(f => {
    const p = path.join(NEXT, f);
    if (!fs.existsSync(p)) {
        console.log('SKIP:', f);
        return;
    }
    let content = fs.readFileSync(p, 'utf8');
    const updated = content
        .replace(/'@tiktak\/shared'/g, "'@tiktak/shared/types'")
        .replace(/"@tiktak\/shared"/g, '"@tiktak/shared/types"');
    if (content !== updated) {
        fs.writeFileSync(p, updated);
        count++;
        console.log('UPDATED:', f);
    }
});

console.log(`\nDone: ${count} files updated`);
