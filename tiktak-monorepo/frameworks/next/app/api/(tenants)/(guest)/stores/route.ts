import { NextResponse } from 'next/server';
import { eq, and, inArray, desc, asc } from '@/db';
import { count } from 'drizzle-orm';
import { stores } from '@/db/schema';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import type { ApiRouteHandler } from '@/types';

// GET /api/stores (public)
export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, { log , db }: ApiHandlerContext) => {
  const { searchParams } = new URL(request.url);
  const hasAnyParam = Array.from(searchParams.keys()).length > 0;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = Math.min(
    parseInt(searchParams.get('pageSize') || '24', 10),
    100
  );
  const tagIdsParam = searchParams.get('tagIds') || '';
  const sortField = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';

  const offset = (page - 1) * pageSize;

  const tagIds = tagIdsParam
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => parseInt(v, 10))
    .filter((v) => !Number.isNaN(v));

  try {
    // Build where conditions
    const whereConditions = [
      eq(stores.isActive, true),
      eq(stores.isApproved, true)
    ];

    if (tagIds.length > 0) {
      whereConditions.push(inArray(stores.storeTagId, tagIds));
    }

    // Determine order direction
    const validSortFields = {
      'created_at': stores.createdAt,
      'updated_at': stores.updatedAt,
      'title': stores.title,
      'id': stores.id
    };
    const sortColumn = validSortFields[sortField as keyof typeof validSortFields] || stores.createdAt;
    const orderDirection = order.toUpperCase() === 'ASC' ? asc : desc;

    // Get stores with pagination if params provided
    const storesQuery = db
      .select()
      .from(stores)
      .where(and(...whereConditions))
      .orderBy(orderDirection(sortColumn));

    const storesList = hasAnyParam
      ? await storesQuery.limit(pageSize).offset(offset)
      : await storesQuery;

    // Get count for pagination
    if (hasAnyParam) {
      const [countResult] = await db
        .select({ value: count() })
        .from(stores)
        .where(and(...whereConditions));

      const totalCount = countResult?.value ?? 0;

      return NextResponse.json({
        stores: storesList,
        total: totalCount,
        page,
        pageSize
      });
    }

    return NextResponse.json(storesList);
  } catch (error) {
    log?.error('Error fetching stores', error as Error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      }

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch stores';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
})
