import { pgsqlClient } from './lib/integrations/Pgsql.Supabase.client';
import { pgsqlSearchClient } from './lib/integrations/Pgsql.Neon.client';

/**
 * Insert 10 dummy cards into Supabase ONLY (no manual Neon sync).
 * Then check if the trigger auto-synced them to neon_search_cards.
 */
async function main() {
    const ACCOUNT_ID = '01KJ7KW0AZDSJD7A';
    const WORKSPACE_ID = 'SEED_STORE_001';

    const dummies = [
        { id: 'TRIGGER_TEST_001', title: 'Trigger Test - iPhone 16', price: 3199, cat: '01KHPX62GMY552A1' },
        { id: 'TRIGGER_TEST_002', title: 'Trigger Test - MacBook M4', price: 3499, cat: '01KHPX62GKETSNBZ' },
        { id: 'TRIGGER_TEST_003', title: 'Trigger Test - Tesla Model 3', price: 65000, cat: '01KHPX62GKGX3BSS' },
        { id: 'TRIGGER_TEST_004', title: 'Trigger Test - 3 otaq Bakı', price: 195000, cat: '01KHPX62GKSSWG9R' },
        { id: 'TRIGGER_TEST_005', title: 'Trigger Test - Nike Air Jordan', price: 299, cat: '01KHPX62GKV8E17W' },
        { id: 'TRIGGER_TEST_006', title: 'Trigger Test - PS5 Pro', price: 1199, cat: '01KHPX62GKETSNBZ' },
        { id: 'TRIGGER_TEST_007', title: 'Trigger Test - Samsung S25', price: 2699, cat: '01KHPX62GMY552A1' },
        { id: 'TRIGGER_TEST_008', title: 'Trigger Test - Weber Barbekü', price: 1599, cat: '01KHPX62GKV8E17W' },
        { id: 'TRIGGER_TEST_009', title: 'Trigger Test - Ev təmiri', price: 80, cat: '01KHPX62GKNYGMZE' },
        { id: 'TRIGGER_TEST_010', title: 'Trigger Test - DJI Mini 4', price: 899, cat: '01KHPX62GKETSNBZ' },
    ];

    console.log('📝 Inserting 10 dummy cards into Supabase ONLY...\n');

    for (const d of dummies) {
        await pgsqlClient.unsafe(`
      INSERT INTO cards (id, title, price, body, account_id, workspace_id, storage_prefix, 
                         images, cover, categories, is_approved, created_at, location)
      VALUES (
        $1, $2, $3, 'Test card for trigger sync verification',
        $4, $5, $7,
        '["img_01.webp","img_02.webp","img_03.webp"]'::json,
        'img_01.webp',
        $6::jsonb,
        true, NOW(),
        '{"lat":40.4093,"lng":49.8671}'::json
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, price = EXCLUDED.price, is_approved = true, updated_at = NOW()
    `, [d.id, d.title, d.price, ACCOUNT_ID, WORKSPACE_ID, JSON.stringify([d.cat]), `trigger_test_${d.id.toLowerCase()}`]);
        console.log(`  ✅ ${d.id} → ${d.title}`);
    }

    console.log('\n⏳ Waiting 3 seconds for trigger to fire...\n');
    await new Promise(r => setTimeout(r, 3000));

    // Check Neon
    const neonCount = await pgsqlSearchClient`
    SELECT COUNT(*) as c FROM neon_search_cards WHERE id LIKE 'TRIGGER_TEST_%'
  `;
    const synced = parseInt(neonCount[0]?.c || '0');

    if (synced === 10) {
        console.log(`🎉 SUCCESS! All 10 trigger test cards found in Neon! (${synced}/10)`);
    } else if (synced > 0) {
        console.log(`⚠️  Partial sync: ${synced}/10 cards found in Neon.`);
    } else {
        console.log(`❌ No trigger test cards found in Neon. Trigger may not be working.`);
    }

    // Show what's in Neon for these IDs
    const rows = await pgsqlSearchClient`
    SELECT id, (data->>'title') as title FROM neon_search_cards WHERE id LIKE 'TRIGGER_TEST_%' ORDER BY id
  `;
    for (const r of rows) {
        console.log(`  📦 ${r.id} → ${r.title}`);
    }

    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
