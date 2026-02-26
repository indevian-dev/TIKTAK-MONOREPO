import fs from 'fs';
import { ulid } from 'ulidx';
import { categoriesData } from './data/categories-1';
import { categoriesData2 } from './data/categories-2';
import { categoriesData3 } from './data/categories-3';

// ── Slim ULID: matches project's generateSlimId() logic exactly ────────────
// Structure: TIME(10) + RANDOM(6) = 16 chars total
const slimId = (): string => {
    const full = ulid();
    return full.slice(0, 10) + full.slice(-6);
};

const allCategories = [...categoriesData, ...categoriesData2, ...categoriesData3];

const sanitizeName = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

for (const root of allCategories) {
    let sql = `BEGIN;\n\n`;

    const rootId = slimId();

    sql += `-- ==========================================\n`;
    sql += `-- ${root.title.az} / ${root.title.en} / ${root.title.ru}\n`;
    sql += `-- ==========================================\n`;
    sql += `INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('${rootId}', '${JSON.stringify(root.title).replace(/'/g, "''")}', true, NULL, false, 'normal');\n`;

    // Parent-level filters
    for (let i = 0; i < root.filters.length; i++) {
        const filter = root.filters[i];
        const filterId = slimId();
        sql += `INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('${filterId}', '${rootId}', '${JSON.stringify(filter.title).replace(/'/g, "''")}', '${filter.type}', ${i});\n`;

        if (filter.options) {
            for (let oi = 0; oi < filter.options.length; oi++) {
                const optionId = slimId();
                sql += `INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('${optionId}', '${filterId}', '${JSON.stringify(filter.options[oi].title).replace(/'/g, "''")}', ${oi});\n`;
            }
        }
    }

    // Subcategories + their filters
    for (const sub of root.subcategories) {
        const subId = slimId();
        sql += `INSERT INTO categories (id, title, is_active, parent_id, has_options, type) VALUES ('${subId}', '${JSON.stringify(sub.title).replace(/'/g, "''")}', true, '${rootId}', ${sub.filters.length > 0}, 'normal');\n`;

        for (let i = 0; i < sub.filters.length; i++) {
            const filter = sub.filters[i];
            const filterId = slimId();
            sql += `INSERT INTO category_filters (id, category_id, title, type, "order") VALUES ('${filterId}', '${subId}', '${JSON.stringify(filter.title).replace(/'/g, "''")}', '${filter.type}', ${i});\n`;

            if (filter.options) {
                for (let oi = 0; oi < filter.options.length; oi++) {
                    const optionId = slimId();
                    sql += `INSERT INTO category_filter_options (id, filter_id, title, "order") VALUES ('${optionId}', '${filterId}', '${JSON.stringify(filter.options[oi].title).replace(/'/g, "''")}', ${oi});\n`;
                }
            }
        }
    }

    sql += `\nCOMMIT;\n`;

    const fileName = `scripts/seed-${sanitizeName(root.title.az)}.sql`;
    fs.writeFileSync(fileName, sql);
    console.log(`✓ ${fileName}`);
}
