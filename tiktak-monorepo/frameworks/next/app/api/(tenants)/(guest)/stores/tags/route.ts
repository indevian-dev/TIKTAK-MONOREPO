import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, asc } from '@/db';
import { storesTags } from '@/db/schema';
import type { ApiRouteHandler } from '@/types';

// GET /api/stores/tags
// Returns active store tags
export const GET: ApiRouteHandler = withApiHandler(async (_req: NextRequest, { log , db }: ApiHandlerContext) => {
  try {
    const tags = await db
      .select({
        id: storesTags.id,
        tag_name: storesTags.tagName,
        is_active: storesTags.isActive,
      })
      .from(storesTags)
      .where(eq(storesTags.isActive, true))
      .orderBy(asc(storesTags.tagName));

    return NextResponse.json({ tags });
  } catch (error) {
    log?.error('Error fetching store tags', error as Error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch store tags';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
})

