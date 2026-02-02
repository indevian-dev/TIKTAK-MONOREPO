import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from '@/db';
import { blogs } from '@/db/schema';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (_request: NextRequest, { authData: _authData, params: _params , db }: ApiHandlerContext) => {
  const blogsList = await db
    .select()
    .from(blogs)
    .where(eq(blogs.isPublished, true))
    .orderBy(desc(blogs.createdAt));

  return NextResponse.json({ blogs: blogsList }, { status: 200 });
})
