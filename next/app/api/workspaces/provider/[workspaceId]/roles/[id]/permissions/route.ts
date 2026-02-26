import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { okResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { RolePermissionsSchema } from '@tiktak/shared/types/domain/Workspace.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (request: NextRequest, { params, module, log }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return errorResponse('Role ID is required', 400);
    }
    const id = resolvedParams.id as string;

    const parsed = await validateBody(request, RolePermissionsSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { path, action } = parsed.data;

    try {
        const result = await module.roles.updateRolePermissions(id, path, action);

        if (!result.success) {
            if (result.status === 404) {
                return notFoundResponse(result.error ?? 'Role not found');
            }
            return serverErrorResponse(result.error ?? 'Failed to update permissions');
        }

        return okResponse({
            role: result.role,
            action: action === 'add' ? 'added' : 'removed',
            path,
        });
    } catch (error) {
        log?.error('Permissions update error', error as Error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return serverErrorResponse(errorMessage);
    }
});
