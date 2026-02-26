
import { eq, desc, and, ilike, or, count, sql } from "drizzle-orm";
import { blogs, docs } from "@/lib/database/schema";
import { BaseRepository } from "../base/Base.repository";
import { type DbClientTypes } from "@/lib/database";

/**
 * ContentRepository - Handles CMS data (blogs, pages/docs)
 */
export class ContentRepository extends BaseRepository {
    // ═══════════════════════════════════════════════════════════════
    // BLOGS
    // ═══════════════════════════════════════════════════════════════

    async findBlogById(id: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.select().from(blogs).where(eq(blogs.id, id)).limit(1);
        return result[0] || null;
    }

    async findBlogBySlug(slug: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
        return result[0] || null;
    }

    async listBlogs(params: {
        onlyActive?: boolean;
        limit?: number;
        offset?: number;
        search?: string;
    }, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const { onlyActive = true, limit = 10, offset = 0, search } = params;

        let whereClause = onlyActive ? eq(blogs.isActive, true) : undefined;
        if (search) {
            // Search within localizedContent jsonb
            const searchFilter = sql`(${blogs.localizedContent}->'az'->>'title' ILIKE ${`%${search}%`} OR 
                                     ${blogs.localizedContent}->'en'->>'title' ILIKE ${`%${search}%`} OR
                                     ${blogs.localizedContent}->'ru'->>'title' ILIKE ${`%${search}%`})`;
            whereClause = whereClause ? and(whereClause, searchFilter) : searchFilter;
        }

        const data = await client
            .select()
            .from(blogs)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy(desc(blogs.createdAt));

        const countResult = await client
            .select({ val: count() })
            .from(blogs)
            .where(whereClause);

        return { data, total: Number(countResult[0]?.val || 0) };
    }

    async createBlog(data: typeof blogs.$inferInsert, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.insert(blogs).values(data).returning();
        return result[0];
    }

    async updateBlog(id: string, data: Partial<typeof blogs.$inferInsert>, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client
            .update(blogs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(blogs.id, id))
            .returning();
        return result[0];
    }

    async deleteBlog(id: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.delete(blogs).where(eq(blogs.id, id)).returning();
        return result[0];
    }

    // ═══════════════════════════════════════════════════════════════
    // DOCS (Formerly PAGES)
    // ═══════════════════════════════════════════════════════════════

    async findDocByType(type: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.select().from(docs).where(eq(docs.type, type)).limit(1);
        return result[0] || null;
    }

    async findDocById(id: string, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        const result = await client.select().from(docs).where(eq(docs.id, id)).limit(1);
        return result[0] || null;
    }

    async updateDoc(id: string, data: Partial<typeof docs.$inferInsert>, tx?: DbClientTypes) {
        const client = tx ?? this.db;
        return await client
            .update(docs)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(docs.id, id))
            .returning();
    }

    // Alias for backward compatibility
    async findPageByType(type: string, tx?: DbClientTypes) {
        return this.findDocByType(type, tx);
    }

    async findPageById(id: string, tx?: DbClientTypes) {
        return this.findDocById(id, tx);
    }

    async updatePage(id: string, data: any, tx?: DbClientTypes) {
        return this.updateDoc(id, data, tx);
    }

}
