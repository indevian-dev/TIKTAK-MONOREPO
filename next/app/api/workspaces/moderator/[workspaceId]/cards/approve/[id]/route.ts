import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const POST = unifiedApiHandler(async (_request, { params, module, log }) => {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? parseInt(resolvedParams.id as string) : null;
    if (!id) {
        return errorResponse('Card ID is required', 400);
    }

    try {
        const card = await module.cards.approveCard(id);
        return okResponse({ operation: 'success', card });
    } catch (error) {
        log?.error('Card approval error', error as Error);
        return serverErrorResponse('Failed to approve card');
    }
});
