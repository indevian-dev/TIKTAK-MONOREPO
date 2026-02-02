import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import {
  eq,
  and
} from '@/db';
import {
  favoriteCards,
  actionLogs
} from '@/db/schema';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const DELETE = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!authData.account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }
    const cardId = requireIntParam(resolvedParams.id, 'Card ID');
    const accountId = authData.account.id;

    // Use transaction
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Delete the favorite
      const deletedFavorites = await tx
        .delete(favoriteCards)
        .where(
          and(
            eq(favoriteCards.cardId, cardId),
            eq(favoriteCards.accountId, accountId)
          )
        )
        .returning();

      if (deletedFavorites.length === 0) {
        throw new Error('Favorite not found');
      }

      const deletedFavorite = deletedFavorites[0];

      // Log the action
      await tx
        .insert(actionLogs)
        .values({
          action: 'remove_from_favorites',
          createdBy: accountId,
          resourceType: 'favorite_cards',
          resourceId: deletedFavorite.id
        });

      return { deletedFavorite };
    });

    return NextResponse.json({
      message: 'Card removed from favorites successfully',
      favorite: result.deletedFavorite
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Favorite not found') {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({
      error: errorMessage || 'Failed to remove card from favorites'
    }, { status: 500 });
  }
})
