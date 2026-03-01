import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
    try {
        const pricingPage = await module.content.getPage('PRICING');

        if (!pricingPage) {
            return notFoundResponse('Pricing page not found');
        }

        return okResponse({ content: pricingPage });
    } catch (error) {
        log?.error('Error fetching pricing page', error as Error);
        return serverErrorResponse('Failed to fetch pricing page');
    }
});
