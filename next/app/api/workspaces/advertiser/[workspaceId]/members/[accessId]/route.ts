import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';

export const PATCH = unifiedApiHandler(async (request, { module, params }) => {
    const { workspaceId, accessId } = params;
    const body = await request.json();

    const result = await module.workspace.updateMember(workspaceId, accessId, {
        role: body.role,
        subscribedUntil: body.subscribedUntil,
    });

    if (!result.success) {
        return errorResponse(result.error ?? 'Failed to update member');
    }
    return okResponse(result.data);
});
