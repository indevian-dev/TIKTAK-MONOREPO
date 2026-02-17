import {
    pgTable,
    timestamp,
    boolean,
    text,
    varchar,
    jsonb,
} from 'drizzle-orm/pg-core';

/**
 * Blogs table - Blog posts/articles
 * ID: varchar (slimulid)
 */
export const blogs = pgTable('blogs', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    slug: varchar('slug'),
    isActive: boolean('is_active'),
    cover: text('cover'),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    isFeatured: boolean('is_featured'),
    createdBy: varchar('created_by'),
    localizedContent: jsonb('localized_content'),
});

/**
 * Docs table - Static CMS pages/documentation
 * ID: varchar (slimulid)
 */
export const docs = pgTable('docs', {
    id: varchar('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    type: varchar('type').unique(),
    updatedAt: timestamp('updated_at'), // timestamp without time zone
    localizedContent: jsonb('localized_content'),
});

export type BlogRow = typeof blogs.$inferSelect;
export type BlogInsert = typeof blogs.$inferInsert;
export type DocRow = typeof docs.$inferSelect;
export type DocInsert = typeof docs.$inferInsert;
