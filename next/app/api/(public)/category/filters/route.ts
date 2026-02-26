import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';
import { sql } from 'drizzle-orm';

/**
 * GET /api/category/filters?categories=id1,id2,id3
 * 
 * Returns all filters and their options for the given category IDs.
 * Response: { filters: [{ id, title, type, category_id, options: [{ id, title }] }] }
 */
export const GET = unifiedApiHandler(async (req, { db }) => {
    const url = new URL(req.url);
    const categoriesParam = url.searchParams.get('categories') || url.searchParams.get('category_id') || '';

    if (!categoriesParam.trim()) {
        return errorResponse('Missing categories parameter', 400);
    }

    const categoryIds = categoriesParam.split(',').map(id => id.trim()).filter(Boolean);

    if (categoryIds.length === 0) {
        return okResponse({ filters: [] });
    }

    // Build IN clause with individual params
    const categoryIdList = sql.join(categoryIds.map(id => sql`${id}`), sql`, `);

    // Fetch all filters for the given categories
    const filters = await db.execute(
        sql`SELECT id, category_id, title, type
        FROM category_filters
        WHERE category_id IN (${categoryIdList})
        ORDER BY created_at`
    );

    const filtersArr = filters as unknown as Array<{
        id: string;
        category_id: string;
        title: { az?: string; en?: string; ru?: string };
        type: string;
    }>;

    if (filtersArr.length === 0) {
        return okResponse({ filters: [] });
    }

    // Collect all filter IDs to fetch their options in one query
    const filterIds = filtersArr.map(f => f.id);

    const filterIdList = sql.join(filterIds.map(id => sql`${id}`), sql`, `);

    const options = await db.execute(
        sql`SELECT id, filter_id, title
        FROM category_filter_options
        WHERE filter_id IN (${filterIdList})
        ORDER BY created_at`
    );

    const optionsArr = options as unknown as Array<{
        id: string;
        filter_id: string;
        title: { az?: string; en?: string; ru?: string };
    }>;

    // Group options by filter_id
    const optionsByFilter = new Map<string, typeof optionsArr>();
    for (const opt of optionsArr) {
        const existing = optionsByFilter.get(opt.filter_id) || [];
        existing.push(opt);
        optionsByFilter.set(opt.filter_id, existing);
    }

    // Build response — filters with nested options
    const result = filtersArr.map(filter => ({
        id: filter.id,
        title: filter.title,
        type: filter.type,
        category_id: filter.category_id,
        options: (optionsByFilter.get(filter.id) || []).map(opt => ({
            id: opt.id,
            title: opt.title,
        })),
    }));

    return okResponse({ filters: result });
}, {});
