import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const PUT = unifiedApiHandler(async (req, { module, log, params }) => {
    try {
        const blogId = params.id;
        const body = await req.json();

        await module.content.contentRepo.updateBlog(blogId, {
            isActive: body.isPublished === true,
        });

        return okResponse({ message: 'Blog publish status updated' });
    } catch (error) {
        log?.error('Error updating blog publish status', error as Error);
        return serverErrorResponse('Failed to update publish status');
    }
});
