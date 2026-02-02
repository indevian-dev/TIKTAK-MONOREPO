import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { blogs } from '@/db/schema';
import { ValidationService } from '@/lib/services/ValidationService';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (_request: NextRequest, { authData: _authData, params, db, log }: ApiHandlerContext) => {
  const resolvedParams = await params;
  const { id } = resolvedParams || { id: '' };

  // Validate ID parameter
  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return NextResponse.json({
      error: 'Valid ID is required'
    }, { status: 400 });
  }

  try {
    const blogId = Number(idValidation.sanitized);
    const [blog] = await db
      .select()
      .from(blogs)
      .where(and(
        eq(blogs.id, blogId),
        eq(blogs.isPublished, true)
      ))
      .limit(1);

    if (!blog) {
      return NextResponse.json({
        error: 'Blog not found'
      }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    log?.error('Error fetching blog', error as Error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, { status: 500 });
  }
})
