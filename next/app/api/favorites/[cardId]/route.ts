import { NextRequest, NextResponse } from 'next/server';
import { unifiedApiHandler, UnifiedContext } from '@/lib/middleware/Interceptor.Api.middleware';
import { favoriteCards } from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { okResponse, errorResponse } from '@/lib/middleware/Response.Api.middleware';

/**
 * Handle POST /api/favorites/[cardId] (Add to favorites)
 * Handle DELETE /api/favorites/[cardId] (Remove from favorites)
 */
export const POST = unifiedApiHandler(async (req: NextRequest, ctx: UnifiedContext) => {
    // We expect the path to end in /api/favorites/[cardId]
    // Due to Next.js route structures, we'll parse it from URL if we're not inside [cardId] folder yet
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const cardId = parts[parts.length - 1]; // e.g. /api/favorites/123 -> 123

    const accountId = ctx.authData.account.id;
    const { log, db: database } = ctx;

    if (!cardId || cardId === 'favorites') {
        return errorResponse('Valid cardId is required', 400);
    }

    try {
        const newId = crypto.randomUUID();

        // Use Insert on Conflict Do Nothing (handles unique constraint graceully)
        await database.insert(favoriteCards).values({
            id: newId,
            cardId: cardId,
            accountId: accountId
        }).onConflictDoNothing();

        return okResponse({ success: true, cardId });
    } catch (error) {
        log.error('Failed to add favorite', { error, cardId, accountId });
        return errorResponse('Failed to add favorite', 500);
    }
}, { authRequired: true });

export const DELETE = unifiedApiHandler(async (req: NextRequest, ctx: UnifiedContext) => {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const cardId = parts[parts.length - 1];

    const accountId = ctx.authData.account.id;
    const { log, db: database } = ctx;

    if (!cardId || cardId === 'favorites') {
        return errorResponse('Valid cardId is required', 400);
    }

    try {
        await database.delete(favoriteCards)
            .where(
                and(
                    eq(favoriteCards.accountId, accountId),
                    eq(favoriteCards.cardId, cardId)
                )
            );

        return okResponse({ success: true, cardId });
    } catch (error) {
        log.error('Failed to remove favorite', { error, cardId, accountId });
        return errorResponse('Failed to remove favorite', 500);
    }
}, { authRequired: true });
