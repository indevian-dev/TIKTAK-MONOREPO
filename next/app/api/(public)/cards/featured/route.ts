import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const cards = await module.cards.getFeaturedCards();
    return okResponse({ cards });
  } catch (error) {
    log?.error('Error fetching homepage cards', error as Error);
    return serverErrorResponse('Failed to fetch homepage cards');
  }
});
