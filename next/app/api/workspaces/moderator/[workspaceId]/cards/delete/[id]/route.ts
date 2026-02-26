import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const DELETE = unifiedApiHandler(async (_request, { params, module, log }) => {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? parseInt(resolvedParams.id as string) : null;
    if (!id) {
        return errorResponse('Card ID is required', 400);
    }

    try {
        const deletedCard = await module.cards.deleteCard(id);
        return okResponse({ operation: 'success', card: deletedCard });
    } catch (error) {
        log?.error('Card delete error', error as Error);
        return serverErrorResponse('Failed to delete card');
    }
});
