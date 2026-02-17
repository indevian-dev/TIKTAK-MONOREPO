import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { pages } from '@/lib/database/schema';
import type { ApiRouteHandler } from '@/types/next';

export const GET: ApiRouteHandler = withApiHandler(async (_req: NextRequest, { log , db }: ApiHandlerContext) => {
  try {
    const [rulesPage] = await db
      .select()
      .from(pages)
      .where(eq(pages.type, 'RULES'))
      .limit(1);

    if (!rulesPage) {
      return NextResponse.json({
        error: 'Rules page not found'
      }, { status: 404 });
    }

    return NextResponse.json({ content: rulesPage }, { status: 200 });
  } catch (error) {
    log?.error('Error fetching rules', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch rules'
    }, { status: 500 });
  }
})
