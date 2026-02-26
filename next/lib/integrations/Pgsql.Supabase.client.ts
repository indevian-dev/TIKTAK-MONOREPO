import postgres from "postgres";

// ═══════════════════════════════════════════════════════════════
// PGSQL CLIENT (DATABASE — Supabase PgSQL)
// ═══════════════════════════════════════════════════════════════

const pgsqlClient = postgres(process.env.DATABASE_URL!, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // Required for Supabase connection pooler (transaction mode)
    ssl: 'require', // Required by Supabase pooler
});

export { pgsqlClient };
