import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cards, cardsPublished, accounts, actionLogs } from '@/db';
import { syncCard } from '@/lib/utils/syncCardToOpenSearchUtility';

export const PUT = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { cardId } = await params as { cardId: string };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  if (!cardId || isNaN(parseInt(cardId))) {
    return NextResponse.json({ error: 'Valid card ID is required' }, { status: 400 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const {
      title,
      body: description,
      price,
      location,
      images,
      video,
      categories,
      options
    } = body;

    // Validate that at least one field is provided
    const hasUpdates = [title, description, price, location, images, video, categories, options].some(v => v !== undefined && v !== null);
    if (!hasUpdates) {
      return NextResponse.json({ error: 'At least one field must be updated' }, { status: 400 });
    }

    // Use a transaction to handle all operations
    const result = await db.transaction(async (tx: DbTransaction) => {
      // First check if card exists
      const cardResult = await tx
        .select({
          id: cards.id,
          title: cards.title,
          body: cards.body,
          price: cards.price,
          location: cards.location,
          images: cards.images,
          video: cards.video,
          categories: cards.categories,
          accountId: cards.accountId,
        })
        .from(cards)
        .leftJoin(accounts, eq(cards.accountId, accounts.id))
        .where(eq(cards.id, parseInt(cardId)))
        .limit(1);

      if (!cardResult || cardResult.length === 0) {
        throw new Error('Card not found');
      }

      const card = cardResult[0];

      // Build dynamic update object
      const updateData: any = {
        updatedAt: new Date(),
        isApproved: false, // Mark as pending review when updated
      };

      if (title !== undefined && title !== null) {
        updateData.title = title.trim();
      }

      if (description !== undefined && description !== null) {
        updateData.body = description;
      }

      if (price !== undefined && price !== null) {
        updateData.price = price;
      }

      if (location !== undefined && location !== null) {
        updateData.location = location;
      }

      if (images !== undefined && images !== null) {
        updateData.images = images;
      }

      if (video !== undefined && video !== null) {
        updateData.video = video;
      }

      if (categories !== undefined && categories !== null) {
        updateData.categories = categories;
      }

      if (options !== undefined && options !== null) {
        updateData.filtersOptions = options;
      }

      // Update the card
      const updatedCardResult = await tx
        .update(cards)
        .set(updateData)
        .where(eq(cards.id, parseInt(cardId)))
        .returning();

      const updatedCard = updatedCardResult[0];

      // If card has published version, also update it to keep in sync
      const publishedCardResult = await tx
        .select({ id: cardsPublished.id })
        .from(cardsPublished)
        .where(eq(cardsPublished.cardId, parseInt(cardId)))
        .limit(1);

      if (publishedCardResult && publishedCardResult.length > 0) {
        const publishedCard = publishedCardResult[0];

        // Build update for published card
        const publishedUpdateData: any = {
          updatedAt: new Date(),
        };

        if (title !== undefined && title !== null) {
          publishedUpdateData.title = title.trim();
        }

        if (description !== undefined && description !== null) {
          publishedUpdateData.body = description;
        }

        if (price !== undefined && price !== null) {
          publishedUpdateData.price = price;
        }

        if (location !== undefined && location !== null) {
          publishedUpdateData.location = location;
        }

        if (images !== undefined && images !== null) {
          publishedUpdateData.images = images;
        }

        if (video !== undefined && video !== null) {
          publishedUpdateData.video = video;
        }

        if (categories !== undefined && categories !== null) {
          publishedUpdateData.categories = categories;
        }

        if (options !== undefined && options !== null) {
          publishedUpdateData.filtersOptions = options;
        }

        const updatedPublishedResult = await tx
          .update(cardsPublished)
          .set(publishedUpdateData)
          .where(eq(cardsPublished.id, publishedCard.id))
          .returning();

        const updatedPublished = updatedPublishedResult[0];

        // Sync with OpenSearch if published
        if (updatedPublished) {
          await syncCard(updatedPublished.id, updatedPublished);
        }
      }

      // Log the action with details of what was updated
      const updatedFieldsList = [];
      if (title !== undefined && title !== null) updatedFieldsList.push('title');
      if (description !== undefined && description !== null) updatedFieldsList.push('body');
      if (price !== undefined && price !== null) updatedFieldsList.push('price');
      if (location !== undefined && location !== null) updatedFieldsList.push('location');
      if (images !== undefined && images !== null) updatedFieldsList.push('images');
      if (video !== undefined && video !== null) updatedFieldsList.push('video');
      if (categories !== undefined && categories !== null) updatedFieldsList.push('categories');
      if (options !== undefined && options !== null) updatedFieldsList.push('options');

      return {
        card: updatedCard,
        updatedFields: updatedFieldsList,
        message: `Card updated successfully. Fields updated: ${updatedFieldsList.join(', ')}`
      };
    });

    return NextResponse.json({
      message: result.message,
      data: result
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update card'
    }, { status: 500 });
  }
})