import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req, { module, log }) => {
    try {
        const body = await req.json();
        if (!body.title) {
            return errorResponse('Title is required');
        }
        const result = await module.blogs.createBlog(body);
        if (!result.success) {
            return serverErrorResponse(result.error || 'Failed to create blog');
        }
        return okResponse({ blog: result.data });
    } catch (error) {
        log?.error('Error creating blog', error as Error);
        return serverErrorResponse('Failed to create blog');
    }
});
