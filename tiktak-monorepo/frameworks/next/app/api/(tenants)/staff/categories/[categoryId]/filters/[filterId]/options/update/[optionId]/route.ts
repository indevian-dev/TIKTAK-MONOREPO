import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { categoryFilters, categoryFilterOptions, actionLogs } from '@/db';

export const PATCH = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { categoryId, filterId, optionId } = await params as {
    categoryId: string;
    filterId: string;
    optionId: string;
  };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  if (!categoryId || isNaN(parseInt(categoryId))) {
    return NextResponse.json(
      { error: 'Valid category ID is required' },
      { status: 400 }
    );
  }

  if (!filterId || isNaN(parseInt(filterId))) {
    return NextResponse.json(
      { error: 'Valid filter ID is required' },
      { status: 400 }
    );
  }

  if (!optionId || isNaN(parseInt(optionId))) {
    return NextResponse.json(
      { error: 'Valid option ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { title, title_en, title_ru } = body;

    // Validate at least one field is provided
    if (!title && !title_en && !title_ru) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    // Verify the option exists and belongs to the filter
    const optionCheck = await db
      .select({ id: categoryFilterOptions.id })
      .from(categoryFilterOptions)
      .innerJoin(categoryFilters, eq(categoryFilterOptions.filterId, categoryFilters.id))
      .where(and(
        eq(categoryFilterOptions.id, parseInt(optionId)),
        eq(categoryFilterOptions.filterId, parseInt(filterId)),
        eq(categoryFilters.categoryId, parseInt(categoryId))
      ))
      .limit(1);

    if (!optionCheck || optionCheck.length === 0) {
      return NextResponse.json(
        { error: 'Option not found or does not belong to this filter' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (title_en !== undefined) updateData.titleEn = title_en?.trim() || null;
    if (title_ru !== undefined) updateData.titleRu = title_ru?.trim() || null;

    // Update the option
    const updatedOption = await db
      .update(categoryFilterOptions)
      .set(updateData)
      .where(eq(categoryFilterOptions.id, parseInt(optionId)))
      .returning({
        id: categoryFilterOptions.id,
        filterId: categoryFilterOptions.filterId,
        title: categoryFilterOptions.title,
        titleEn: categoryFilterOptions.titleEn,
        titleRu: categoryFilterOptions.titleRu,
        createdAt: categoryFilterOptions.createdAt,
      });

    if (!updatedOption || updatedOption.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update option' },
        { status: 500 }
      );
    }

    // Log the action
    return NextResponse.json({
      success: true,
      message: 'Filter option updated successfully',
      option: updatedOption[0]
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to update filter option',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
