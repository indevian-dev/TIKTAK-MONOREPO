import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { module }) => {
    const result = await module.workspace.listWorkspaceRoles('provider');
    if (!result.success) {
        return serverErrorResponse(result.error ?? 'Failed to fetch roles');
    }
    return okResponse({ roles: result.data });
});
