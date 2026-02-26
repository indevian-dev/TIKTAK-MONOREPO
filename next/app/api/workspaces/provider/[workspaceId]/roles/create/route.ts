import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { createdResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { RoleCreateSchema } from '@tiktak/shared/types/domain/Workspace.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (request: NextRequest, { module, log }) => {
  try {
    const parsed = await validateBody(request, RoleCreateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { name, permissions } = parsed.data;

    const result = await module.roles.createRole({ name, permissions: permissions || [] });

    if (!result.success) {
      return serverErrorResponse(result.error ?? 'Failed to create role');
    }

    return createdResponse({ role: result.role });
  } catch (error) {
    log?.error('Create role error', error as Error);
    return serverErrorResponse('Internal server error');
  }
});
