/**
 * Sanity Studio Route (Next.js App Router)
 * 
 * Embeds Sanity Studio at /studio using the Next.js Sanity integration.
 * This catch-all route handles all /studio/* paths.
 */
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
    return <NextStudio config={config} />;
}
