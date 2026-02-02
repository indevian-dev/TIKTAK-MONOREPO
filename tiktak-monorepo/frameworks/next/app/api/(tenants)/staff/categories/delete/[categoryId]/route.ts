import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { categories, cards, actionLogs, eq } from '@/db';
import { count } from 'drizzle-orm';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const DELETE = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }
  const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');

  // Get authenticated account ID
  const accountId = authData.account.id;

  try {
    // Use a transaction to handle the deletion and logging
    const result = await db.transaction(async (tx: DbTransaction) => {
      // First check if category exists
      const [category] = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new Error('Category not found');
      }

      // Check if category has children
      const [childrenCount] = await tx
        .select({ count: count() })
        .from(categories)
        .where(eq(categories.parentId, categoryId));

      if (childrenCount.count > 0) {
        throw new Error('Cannot delete category with children');
      }

      // Check if category is used in cards (check categories JSONB field)
      // Get all cards with categories and filter in application layer
      const cardsWithCategories = await tx
        .select({ id: cards.id, categories: cards.categories })
        .from(cards);

      const cardsUsingCategory = cardsWithCategories.filter(card => {
        if (!card.categories) return false;
        const categoryList = Array.isArray(card.categories)
          ? card.categories
          : Object.values(card.categories as object);
        return categoryList.includes(categoryId);
      });

      if (cardsUsingCategory.length > 0) {
        throw new Error('Cannot delete category used by cards');
      }

      // Delete the category
      const [deletedCategory] = await tx
        .delete(categories)
        .where(eq(categories.id, categoryId))
        .returning();

      // Log the action
      return deletedCategory;
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      category: result
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Category not found') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (errorMessage === 'Cannot delete category with children') {
      return NextResponse.json({ error: 'Cannot delete category with children' }, { status: 400 });
    }

    if (errorMessage === 'Cannot delete category used by cards') {
      return NextResponse.json({ error: 'Cannot delete category used by cards' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
})
