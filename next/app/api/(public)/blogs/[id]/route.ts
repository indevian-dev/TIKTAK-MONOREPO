import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { ValidationService } from '@/lib/utils/Validator.Id.util';
import { okResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { params, module, log }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams || { id: '' };

  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return errorResponse('Valid ID is required', 400);
  }

  try {
    const blog = await module.blogs.getBlog(idValidation.sanitized);

    if (!blog) {
      return notFoundResponse('Blog not found');
    }

    return okResponse({ blog });
  } catch (error) {
    log?.error('Error fetching blog', error as Error);
    return serverErrorResponse('Internal Server Error');
  }
});
