import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { ValidationService } from '@/lib/utils/Validator.Id.util';
import { okResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { params, module, log }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams || { id: '' };

  // Validate ID parameter
  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return errorResponse('Valid ID is required', 400);
  }

  try {
    // Card IDs are varchar strings — pass directly without Number() coercion
    const cardId = idValidation.sanitized;
    const card = await module.cards.getPublicCard(cardId);

    if (!card) {
      return notFoundResponse('Card not found');
    }

    return okResponse({
      card
    });
  } catch (error) {
    log?.error('Error fetching card', error as Error);
    return serverErrorResponse('Internal Server Error');
  }
});
