import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: Bun.env.PG_CONNECTION!,
    ssl: 'require',
  },
  verbose: true,
  strict: true,
});

