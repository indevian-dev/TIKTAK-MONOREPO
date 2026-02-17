import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextRequest, NextResponse } from 'next/server';
import { cities } from '@/lib/database/schema';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types/next';

export const GET: ApiRouteHandler = withApiHandler(async (_request: NextRequest, { log, db }: ApiHandlerContext) => {
  try {
    const citiesList = await db
      .select()
      .from(cities);

    return NextResponse.json({ cities: citiesList });
  } catch (error) {
    log?.error('Error fetching cities', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch cities'
    }, { status: 500 });
  }
});
