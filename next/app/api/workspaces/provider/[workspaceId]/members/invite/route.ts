import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (request, { module, params, authData }) => {
    const workspaceId = params.workspaceId;
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
        return errorResponse('email and role are required');
    }

    const result = await module.workspace.inviteMember(
        workspaceId,
        authData.account.id,
        email,
        role
    );

    if (!result.success) {
        return errorResponse(result.error ?? 'Failed to invite member');
    }
    return okResponse(result.data);
});
