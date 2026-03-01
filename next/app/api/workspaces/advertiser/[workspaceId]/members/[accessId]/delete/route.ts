import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';

export const DELETE = unifiedApiHandler(async (_request, { module, params }) => {
    const { workspaceId, accessId } = params;

    const result = await module.workspace.removeMember(workspaceId, accessId);
    if (!result.success) {
        return errorResponse(result.error ?? 'Failed to remove member');
    }
    return okResponse({ removed: true });
});
