/**
 * Sanity Schema: Blog
 * 
 * For blog posts managed by staff.
 * 
 * GROQ query: *[_type == "blog" && isActive == true] | order(_createdAt desc)
 */
export default {
    name: 'blog',
    title: 'Blog',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 200,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            description: 'Short description shown in blog lists',
        },
        {
            name: 'cover',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'content',
            title: 'Content (HTML)',
            type: 'text',
            rows: 30,
            description: 'Blog content in HTML format',
        },
        {
            name: 'isActive',
            title: 'Published',
            type: 'boolean',
            initialValue: false,
            description: 'Set to true to show on the public blog listing',
        },
        {
            name: 'isFeatured',
            title: 'Featured on Homepage',
            type: 'boolean',
            initialValue: false,
            description: 'Show this blog on the homepage',
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'cover',
            isActive: 'isActive',
        },
        prepare({ title, media, isActive }: Record<string, any>) {
            return {
                title,
                media,
                subtitle: isActive ? '✅ Published' : '⏸ Draft',
            };
        },
    },
};
