import { pgsqlClient } from './lib/integrations/Pgsql.Supabase.client';
import { pgsqlSearchClient } from './lib/integrations/Pgsql.Neon.client';

/**
 * Sync cards from Supabase to Neon search table (neon_search_cards).
 * Reads all approved cards from Supabase, then upserts into Neon's JSONB table.
 */
async function main() {
    console.log('🔄 Syncing cards from Supabase → Neon search...\n');

    // 1. Fetch all approved cards from Supabase
    const cards = await pgsqlClient`
    SELECT id, title, body, price, account_id, workspace_id, 
           images, cover, video, location,
           categories, filters_options, is_approved, created_at, updated_at
    FROM cards
    WHERE is_approved = true
    ORDER BY created_at DESC
  `;

    console.log(`  📦 Found ${cards.length} approved cards in Supabase\n`);

    if (cards.length === 0) {
        console.log('  No cards to sync.');
        process.exit(0);
    }

    // 2. Upsert each card into neon_search_cards
    let synced = 0;
    let errors = 0;

    for (const card of cards) {
        try {
            // Build the data JSONB from all card fields
            const data = {
                title: card.title,
                body: card.body,
                price: card.price,
                account_id: card.account_id,
                images: card.images,
                cover: card.cover,
                video: card.video,
                location: card.location,
                categories: card.categories,
                filters_options: card.filters_options,
                is_approved: card.is_approved,
                created_at: card.created_at,
                updated_at: card.updated_at,
            };

            await pgsqlSearchClient`
        INSERT INTO neon_search_cards (id, workspace_id, data, synced_at)
        VALUES (
          ${card.id},
          ${card.workspace_id || ''},
          ${pgsqlSearchClient.json(data)},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          workspace_id = EXCLUDED.workspace_id,
          data = EXCLUDED.data,
          synced_at = NOW()
      `;

            synced++;
            if (synced % 20 === 0) console.log(`  ✅ ${synced}/${cards.length} synced...`);
        } catch (err: any) {
            errors++;
            console.error(`  ❌ Failed card ${card.id}:`, err.message);
        }
    }

    console.log(`\n🎉 Done! Synced ${synced} cards, ${errors} errors.`);

    // 3. Verify count
    const count = await pgsqlSearchClient`SELECT COUNT(*) as c FROM neon_search_cards`;
    console.log(`📊 Total cards in neon_search_cards: ${count[0]?.c}`);

    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
