/**
 * Sanity Studio Configuration
 * 
 * Embedded in Next.js — accessible at /studio
 * Uses NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET env vars
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './lib/integrations/sanity/schemas';

export default defineConfig({
    name: 'tiktak-studio',
    title: 'TikTak CMS',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    basePath: '/studio',
    plugins: [structureTool()],
    schema: {
        types: schemaTypes,
    },
});
