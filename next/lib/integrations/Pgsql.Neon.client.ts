import postgres from "postgres";

// ═══════════════════════════════════════════════════════════════
// PGSQL SEARCH CLIENT (SEARCH DATABASE — Neon PgSQL + pg_search)
// ═══════════════════════════════════════════════════════════════

const pgsqlSearchClient = postgres(process.env.SEARCH_DATABASE_URL!, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    types: {
        // OID 114 = json, OID 3802 = jsonb — auto-parse both as JS objects
        json: {
            to: 114,
            from: [114, 3802],
            serialize: (x: unknown) => JSON.stringify(x),
            parse: (x: string) => JSON.parse(x),
        },
    },
});

export { pgsqlSearchClient };

