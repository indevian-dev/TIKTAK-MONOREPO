import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { eq } from 'drizzle-orm';
import type { ApiRouteHandler } from '@/types';
import { favoriteCards, cardsPublished } from '@/db/schema';

export const GET: ApiRouteHandler = withApiHandler(async (request, { db, log }) => {
  // Note: db is automatically ownership-filtered because verifyOwnership: true in config
  // All queries automatically filter by tenant_access_key - no manual checking needed!

  try {
    // Get favorites (auto-filtered by tenant_access_key)
    const favorites = await db
      .select({ cardId: favoriteCards.cardId })
      .from(favoriteCards)
      .innerJoin(
        cardsPublished,
        eq(favoriteCards.cardId, cardsPublished.id)
      );

    // Return array of card IDs as integers
    const cardIds = favorites.map(f => f.cardId as number);

    log?.info('Favorites retrieved', { count: cardIds.length });

    return NextResponse.json({ favorites: cardIds });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log?.error('Error retrieving favorites', error as Error);
    return NextResponse.json({
      error: errorMessage || 'Failed to retrieve favorites'
    }, { status: 500 });
  }
});
