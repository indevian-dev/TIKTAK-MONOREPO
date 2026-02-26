import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const aboutPage = await module.content.getPage('ABOUT');

        if (!aboutPage) {
            return notFoundResponse('About page not found');
        }

        return okResponse({ content: aboutPage });
    } catch (error) {
        log?.error('Error fetching about page', error as Error);
        return serverErrorResponse('Failed to fetch about page');
    }
});
