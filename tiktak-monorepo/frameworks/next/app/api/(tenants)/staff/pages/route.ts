import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { eq } from '@/db';
import { pages, actionLogs } from '@/db';
import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Verify authentication
    const accountId = authData.account.id;

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    // Fetch page by type
    const result = await db
      .select({
        id: pages.id,
        createdAt: pages.createdAt,
        type: pages.type,
        contentAz: pages.contentAz,
        contentRu: pages.contentRu,
        contentEn: pages.contentEn,
        updateAt: pages.updateAt,
      })
      .from(pages)
      .where(eq(pages.type, type))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Log the action
    return NextResponse.json({
      page: result[0],
      success: true
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to fetch page',
      details: errorMessage
    }, { status: 500 });
  }
})
