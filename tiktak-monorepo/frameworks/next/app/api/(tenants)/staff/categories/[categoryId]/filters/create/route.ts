import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { categories, categoryFilters, actionLogs } from '@/db';

export const POST = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { categoryId } = await params as { categoryId: string };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  if (!categoryId || isNaN(parseInt(categoryId))) {
    return NextResponse.json({ error: 'Valid category ID is required' }, { status: 400 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { title, title_en, title_ru, type } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!type || !['DYNAMIC', 'STATIC'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required (DYNAMIC or STATIC)' }, { status: 400 });
    }

    // Verify the category exists
    const categoryCheck = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, parseInt(categoryId)))
      .limit(1);

    if (!categoryCheck || categoryCheck.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Create the filter
    const newFilter = await db
      .insert(categoryFilters)
      .values({
        categoryId: parseInt(categoryId),
        title: title.trim(),
        titleEn: title_en?.trim() || null,
        titleRu: title_ru?.trim() || null,
        type: type,
      })
      .returning({
        id: categoryFilters.id,
        title: categoryFilters.title,
        titleEn: categoryFilters.titleEn,
        titleRu: categoryFilters.titleRu,
        type: categoryFilters.type,
        categoryId: categoryFilters.categoryId,
        createdAt: categoryFilters.createdAt,
      });

    if (!newFilter || newFilter.length === 0) {
      return NextResponse.json({ error: 'Failed to create filter' }, { status: 500 });
    }

    // Log the action
    return NextResponse.json({
      success: true,
      message: 'Filter created successfully',
      filter: newFilter[0]
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create filter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
})
