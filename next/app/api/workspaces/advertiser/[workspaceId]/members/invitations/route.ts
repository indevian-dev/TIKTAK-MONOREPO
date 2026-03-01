import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { module, params }) => {
    const workspaceId = params.workspaceId;
    const result = await module.workspace.listWorkspaceInvitations(workspaceId);
    if (!result.success) {
        return serverErrorResponse(result.error ?? 'Failed to fetch invitations');
    }
    return okResponse({ invitations: result.data });
});
