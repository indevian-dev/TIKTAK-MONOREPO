import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { params, module, log }) => {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return errorResponse('Store ID is required', 400);
  }

  try {
    const result = await module.workspace.getWorkspace(resolvedParams.id);
    if (!result.success) {
      return serverErrorResponse(result.error ?? 'Failed to fetch workspace');
    }
    return okResponse({ workspace: result.workspace });
  } catch (error) {
    log?.error('Error fetching workspace', error as Error);
    return serverErrorResponse('Failed to fetch workspace data');
  }
});
