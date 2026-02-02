import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cards as cardsTable, cardsPublished as cardsPublishedTable } from '@/types/resources/card/cardDb';
import { requireIntParam } from '@/lib/utils/paramsHelper';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData || !authData.account) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before accessing properties (Next.js 15+ requirement)
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }
    const cardId = requireIntParam(resolvedParams.id, 'Card ID');

    const accountId = authData.account.id;
    const mode = 'store'; // Default to store mode for provider endpoints

    try {
        // First authenticate the user properly

        const result = await db.transaction(async (tx: DbTransaction) => {
            // Check if card exists
            const cardExistsResult = await tx
                .select({
                    id: cardsTable.id,
                    accountId: cardsTable.accountId,
                    storeId: cardsTable.storeId,
                    title: cardsTable.title,
                })
                .from(cardsTable)
                .where(eq(cardsTable.id, cardId))
                .limit(1);

            if (!cardExistsResult || cardExistsResult.length === 0) {
                return {
                    operation: 'error',
                    error: 'Card not found',
                    status: 404
                };
            }

            const cardExists = cardExistsResult[0];

            // Convert database BIGINT values to numbers for consistent comparison
            const cardAccountId = cardExists.accountId ? Number(cardExists.accountId) : null;
            const cardStoreId = cardExists.storeId ? Number(cardExists.storeId) : null;

            ConsoleLogger.log('Card found:', {
                cardId: cardExists.id,
                cardAccountId: cardAccountId,
                cardStoreId: cardStoreId,
                userAccountId: accountId,
                types: {
                    cardAccountId: typeof cardAccountId,
                    userAccountId: typeof accountId,
                    cardStoreId: typeof cardStoreId,
                }
            });

            // Check access permissions
            let hasAccess = false;
            let accessReason = '';

            ConsoleLogger.log('Mode:', mode);
            ConsoleLogger.log('Card Account ID:', cardAccountId);
            ConsoleLogger.log('User Account ID:', accountId);

            if (mode === 'store') {
                hasAccess = cardStoreId === null;
                accessReason = hasAccess ? 'Store access granted' :
                    `Store access denied: card.store_id (${cardStoreId}) !== null`;
            } else {
                accessReason = `Invalid mode: ${mode}`;
            }

            if (!hasAccess) {
                ConsoleLogger.log('Access denied:', accessReason);
                return {
                    operation: 'error',
                    error: 'Access denied',
                    details: accessReason,
                    status: 403
                };
            }

            // Fetch the full card data with published data
            const cardResult = await tx
                .select()
                .from(cardsTable)
                .where(eq(cardsTable.id, cardId))
                .limit(1);

            const card = cardResult.length > 0 ? cardResult[0] : null;

            // Check if there's published data for this card
            const publishedDataResult = await tx
                .select()
                .from(cardsPublishedTable)
                .where(eq(cardsPublishedTable.cardId, cardId))
                .limit(1);

            const publishedData = publishedDataResult.length > 0 ? publishedDataResult[0] : null;

            return {
                operation: 'success',
                card,
                published_data: publishedData,
                is_published: !!publishedData
            };
        });

        if (result.operation === 'error') {
            return NextResponse.json({
                error: result.error,
                details: result.details
            }, { status: result.status });
        }

        return NextResponse.json(result, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Error fetching card details',
            details: errorMessage
        }, { status: 500 });
    }
});
