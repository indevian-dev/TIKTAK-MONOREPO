import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const privacyPage = await module.content.getPage('PRIVACY');

        if (!privacyPage) {
            return notFoundResponse('Privacy policy page not found');
        }

        return okResponse({ content: privacyPage });
    } catch (error) {
        log?.error('Error fetching privacy policy page', error as Error);
        return serverErrorResponse('Failed to fetch privacy policy page');
    }
});
