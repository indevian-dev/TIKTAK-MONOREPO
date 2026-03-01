import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (req, { module, log }) => {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        if (!type) {
            return serverErrorResponse('Page type is required');
        }

        const result = await module.content.getPage(type);
        return okResponse({ content: result });
    } catch (error) {
        log?.error('Error fetching page content', error as Error);
        return serverErrorResponse('Failed to fetch page content');
    }
});
