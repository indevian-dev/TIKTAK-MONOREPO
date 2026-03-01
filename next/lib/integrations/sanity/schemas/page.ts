/**
 * Sanity Schema: Page
 * 
 * For docs/static pages: About, Privacy, Terms, FAQ, Rules, Pricing, Refund
 * Each page has localized content (en/az/ru) and a page type identifier.
 * 
 * GROQ query: *[_type == "page" && pageType == "ABOUT"][0]
 */
export default {
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Internal title for this page (e.g., "About Us")',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'pageType',
            title: 'Page Type',
            type: 'string',
            description: 'Type identifier used in GROQ queries',
            options: {
                list: [
                    { title: 'About', value: 'ABOUT' },
                    { title: 'Privacy Policy', value: 'PRIVACY' },
                    { title: 'Terms of Use', value: 'TERMS' },
                    { title: 'FAQ', value: 'FAQ' },
                    { title: 'Rules', value: 'RULES' },
                    { title: 'Pricing', value: 'PRICING' },
                    { title: 'Refund Policy', value: 'REFUND' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'cover',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'localizedContent',
            title: 'Localized Content',
            type: 'object',
            fields: [
                {
                    name: 'en',
                    title: 'English',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'content', title: 'Content (HTML)', type: 'text', rows: 20 },
                    ],
                },
                {
                    name: 'az',
                    title: 'Azərbaycan',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'content', title: 'Content (HTML)', type: 'text', rows: 20 },
                    ],
                },
                {
                    name: 'ru',
                    title: 'Русский',
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Title', type: 'string' },
                        { name: 'content', title: 'Content (HTML)', type: 'text', rows: 20 },
                    ],
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'pageType',
        },
    },
};
