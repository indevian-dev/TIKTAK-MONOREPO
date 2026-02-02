import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { cards, cardsPublished, actionLogs, eq, or } from '@/db';
import { deleteCardFromOpenSearch } from '@/lib/utils/syncCardToOpenSearchUtility';
import { requireIntParam } from '@/lib/utils/paramsHelper';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const DELETE = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData || !authData.account) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = authData.account.id;
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }
    const cardId = requireIntParam(resolvedParams.id, 'Card ID');

    try {
        const result = await db.transaction(async (tx: DbTransaction) => {
            // Check if card exists and belongs to user
            const [card] = await tx
                .select({ id: cards.id, accountId: cards.accountId, storeId: cards.storeId })
                .from(cards)
                .where(eq(cards.id, cardId));

            if (!card) {
                return {
                    operation: 'error',
                    error: 'Card not found',
                    status: 404
                };
            }

            // Check ownership
            if (card.accountId !== accountId) {
                return {
                    operation: 'error',
                    error: 'Access denied',
                    status: 403
                };
            }

            let openSearchDeleted = false;

            // Check if card has published data
            const [publishedCard] = await tx
                .select({ id: cardsPublished.id })
                .from(cardsPublished)
                .where(eq(cardsPublished.cardId, cardId));

            // If card has published data, delete it and remove from OpenSearch
            if (publishedCard) {
                await tx
                    .delete(cardsPublished)
                    .where(eq(cardsPublished.cardId, cardId));

                // Delete from OpenSearch
                openSearchDeleted = await deleteCardFromOpenSearch(cardId);
                if (!openSearchDeleted) {
                    ConsoleLogger.warn(`Failed to delete card ${cardId} from OpenSearch, continuing`);
                }
            }

            // Delete the card
            await tx.delete(cards).where(eq(cards.id, cardId));

            // Log the action
            return {
                operation: 'success',
                message: 'Card deleted successfully',
                deletedCardId: cardId,
                wasPublished: !!publishedCard,
                openSearchDeleted
            };
        });

        if (result.operation === 'error') {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Error deleting card' }, { status: 500 });
    }
})
