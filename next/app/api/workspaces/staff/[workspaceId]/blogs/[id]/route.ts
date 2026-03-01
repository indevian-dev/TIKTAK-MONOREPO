import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log, params }) => {
    try {
        const blogId = params.id;
        const result = await module.blogs.getBlog(blogId);
        if (!result.success) {
            return notFoundResponse(result.error || 'Blog not found');
        }
        return okResponse({ blog: result.data });
    } catch (error) {
        log?.error('Error fetching blog', error as Error);
        return serverErrorResponse('Failed to fetch blog');
    }
});

export const DELETE = unifiedApiHandler(async (_req, { module, log, params }) => {
    try {
        const blogId = params.id;
        await module.content.contentRepo.deleteBlog(blogId);
        return okResponse({ message: 'Blog deleted successfully' });
    } catch (error) {
        log?.error('Error deleting blog', error as Error);
        return serverErrorResponse('Failed to delete blog');
    }
});
