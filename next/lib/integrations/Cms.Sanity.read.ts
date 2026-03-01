/**
 * Client-safe Sanity read-only client.
 * Uses only NEXT_PUBLIC_* env vars — safe for browser.
 * For writes, use the server-side Cms.Sanity.client.ts instead.
 */
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// ─── Read-Only Client (CDN-cached, no token) ───
export const sanityRead = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
});

// ─── Image URL Builder ───
const builder = imageUrlBuilder(sanityRead);

export function sanityImageUrl(source: SanityImageSource) {
    return builder.image(source);
}

// ─── GROQ Queries ───
export const GROQ = {
    // Pages / Docs
    pageByType: (type: string) =>
        `*[_type == "page" && pageType == "${type}"][0]`,
    allPages: `*[_type == "page"]`,

    // Blogs
    allBlogs: `*[_type == "blog" && isActive == true] | order(_createdAt desc) {
        _id,
        title,
        slug,
        cover,
        excerpt,
        isActive,
        isFeatured,
        _createdAt,
        _updatedAt
    }`,
    allBlogsAdmin: `*[_type == "blog"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        cover,
        excerpt,
        isActive,
        isFeatured,
        _createdAt,
        _updatedAt
    }`,
    blogBySlug: (slug: string) =>
        `*[_type == "blog" && slug.current == "${slug}"][0]`,
    blogById: (id: string) =>
        `*[_type == "blog" && _id == "${id}"][0]`,
} as const;

// ─── Convenience Helpers ───

/**
 * Fetch a single page/doc by its type (ABOUT, FAQ, PRIVACY, etc.)
 * Returns the localized content for the given locale.
 */
export async function fetchPage(type: string, locale: string = 'en') {
    const page = await sanityRead.fetch(GROQ.pageByType(type.toUpperCase()));
    if (!page) return null;

    // Extract localized content
    const localized = page.localizedContent?.[locale] || page.localizedContent?.en || {};
    return {
        title: localized.title || page.title || '',
        content: localized.content || '',
        cover: page.cover ? sanityImageUrl(page.cover).url() : undefined,
    };
}

/**
 * Fetch all active blogs.
 */
export async function fetchBlogs() {
    return sanityRead.fetch(GROQ.allBlogs);
}

/**
 * Fetch all blogs (including inactive) for admin.
 */
export async function fetchBlogsAdmin() {
    return sanityRead.fetch(GROQ.allBlogsAdmin);
}

/**
 * Fetch a single blog by slug.
 */
export async function fetchBlogBySlug(slug: string) {
    return sanityRead.fetch(GROQ.blogBySlug(slug));
}

/**
 * Fetch a single blog by ID.
 */
export async function fetchBlogById(id: string) {
    return sanityRead.fetch(GROQ.blogById(id));
}
