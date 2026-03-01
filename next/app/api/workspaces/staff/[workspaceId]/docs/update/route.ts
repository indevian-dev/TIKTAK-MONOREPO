import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const PUT = unifiedApiHandler(async (req, { module, log }) => {
    try {
        const body = await req.json();

        if (!body.type) {
            return errorResponse('Page type is required');
        }

        const result = await module.content.updatePageContent(body.type, body);

        if (!result.success) {
            return serverErrorResponse(result.error || 'Failed to update page');
        }

        return okResponse({ content: result.data });
    } catch (error) {
        log?.error('Error updating page content', error as Error);
        return serverErrorResponse('Failed to update page content');
    }
});
