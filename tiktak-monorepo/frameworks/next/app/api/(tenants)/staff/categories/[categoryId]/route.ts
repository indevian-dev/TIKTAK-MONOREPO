import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { categories, eq } from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';
import type { ApiRouteHandler } from '@/types';

/**
 * GET /api/staff/categories/[categoryId]
 * Fetch a single category by ID.
 */
export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params , db }: ApiHandlerContext) => {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to fetch category'
    }, { status: 500 });
  }
});
