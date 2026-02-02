import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextResponse } from 'next/server';
import { eq, and, ilike, exists, desc, count } from '@/db';
import { cards, cardsPublished, stores } from '@/db';
import type { ApiRouteHandler, ApiHandlerContext, DbTransaction } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  // Filter parameters
  const cardId = searchParams.get('cardId');
  const title = searchParams.get('title');
  const storeName = searchParams.get('storeName');
  const categoryId = searchParams.get('categoryId');
  const isApproved = searchParams.get('isApproved');
  const isActive = searchParams.get('isActive');

  const from = (page - 1) * pageSize;

  try {
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Build the WHERE conditions dynamically
      const whereConditions = [];

      // Card ID filter
      if (cardId && cardId.trim() !== '') {
        whereConditions.push(eq(cards.id, parseInt(cardId)));
      }

      // Title filter (case insensitive search)
      if (title && title.trim() !== '') {
        whereConditions.push(ilike(cards.title, `%${title}%`));
      }

      // Store filter
      if (storeName && storeName.trim() !== '') {
        whereConditions.push(eq(cards.storeId, parseInt(storeName)));
      }

      // Approval status filter
      if (isApproved && isApproved.trim() !== '') {
        whereConditions.push(eq(cards.isApproved, isApproved === 'true'));
      }

      // Active status filter - check in cards_published table
      if (isActive && isActive.trim() !== '') {
        whereConditions.push(
          exists(
            tx
              .select()
              .from(cardsPublished)
              .where(
                and(
                  eq(cardsPublished.cardId, cards.id),
                  eq(cardsPublished.isActive, isActive === 'true')
                )
              )
          )
        );
      }

      // Combine WHERE conditions
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Fetch card info with published data (without complex SQL)
      const cardsResult = await tx
        .select({
          id: cards.id,
          title: cards.title,
          body: cards.body,
          price: cards.price,
          createdAt: cards.createdAt,
          updatedAt: cards.updatedAt,
          isApproved: cards.isApproved,
          storeId: cards.storeId,
          accountId: cards.accountId,
          categories: cards.categories,
          filtersOptions: cards.filtersOptions,
          images: cards.images,
          video: cards.video,
          cover: cards.cover,
          location: cards.location,
          storagePrefix: cards.storagePrefix,
          storeName: stores.title,
          publishedId: cardsPublished.id,
          publishedTitle: cardsPublished.title,
          publishedBody: cardsPublished.body,
          publishedPrice: cardsPublished.price,
          publishedLocation: cardsPublished.location,
          publishedIsActive: cardsPublished.isActive,
          publishedStoragePrefix: cardsPublished.storagePrefix,
          publishedCover: cardsPublished.cover,
          publishedVideo: cardsPublished.video,
          publishedImages: cardsPublished.images,
          publishedCategories: cardsPublished.categories,
          publishedFiltersOptions: cardsPublished.filtersOptions,
          publishedCreatedAt: cardsPublished.createdAt,
          publishedUpdatedAt: cardsPublished.updatedAt,
          publishedPremiumUntil: cardsPublished.premiumUntil,
        })
        .from(cards)
        .leftJoin(stores, eq(cards.storeId, stores.id))
        .leftJoin(cardsPublished, eq(cardsPublished.cardId, cards.id))
        .where(whereClause)
        .orderBy(desc(cards.createdAt));

      // Category filter (filter in application since categories is JSONB)
      let filteredCards = cardsResult;
      if (categoryId && categoryId.trim() !== '') {
        const parsedCategoryId = parseInt(categoryId);
        filteredCards = cardsResult.filter(card => {
          if (!card.categories) return false;
          const categoryList = Array.isArray(card.categories)
            ? card.categories
            : Object.values(card.categories as object);
          return categoryList.includes(parsedCategoryId);
        });
      }

      // Transform published data into nested object
      const transformedCards = filteredCards.map(card => ({
        id: card.id,
        title: card.title,
        body: card.body,
        price: card.price,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        isApproved: card.isApproved,
        storeId: card.storeId,
        accountId: card.accountId,
        categories: card.categories,
        filtersOptions: card.filtersOptions,
        images: card.images,
        video: card.video,
        cover: card.cover,
        location: card.location,
        storagePrefix: card.storagePrefix,
        storeName: card.storeName,
        publishedData: card.publishedId ? {
          id: card.publishedId,
          title: card.publishedTitle,
          body: card.publishedBody,
          price: card.publishedPrice,
          location: card.publishedLocation,
          is_active: card.publishedIsActive,
          storage_prefix: card.publishedStoragePrefix,
          cover: card.publishedCover,
          video: card.publishedVideo,
          images: card.publishedImages,
          categories: card.publishedCategories || [],
          filters_options: card.publishedFiltersOptions || [],
          created_at: card.publishedCreatedAt,
          updated_at: card.publishedUpdatedAt,
          premium_until: card.publishedPremiumUntil,
        } : null,
      }));

      // Apply pagination to filtered results
      const total = transformedCards.length;
      const paginatedCards = transformedCards.slice(from, from + pageSize);

      return {
        cards: paginatedCards,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch cards'
    }, { status: 500 });
  }
});
