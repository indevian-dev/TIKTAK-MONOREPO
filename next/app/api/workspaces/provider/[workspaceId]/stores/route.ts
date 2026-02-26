import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_request, { module, log }) => {
  try {
    const stores = await module.workspace.listProviders();
    return okResponse({ operation: 'success', stores });
  } catch (error) {
    log?.error('Error fetching stores', error as Error);
    return serverErrorResponse('Failed to fetch stores');
  }
});
