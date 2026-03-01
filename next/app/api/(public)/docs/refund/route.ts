import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const refundPage = await module.content.getPage('REFUND');

        if (!refundPage) {
            return notFoundResponse('Refund page not found');
        }

        return okResponse({ content: refundPage });
    } catch (error) {
        log?.error('Error fetching refund page', error as Error);
        return serverErrorResponse('Failed to fetch refund page');
    }
});
