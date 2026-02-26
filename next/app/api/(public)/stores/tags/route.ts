import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const tags = await module.workspace.getWorkspaceTags();
    return okResponse({ tags });
  } catch (error) {
    log?.error('Error fetching store tags', error as Error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store tags';
    return serverErrorResponse(errorMessage);
  }
});

