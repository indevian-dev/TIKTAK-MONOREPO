import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (request, { module, params }) => {
    const workspaceId = params.workspaceId;
    const page = Number(new URL(request.url).searchParams.get('page') || '1');
    const limit = Number(new URL(request.url).searchParams.get('limit') || '20');

    const result = await module.workspace.listProviderMembers(workspaceId, page, limit);
    if (!result.success) {
        return serverErrorResponse(result.error ?? 'Failed to list members');
    }
    return okResponse(result.data);
});
