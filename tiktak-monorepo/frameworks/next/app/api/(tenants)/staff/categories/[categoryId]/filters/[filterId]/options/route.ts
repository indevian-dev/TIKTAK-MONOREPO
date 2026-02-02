import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and, asc } from '@/db';
import { categoryFilters, categoryFilterOptions } from '@/db';

export const GET = withApiHandler(async (req: NextRequest, { params , db }: ApiHandlerContext) => {
  const { categoryId, filterId } = await params as { categoryId: string; filterId: string };

  if (!categoryId || isNaN(parseInt(categoryId))) {
    return NextResponse.json(
      { error: 'Valid category ID is required' },
      { status: 400 }
    );
  }

  if (!filterId || isNaN(parseInt(filterId))) {
    return NextResponse.json(
      { error: 'Valid filter ID is required' },
      { status: 400 }
    );
  }

  try {
    // Verify the filter exists and belongs to the category
    const filterCheck = await db
      .select({ id: categoryFilters.id, type: categoryFilters.type })
      .from(categoryFilters)
      .where(and(
        eq(categoryFilters.id, parseInt(filterId)),
        eq(categoryFilters.categoryId, parseInt(categoryId))
      ))
      .limit(1);

    if (!filterCheck || filterCheck.length === 0) {
      return NextResponse.json(
        { error: 'Filter not found or does not belong to this category' },
        { status: 404 }
      );
    }

    const filterType = filterCheck[0].type;

    // Only STATIC filters have stored options
    if (filterType === 'STATIC') {
      const options = await db
        .select({
          id: categoryFilterOptions.id,
          filterId: categoryFilterOptions.filterId,
          title: categoryFilterOptions.title,
          titleEn: categoryFilterOptions.titleEn,
          titleRu: categoryFilterOptions.titleRu,
          createdAt: categoryFilterOptions.createdAt,
        })
        .from(categoryFilterOptions)
        .where(eq(categoryFilterOptions.filterId, parseInt(filterId)))
        .orderBy(asc(categoryFilterOptions.title));

      return NextResponse.json({
        success: true,
        options: options || []
      }, { status: 200 });
    } else {
      // DYNAMIC filters don't have stored options
      return NextResponse.json({
        success: true,
        options: [],
        message: 'Dynamic filters do not have stored options'
      }, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch filter options',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
