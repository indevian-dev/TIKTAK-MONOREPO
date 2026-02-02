import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { pages } from '@/db/schema';
import type { ApiRouteHandler } from '@/types';

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
