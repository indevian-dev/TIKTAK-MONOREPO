import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const categoriesList = await module.categories.getActiveCategories();
    return okResponse({ categories: categoriesList });
  } catch (error) {
    log?.error('Error fetching categories', error as Error);
    return serverErrorResponse('Failed to fetch categories');
  }
});