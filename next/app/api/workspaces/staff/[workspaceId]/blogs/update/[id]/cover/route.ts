import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req, { module, log, params }) => {
    try {
        const blogId = params.id;
        const formData = await req.formData();
        const coverFile = formData.get('cover');

        if (!coverFile) {
            return serverErrorResponse('No cover file provided');
        }

        // Store cover filename on the blog record
        const fileName = typeof coverFile === 'string' ? coverFile : (coverFile as File).name;
        await module.content.contentRepo.updateBlog(blogId, { cover: fileName });

        return okResponse({ blog: { id: blogId, cover: fileName } });
    } catch (error) {
        log?.error('Error updating blog cover', error as Error);
        return serverErrorResponse('Failed to update blog cover');
    }
});
