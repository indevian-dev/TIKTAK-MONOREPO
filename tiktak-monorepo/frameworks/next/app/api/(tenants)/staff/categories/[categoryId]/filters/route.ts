import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { categoryFilters, categoryFilterOptions, eq, inArray } from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const GET = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const resolvedParams = await params;
  if (!resolvedParams?.categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }
  const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');

  try {
    // Get filters for this category
    const filters = await db
      .select({
        id: categoryFilters.id,
        title: categoryFilters.title,
        title_en: categoryFilters.titleEn,
        title_ru: categoryFilters.titleRu,
        type: categoryFilters.type,
        category_id: categoryFilters.categoryId
      })
      .from(categoryFilters)
      .where(eq(categoryFilters.categoryId, categoryId))
      .orderBy(categoryFilters.id);

    // Get all options for these filters
    const filterIds = filters.map(f => f.id);
    const options = filterIds.length > 0 ? await db
      .select({
        id: categoryFilterOptions.id,
        title: categoryFilterOptions.title,
        title_en: categoryFilterOptions.titleEn,
        title_ru: categoryFilterOptions.titleRu,
        filter_id: categoryFilterOptions.filterId
      })
      .from(categoryFilterOptions)
      .where(inArray(categoryFilterOptions.filterId, filterIds))
      : [];

    // Group options by filter_id
    const filtersWithOptions = filters.map(filter => ({
      ...filter,
      category_filter_options: options.filter(opt => opt.filter_id === filter.id)
    }));

    return NextResponse.json({ filters: filtersWithOptions }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
})
