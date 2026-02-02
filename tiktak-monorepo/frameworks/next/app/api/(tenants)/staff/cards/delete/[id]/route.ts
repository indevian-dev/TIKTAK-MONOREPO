import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cards, cardsPublished, accountsNotifications, actionLogs } from '@/db';
import { deleteCardFromOpenSearch } from '@/lib/utils/syncCardToOpenSearchUtility';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const DELETE = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData?.account?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = authData.account.id;

    // Await params before accessing id property
    const { id } = await params as { id: string };
    const cardId = parseInt(id);

    if (!cardId || isNaN(cardId)) {
        return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 });
    }

    try {
        const result = await db.transaction(async (tx: DbTransaction) => {
            // Check if card exists and get owner info for notification
            const cardResult = await tx
                .select({
                    id: cards.id,
                    accountId: cards.accountId,
                    title: cards.title,
                })
                .from(cards)
                .where(eq(cards.id, cardId))
                .limit(1);

            if (!cardResult || cardResult.length === 0) {
                return {
                    operation: 'error',
                    error: 'Card not found',
                    status: 404
                };
            }

            const card = cardResult[0];

            // Check if card has published data
            const publishedCardResult = await tx
                .select({ id: cardsPublished.id })
                .from(cardsPublished)
                .where(eq(cardsPublished.cardId, cardId))
                .limit(1);

            const publishedCard = publishedCardResult.length > 0 ? publishedCardResult[0] : null;
            let openSearchDeleted = false;

            // If card has published data, delete it and remove from OpenSearch
            if (publishedCard) {
                await tx
                    .delete(cardsPublished)
                    .where(eq(cardsPublished.cardId, cardId));

                // Delete from OpenSearch (using published card id)
                openSearchDeleted = await deleteCardFromOpenSearch(publishedCard.id);
                if (!openSearchDeleted) {
                    ConsoleLogger.warn(`Failed to delete card ${publishedCard.id} from OpenSearch, but continuing with database deletion`);
                }
            }

            // Delete the card from cards table
            await tx
                .delete(cards)
                .where(eq(cards.id, cardId));

            // Notify the card owner if they exist
            if (card.accountId) {
                const cardTitle = card.title ? `"${card.title}"` : '';
                await tx.insert(accountsNotifications).values({
                    name: 'Card Deleted by Admin',
                    body: `Your card ${cardTitle} has been deleted by an administrator`,
                    markAsRead: false,
                    accountId: card.accountId,
                });
            }

            // Log the admin action
            return {
                operation: 'success',
                message: 'Card deleted successfully by admin',
                deletedCardId: cardId,
                wasPublished: !!publishedCard,
                openSearchDeleted,
                ownerNotified: !!card.accountId
            };
        });

        if (result.operation === 'error') {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json(result, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Error deleting card' }, { status: 500 });
    }
})
