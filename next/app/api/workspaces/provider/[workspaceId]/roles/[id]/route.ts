import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { params, module, log }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return errorResponse('Role ID is required', 400);
    }

    const result = await module.roles.getRole(resolvedParams.id);
    if (!result.success) {
        return serverErrorResponse(result.error ?? 'Failed to fetch role');
    }
    return okResponse({ role: result.role });
});
