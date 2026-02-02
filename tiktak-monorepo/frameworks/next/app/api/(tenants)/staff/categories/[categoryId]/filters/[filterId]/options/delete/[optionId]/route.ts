import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and } from '@/db';
import { categoryFilters, categoryFilterOptions, actionLogs, cards } from '@/db';

export const DELETE = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
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

    // Check if option is used in any cards (check filters_options JSONB field)
    // Get all cards with filters_options and check in application layer
    const cardsWithFilters = await db
      .select({ id: cards.id, filtersOptions: cards.filtersOptions })
      .from(cards);

    const optionIdInt = parseInt(optionId);
    const cardsUsingOption = cardsWithFilters.filter(card => {
      if (!card.filtersOptions) return false;
      const filterOptions = Array.isArray(card.filtersOptions)
        ? card.filtersOptions
        : Object.values(card.filtersOptions as object);
      return filterOptions.some((option: any) =>
        option === optionIdInt || option?.optionId === optionIdInt || option?.id === optionIdInt
      );
    });

    if (cardsUsingOption.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete option that is used in cards. Please remove it from all cards first.'
      }, { status: 400 });
    }

    // Delete the option
    const deleted = await db
      .delete(categoryFilterOptions)
      .where(eq(categoryFilterOptions.id, parseInt(optionId)))
      .returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete option' },
        { status: 500 }
      );
    }

    // Log the action
    return NextResponse.json({
      success: true,
      message: 'Filter option deleted successfully'
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to delete filter option',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
