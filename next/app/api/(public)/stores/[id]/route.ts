import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { ValidationService } from '@/lib/utils/Validator.Id.util';
import { okResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { params, module, log }) => {
  const resolvedParams = await params;

  if (!resolvedParams?.id) {
    return errorResponse('Store ID is required', 400);
  }

  const { id } = resolvedParams;

  // Validate ID parameter
  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return errorResponse('Valid ID is required', 400);
  }

  try {
    const result = await module.workspace.getWorkspace(idValidation.sanitized!);

    if (!result.workspace) {
      return notFoundResponse('Store not found');
    }

    return okResponse({ store: result.workspace });
  } catch (error) {
    log?.error('Error fetching store', error as Error);
    return serverErrorResponse('Internal Server Error');
  }
});