import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_request, { module, log }) => {
    const result = await module.roles.getAllRoles();
    if (!result.success) {
        return serverErrorResponse(result.error ?? 'Failed to fetch roles');
    }
    return okResponse({ roles: result.roles });
});
