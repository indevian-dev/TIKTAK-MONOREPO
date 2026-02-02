import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and, ne } from '@/db';
import { pages, actionLogs } from '@/db';
import type { ApiRouteHandler } from '@/types';

export const PUT: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Get authenticated account ID
  const accountId = authData.account.id;

  try {
    // Parse request body
    const body = await request.json();
    const {
      type,
      content_az,
      content_ru,
      content_en,
      meta_title
    } = body;

    // Validate that at least one field is provided for update
    if (!type && !content_az && !content_ru && !content_en && !meta_title) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Use transaction to handle the update and action logging
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Check if page exists first
      const existingPage = await tx
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.type, type))
        .limit(1);

      if (!existingPage || existingPage.length === 0) {
        throw new Error('Page not found');
      }

      const pageId = existingPage[0].id;

      // If type is being updated, check for uniqueness constraint
      if (type) {
        const typeExists = await tx
          .select({ id: pages.id })
          .from(pages)
          .where(and(eq(pages.type, type), ne(pages.id, pageId)))
          .limit(1);

        if (typeExists.length > 0) {
          throw new Error('Page type already exists');
        }
      }

      // Build the update object dynamically
      const updateData: any = {};

      if (type !== undefined) {
        updateData.type = type;
      }

      if (content_az !== undefined) {
        updateData.contentAz = content_az;
      }

      if (content_ru !== undefined) {
        updateData.contentRu = content_ru;
      }

      if (content_en !== undefined) {
        updateData.contentEn = content_en;
      }

      if (meta_title !== undefined) {
        updateData.metaTitle = meta_title;
      }

      // Add update_at field
      updateData.updateAt = new Date();

      // Execute the update
      const updatedPage = await tx
        .update(pages)
        .set(updateData)
        .where(eq(pages.id, pageId))
        .returning();

      // Log the action
      return updatedPage[0];
    });

    return NextResponse.json({
      message: 'Page updated successfully',
      doc: result
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code;
    const errorConstraint = (error as any)?.constraint;
    if (errorMessage === 'Page not found') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    if (errorMessage === 'Page type already exists') {
      return NextResponse.json({ error: 'Page type already exists' }, { status: 409 });
    }

    // Handle unique constraint violation from database
    if (errorCode === '23505' && errorConstraint === 'pages_type_key') {
      return NextResponse.json({ error: 'Page type already exists' }, { status: 409 });
    }

    return NextResponse.json({
      error: errorMessage || 'Failed to update page'
    }, { status: 500 });
  }
})
