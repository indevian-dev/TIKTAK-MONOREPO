import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types/next';
import { NextRequest, NextResponse } from 'next/server';
import { inArray, asc } from 'drizzle-orm';
import {
  categoryFilters,
  categoryFilterOptions,
  type CategoryFilterRow
} from '@/lib/domain/categories';

export const GET: ApiRouteHandler = withApiHandler(async (req: NextRequest, { log , db }: ApiHandlerContext) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryIds = searchParams
      .get('category_id')
      ?.split(',')
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id));

    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json({
        error: 'Valid Category ID is required'
      }, { status: 400 });
    }

    // Fetch filters for the given category IDs
    let filters: CategoryFilterRow[] = [];
    try {
      filters = await db
        .select()
        .from(categoryFilters)
        .where(inArray(categoryFilters.categoryId, categoryIds))
        .orderBy(asc(categoryFilters.id));
    } catch (dbError) {
      log?.warn('No filters table or filters not found', {
        categoryIds: categoryIds.join(','),
        errorMessage: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
      filters = [];
    }

    // Fetch filter options for these filters
    const filterIds = filters.map(f => f.id);
    let options: any[] = [];
    if (filterIds.length > 0) {
      try {
        options = await db
            .select()
            .from(categoryFilterOptions)
            .where(inArray(categoryFilterOptions.filterId, filterIds));
      } catch (dbError) {
        log?.warn('No filter options table or options not found', {
          filterIds: filterIds.join(','),
          errorMessage: dbError instanceof Error ? dbError.message : 'Unknown error'
        });
        options = [];
      }
    }

    // Group options by filter_id
    const filtersWithOptions = filters.map(filter => ({
      id: filter.id,
      title: filter.title,
      titleEn: filter.titleEn,
      titleRu: filter.titleRu,
      type: filter.type,
      categoryId: filter.categoryId,
      category_filter_options: options.filter(opt => opt.filterId === filter.id)
    }));

    log?.info('Fetched filters for categories', {
      categoryIds: categoryIds.join(','),
      filterCount: filters.length
    });

    return NextResponse.json({
      filters: filtersWithOptions
    }, { status: 200 });
  } catch (error) {
    log?.error('Error fetching filters', error as Error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, { status: 500 });
  }
})
