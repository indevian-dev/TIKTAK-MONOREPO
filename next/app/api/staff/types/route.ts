import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse } from '@/lib/middleware/Response.Api.middleware';

/**
 * GET /api/staff/types
 * Returns supported category types.
 * The legacy 'types' table no longer exists; types are now an enum
 * defined at the application level (standard | digital).
 */
export const GET = unifiedApiHandler(async () => {
    const types = [
        { id: 1, title: 'standard' },
        { id: 2, title: 'digital' },
    ];

    return okResponse({ types });
});
