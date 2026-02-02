import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cards, cardsPublished, stores } from '@/db';

export const GET = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { cardId } = await params as { cardId: string };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  try {
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Fetch full card details for the authenticated account
      const cardResult = await tx
        .select({
          id: cards.id,
          createdAt: cards.createdAt,
          title: cards.title,
          isApproved: cards.isApproved,
          price: cards.price,
          body: cards.body,
          storeId: cards.storeId,
          accountId: cards.accountId,
          storagePrefix: cards.storagePrefix,
          location: cards.location,
          images: cards.images,
          cover: cards.cover,
          video: cards.video,
          updatedAt: cards.updatedAt,
          filtersOptions: cards.filtersOptions,
          categories: cards.categories,
          storeName: stores.title,
        })
        .from(cards)
        .leftJoin(stores, eq(cards.storeId, stores.id))
        .where(eq(cards.id, parseInt(cardId)))
        .limit(1);

      if (!cardResult || cardResult.length === 0) {
        throw new Error('Card not found');
      }

      const card = cardResult[0];

      // Fetch published data if exists
      const publishedDataResult = await tx
        .select()
        .from(cardsPublished)
        .where(eq(cardsPublished.cardId, parseInt(cardId)))
        .limit(1);

      const publishedData = publishedDataResult.length > 0 ? publishedDataResult[0] : null;

      return {
        card,
        published_data: publishedData,
        is_published: !!publishedData
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Card not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch card details'
    }, { status: 500 });
  }
});
