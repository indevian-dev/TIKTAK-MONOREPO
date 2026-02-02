import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { categoryFilters, categoryFilterOptions, actionLogs } from '@/db';

export const POST = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { categoryId, filterId } = await params as { categoryId: string; filterId: string };

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

  if (!filterId || isNaN(parseInt(filterId))) {
    return NextResponse.json({ error: 'Valid filter ID is required' }, { status: 400 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { title, title_en, title_ru } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Verify the filter exists and belongs to the category
    const filterCheck = await db
      .select({ id: categoryFilters.id, type: categoryFilters.type })
      .from(categoryFilters)
      .where(and(
        eq(categoryFilters.id, parseInt(filterId)),
        eq(categoryFilters.categoryId, parseInt(categoryId))
      ))
      .limit(1);

    if (!filterCheck || filterCheck.length === 0) {
      return NextResponse.json({ error: 'Filter not found or does not belong to this category' }, { status: 404 });
    }

    const filterType = filterCheck[0].type;

    // For STATIC filters, create option in category_filter_options table
    if (filterType === 'STATIC') {
      const newOption = await db
        .insert(categoryFilterOptions)
        .values({
          filterId: parseInt(filterId),
          title: title.trim(),
          titleEn: title_en?.trim() || null,
          titleRu: title_ru?.trim() || null,
        })
        .returning({
          id: categoryFilterOptions.id,
          filterId: categoryFilterOptions.filterId,
          title: categoryFilterOptions.title,
          titleEn: categoryFilterOptions.titleEn,
          titleRu: categoryFilterOptions.titleRu,
          createdAt: categoryFilterOptions.createdAt,
        });

      if (!newOption || newOption.length === 0) {
        return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
      }

      // Log the action
      return NextResponse.json({
        success: true,
        message: 'Filter option created successfully',
        option: newOption[0]
      }, { status: 200 });
    }
    // For DYNAMIC filters, options are not stored in database - they're just UI labels
    else if (filterType === 'DYNAMIC') {
      return NextResponse.json({
        success: true,
        message: 'Dynamic filter option created (no database storage needed)',
        option: {
          filter_id: parseInt(filterId),
          title: title.trim(),
          title_en: title_en?.trim() || null,
          title_ru: title_ru?.trim() || null
        }
      }, { status: 200 });
    }
    else {
      return NextResponse.json({ error: 'Invalid filter type' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create filter option',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
})
