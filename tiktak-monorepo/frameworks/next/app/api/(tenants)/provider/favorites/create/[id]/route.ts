import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import {
  eq,
  and
} from '@/db';
import {
  cardsPublished,
  favoriteCards,
  actionLogs
} from '@/db/schema';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const POST = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
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

        // Get authenticated account ID
        const accountId = authData.account.id;

        // Use transaction to handle all operations
        const result = await db.transaction(async (tx: DbTransaction) => {
            // Check if card exists
            const cardPublishedResult = await tx
                .select({
                    id: cardsPublished.id,
                    isActive: cardsPublished.isActive
                })
                .from(cardsPublished)
                .where(eq(cardsPublished.id, cardId))
                .limit(1);

            if (!cardPublishedResult || cardPublishedResult.length === 0) {
                throw new Error('Card published not found');
            }

            const cardPublishedData = cardPublishedResult[0];

            // Check if favorite already exists
            const existingFavoriteResult = await tx
                .select({ id: favoriteCards.id })
                .from(favoriteCards)
                .where(
                    and(
                        eq(favoriteCards.cardId, cardPublishedData.id),
                        eq(favoriteCards.accountId, accountId)
                    )
                )
                .limit(1);

            if (existingFavoriteResult && existingFavoriteResult.length > 0) {
                throw new Error('Card is already in favorites');
            }

            // Add to favorites
            const [favorite] = await tx
                .insert(favoriteCards)
                .values({
                    cardId: cardPublishedData.id,
                    accountId: accountId
                })
                .returning();

            // Log the action
            await tx
                .insert(actionLogs)
                .values({
                    action: 'add_to_favorites',
                    createdBy: accountId,
                    resourceType: 'favorite_cards',
                    resourceId: favorite.id
                });

            return { favorite, cardPublished: cardPublishedData };
        });

        return NextResponse.json({
            message: 'Card added to favorites successfully',
            favorite: result.favorite,
            cardPublished: result.cardPublished
        }, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Handle specific error cases
        if (errorMessage === 'Card published not found') {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        if (errorMessage === 'Card is already in favorites') {
            return NextResponse.json({ error: 'Card is already in favorites' }, { status: 409 });
        }

        return NextResponse.json({
            error: errorMessage || 'Failed to add card to favorites'
        }, { status: 500 });
    }
})
