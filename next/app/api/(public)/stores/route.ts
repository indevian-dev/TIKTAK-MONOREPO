import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { UnifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

// GET /api/stores (public)
export const GET = unifiedApiHandler(async (request: NextRequest, { module, log }) => {
  const { searchParams } = new URL(request.url);
  const hasAnyParam = Array.from(searchParams.keys()).length > 0;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = Math.min(
    parseInt(searchParams.get('pageSize') || '24', 10),
    100
  );

  const tagIdsParam = searchParams.get('tagIds') || '';
  const tagIds = tagIdsParam
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => parseInt(v, 10))
    .filter((v) => !Number.isNaN(v));

  const sortBy = searchParams.get('sort') || 'created_at';
  const sortOrder = (searchParams.get('order') || 'desc').toLowerCase() as 'asc' | 'desc';

  try {
    const result = await module.stores.listPublicStores({
      page,
      pageSize,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      sortBy,
      sortOrder
    });

    if (hasAnyParam) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result.stores);
  } catch (error) {
    log?.error('Error fetching stores', error as Error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});
