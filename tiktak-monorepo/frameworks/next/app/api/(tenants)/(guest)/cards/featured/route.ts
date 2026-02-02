import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq, desc } from '@/db';
import { cardsPublished, stores } from '@/db/schema';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (_req: NextRequest, { authData: _authData, params: _params, db, log }: ApiHandlerContext) => {
  try {
    const cards = await db
      .select({
        id: cardsPublished.id,
        createdAt: cardsPublished.createdAt,
        title: cardsPublished.title,
        isActive: cardsPublished.isActive,
        price: cardsPublished.price,
        body: cardsPublished.body,
        premiumUntil: cardsPublished.premiumUntil,
        storeId: cardsPublished.storeId,
        accountId: cardsPublished.accountId,
        storagePrefix: cardsPublished.storagePrefix,
        location: cardsPublished.location,
        images: cardsPublished.images,
        cover: cardsPublished.cover,
        video: cardsPublished.video,
        updatedAt: cardsPublished.updatedAt,
        filtersOptions: cardsPublished.filtersOptions,
        categories: cardsPublished.categories,
        cardId: cardsPublished.cardId,
        store_name: stores.title,
      })
      .from(cardsPublished)
      .leftJoin(stores, eq(cardsPublished.storeId, stores.id))
      .where(eq(cardsPublished.isActive, true))
      .orderBy(desc(cardsPublished.createdAt))
      .limit(12);

    return NextResponse.json({ cards });
  } catch (error) {
    log?.error('Error fetching homepage cards', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch homepage cards'
    }, { status: 500 });
  }
});
