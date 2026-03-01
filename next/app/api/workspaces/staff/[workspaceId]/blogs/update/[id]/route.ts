import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const PATCH = unifiedApiHandler(async (req, { module, log, params }) => {
    try {
        const blogId = params.id;
        const formData = await req.formData();

        const updateData: Record<string, unknown> = {};
        formData.forEach((value, key) => {
            if (key !== 'cover') {
                updateData[key] = value;
            }
        });

        await module.content.contentRepo.updateBlog(blogId, updateData);
        return okResponse({ message: 'Blog updated successfully' });
    } catch (error) {
        log?.error('Error updating blog', error as Error);
        return serverErrorResponse('Failed to update blog');
    }
});
