import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const rulesPage = await module.content.getPage('RULES');

    if (!rulesPage) {
      return notFoundResponse('Rules page not found');
    }

    return okResponse({ content: rulesPage });
  } catch (error) {
    log?.error('Error fetching rules', error as Error);
    return serverErrorResponse('Failed to fetch rules');
  }
});
