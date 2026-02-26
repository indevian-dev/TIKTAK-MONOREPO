import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const termsPage = await module.content.getPage('TERMS');

        if (!termsPage) {
            return notFoundResponse('Terms page not found');
        }

        return okResponse({ content: termsPage });
    } catch (error) {
        log?.error('Error fetching terms page', error as Error);
        return serverErrorResponse('Failed to fetch terms page');
    }
});
