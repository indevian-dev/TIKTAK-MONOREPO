import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// ─── Environment ───
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const token = process.env.SANITY_TOKEN;

if (!projectId || !dataset) {
    throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET env vars');
}

// ─── Read Client (CDN-cached, public) ───
export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
});

// ─── Write Client (authenticated, no CDN) ───
export const sanityWriteClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
});

// ─── Image URL Builder ───
const builder = imageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource) {
    return builder.image(source);
}

// ─── Common GROQ Queries ───
export const GROQ = {
    // Pages
    pageByType: (type: string) => `*[_type == "page" && type == "${type}"][0]`,
    allPages: `*[_type == "page"]`,

    // Blogs
    allBlogs: `*[_type == "blog" && isActive == true] | order(_createdAt desc)`,
    blogBySlug: (slug: string) => `*[_type == "blog" && slug.current == "${slug}"][0]`,
    blogById: (id: string) => `*[_type == "blog" && _id == "${id}"][0]`,
    allBlogsAdmin: `*[_type == "blog"] | order(_createdAt desc)`,
} as const;
