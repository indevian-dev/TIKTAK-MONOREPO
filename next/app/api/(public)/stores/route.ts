import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import type { NextRequest } from 'next/server';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

// GET /api/(public)/stores (public)
export const GET = unifiedApiHandler(async (request: NextRequest, { module, log }) => {
  const { searchParams } = new URL(request.url);
  const hasAnyParam = Array.from(searchParams.keys()).length > 0;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = Math.min(
    parseInt(searchParams.get('pageSize') || '24', 10),
    100
  );
  const search = searchParams.get('search') || undefined;
  const sortField = searchParams.get('sort') || 'createdAt';
  const orderDir = (searchParams.get('order') || 'desc').toLowerCase() as 'asc' | 'desc';

  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  try {
    const result = await module.workspace.listProviders({
      limit,
      offset,
      sortField,
      orderDir,
      search,
    });

    // Sanitize to handle Date/JSONB non-serializable values
    const safeData = JSON.parse(JSON.stringify(result.data));

    if (hasAnyParam) {
      return okResponse({ data: safeData, total: result.total });
    }

    return okResponse(safeData);
  } catch (error) {
    log?.error('Error fetching stores', error as Error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
    return serverErrorResponse(errorMessage);
  }
});
