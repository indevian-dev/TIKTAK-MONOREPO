import { pgsqlSearchClient } from './lib/integrations/Pgsql.Neon.client';

async function main() {
    const rows = await pgsqlSearchClient`
    SELECT id, (data->>'title') as title FROM neon_search_cards 
    WHERE id LIKE 'TRIGGER_TEST_%' ORDER BY id
  `;
    console.log(`Found ${rows.length}/10 trigger test cards in Neon:\n`);
    for (const r of rows) console.log(`  ${r.id} → ${r.title}`);
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
