import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { CardUpdateSchema } from '@tiktak/shared/types/domain/Card.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const PUT = unifiedApiHandler(async (request: NextRequest, { params, module, log }) => {
    const resolvedParams = await params;
    const id = resolvedParams?.id ? parseInt(resolvedParams.id as string) : null;
    if (!id) {
        return errorResponse('Card ID is required', 400);
    }

    const parsed = await validateBody(request, CardUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    try {
        const card = await module.cards.updateCard(id, parsed.data);
        return okResponse({ operation: 'success', card });
    } catch (error) {
        log?.error('Card update error', error as Error);
        return serverErrorResponse('Failed to update card');
    }
});
