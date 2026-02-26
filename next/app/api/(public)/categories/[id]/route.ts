import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log, params }) => {
    try {
        const { id } = await params;

        if (!id) {
            return errorResponse('Category ID is required', 400);
        }

        const category = await module.categories.getCategoryById(id);

        if (!category) {
            return errorResponse('Category not found', 404);
        }

        return okResponse({ category });
    } catch (error) {
        log?.error('Error fetching category by ID', error as Error);
        return serverErrorResponse('Failed to fetch category');
    }
});
