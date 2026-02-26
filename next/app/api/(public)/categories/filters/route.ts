import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { NextRequest } from 'next/server';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (req: NextRequest, { module, log }) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryIds = searchParams
      .get('category_id')
      ?.split(',')
      .filter(id => id.trim() !== '')
      || [];

    if (categoryIds.length === 0) {
      return errorResponse('Valid Category ID is required', 400);
    }

    const filtersWithOptions = await module.categories.getFiltersForCategories(categoryIds);

    log?.info('Fetched filters for categories', {
      categoryIds: categoryIds.join(','),
      filterCount: filtersWithOptions.length
    });

    return okResponse({ filters: filtersWithOptions });
  } catch (error) {
    log?.error('Error fetching filters', error as Error);
    return serverErrorResponse('Internal Server Error');
  }
});
