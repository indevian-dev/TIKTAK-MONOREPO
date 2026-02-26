import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { WorkspaceUpdateSchema } from '@tiktak/shared/types/domain/Workspace.schemas';

import { validateBody } from '@/lib/utils/Zod.validate.util';

export const PUT = unifiedApiHandler(async (req, { params, module, auth }) => {
  try {
    if (!auth || !auth.accountId) {
      return errorResponse('Unauthorized', 401);
    }

    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return errorResponse('Store ID is required', 400);
    }

    const parsed = await validateBody(req, WorkspaceUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const result = await module.workspace.updateProviderProfile(resolvedParams.id, parsed.data);

    if (!result.success) {
      return errorResponse(result.error ?? 'Failed to update store', 400);
    }

    return okResponse(result.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return serverErrorResponse(errorMessage || 'Failed to update store');
  }
});

