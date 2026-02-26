import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const faqPage = await module.content.getPage('FAQ');

        if (!faqPage) {
            return notFoundResponse('FAQ page not found');
        }

        return okResponse({ content: faqPage });
    } catch (error) {
        log?.error('Error fetching FAQ page', error as Error);
        return serverErrorResponse('Failed to fetch FAQ page');
    }
});
