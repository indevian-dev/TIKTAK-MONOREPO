import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  and,
  count
} from '@/db';
import {
  categoryFilters,
  categoryFilterOptions,
  actionLogs
} from '@/db/schema';
import { ValidationService } from '@/lib/services/ValidationService';

export const DELETE = withApiHandler(async (req: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    if (!authData?.account?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = authData.account.id;
    const { categoryId, filterId } = await params as { categoryId: string; filterId: string };

    // Validate category ID
    const categoryIdValidation = ValidationService.validateId(categoryId);
    if (!categoryIdValidation.isValid) {
      return NextResponse.json({ error: 'Valid category ID is required' }, { status: 400 });
    }

    // Validate filter ID
    const filterIdValidation = ValidationService.validateId(filterId);
    if (!filterIdValidation.isValid) {
      return NextResponse.json({ error: 'Valid filter ID is required' }, { status: 400 });
    }

    const categoryIdNum = Number(categoryIdValidation.sanitized);
    const filterIdNum = Number(filterIdValidation.sanitized);

    const result = await db.transaction(async (tx: DbTransaction) => {
      // Verify the filter exists and belongs to the category
      const filterCheck = await tx
        .select({ id: categoryFilters.id })
        .from(categoryFilters)
        .where(
          and(
            eq(categoryFilters.id, filterIdNum),
            eq(categoryFilters.categoryId, categoryIdNum)
          )
        )
        .limit(1);

      if (!filterCheck || filterCheck.length === 0) {
        throw new Error('FILTER_NOT_FOUND');
      }

      // Check if filter has options
      const optionsCount = await tx
        .select({ count: count() })
        .from(categoryFilterOptions)
        .where(eq(categoryFilterOptions.filterId, filterIdNum));

      if (optionsCount && optionsCount[0] && optionsCount[0].count > 0) {
        throw new Error('FILTER_HAS_OPTIONS');
      }

      // Delete the filter
      await tx
        .delete(categoryFilters)
        .where(
          and(
            eq(categoryFilters.id, filterIdNum),
            eq(categoryFilters.categoryId, categoryIdNum)
          )
        );

      // Log the action
      await tx
        .insert(actionLogs)
        .values({
          action: 'delete_filter',
          createdBy: accountId,
          resourceType: 'category_filters',
          resourceId: filterIdNum
        });

      return { deleted: true };
    });

    log?.info('Filter deleted', { filterId: filterIdNum });

    return NextResponse.json({
      success: true,
      message: 'Filter deleted successfully'
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'FILTER_NOT_FOUND') {
      return NextResponse.json({
        error: 'Filter not found or does not belong to this category'
      }, { status: 404 });
    }

    if (error instanceof Error && error.message === 'FILTER_HAS_OPTIONS') {
      return NextResponse.json({
        error: 'Cannot delete filter that has options. Please delete all options first.'
      }, { status: 400 });
    }

    log?.error('Filter deletion error', error instanceof Error ? error : undefined);
    return NextResponse.json({
      error: 'Failed to delete filter'
    }, { status: 500 });
  }
})
