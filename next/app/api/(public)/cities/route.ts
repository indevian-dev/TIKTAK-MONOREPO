import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { cities } from '@/lib/database/schema';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const GET = unifiedApiHandler(async (_req, { db, log }) => {
  try {
    const citiesList = await db.select().from(cities);
    return okResponse({ cities: citiesList });
  } catch (error) {
    log?.error('Error fetching cities', error as Error);
    return serverErrorResponse('Failed to fetch cities');
  }
});
