import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, count, desc } from '@/db';
import { favoriteCards, cardsPublished } from '@/db/schema';

export const GET = withApiHandler(async (req: NextRequest, { db, log }: ApiHandlerContext) => {
    // Note: db is automatically ownership-filtered because verifyOwnership: true in config
    // All queries automatically filter by tenant_access_key - no manual checking needed!

    try {
        // Parse query parameters for pagination and filtering
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1') || 1;
        const limit = parseInt(url.searchParams.get('limit') || '20') || 20;
        const offset = (page - 1) * limit;

        // Get favorites with card details (auto-filtered by tenant_access_key)
        const favorites = await db
          .select({
            favoriteId: favoriteCards.id,
            id: cardsPublished.id
          })
          .from(favoriteCards)
          .innerJoin(
            cardsPublished,
            eq(favoriteCards.cardId, cardsPublished.id)
          )
          .orderBy(desc(favoriteCards.createdAt))
          .limit(limit)
          .offset(offset);

        // Get total count for pagination (auto-filtered)
        const countResult = await db
          .select({ total: count() })
          .from(favoriteCards)
          .innerJoin(
            cardsPublished,
            eq(favoriteCards.cardId, cardsPublished.id)
          );

        const total = countResult[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'Favorites retrieved successfully',
            favorites,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log?.error('Error retrieving favorites', error as Error);
        return NextResponse.json({
            error: errorMessage || 'Failed to retrieve favorites'
        }, { status: 500 });
    }
})
