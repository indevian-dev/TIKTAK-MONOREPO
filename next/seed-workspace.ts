import { db } from './lib/database';
import { sql } from 'drizzle-orm';

async function main() {
  const ACCOUNT_ID = '01KJ7KW0AZDSJD7A';
  const WORKSPACE_ID = 'SEED_STORE_001';

  // Step 3: workspace access — verify FK data first
  console.log('Checking role...');
  const role = await db.execute(sql`SELECT name FROM workspace_roles WHERE name = 'Provider Owner'`);
  console.log('Role found:', JSON.stringify((role as any[])[0]));

  console.log('Checking account...');
  const acc = await db.execute(sql`SELECT id FROM accounts WHERE id = ${ACCOUNT_ID}`);
  console.log('Account found:', JSON.stringify((acc as any[])[0]));

  console.log('Checking workspace...');
  const ws = await db.execute(sql`SELECT id FROM workspaces WHERE id = ${WORKSPACE_ID}`);
  console.log('Workspace found:', JSON.stringify((ws as any[])[0]));

  // Now insert
  console.log('\nInserting workspace_accesses...');
  try {
    await db.execute(sql`
      INSERT INTO workspace_accesses (id, actor_account_id, target_workspace_id, access_role, created_at)
      VALUES ('SEED_ACCESS_001', '01KJ7KW0AZDSJD7A', 'SEED_STORE_001', 'Provider Owner', NOW())
      ON CONFLICT (id) DO UPDATE SET access_role = EXCLUDED.access_role
    `);
    console.log('✅ Access inserted!');
  } catch (e: any) {
    console.error('❌ Insert error:');
    console.error('  message:', e.message);
    console.error('  detail:', e.detail);
    console.error('  constraint:', e.constraint_name);
    console.error('  code:', e.code);
    console.error('  table:', e.table_name);
    console.error('  column:', e.column_name);
  }

  // Step 4: update cards regardless
  console.log('\nUpdating cards...');
  await db.execute(sql`
    UPDATE cards
    SET workspace_id = ${WORKSPACE_ID}, updated_at = NOW()
    WHERE id LIKE 'SEED_CARD_%' OR id = 'FULL_TEST_CARD_001'
  `);
  const cnt = await db.execute(sql`SELECT COUNT(*) as c FROM cards WHERE workspace_id = ${WORKSPACE_ID}`);
  console.log(`✅ Cards linked: ${(cnt as any[])[0]?.c}`);

  process.exit(0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
