import { NextResponse } from 'next/server';
import { cards, stores, accounts, users, cardsPublished, eq, and, or, gte, lte, ilike, desc } from '@/db';
import { count } from 'drizzle-orm';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import type { CardRow } from '@/types/resources/card/cardDb';

export const GET = withApiHandler(async (request: NextRequest, { authData , db }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!authData.account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 401 });
  }

  const accountId = authData.account.id;
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');
  const mode = searchParams.get('mode') || 'personal';

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  const cardId = searchParams.get('cardId');
  const title = searchParams.get('title');
  const categoryId = searchParams.get('categoryId');
  const isApproved = searchParams.get('isApproved');
  const isActive = searchParams.get('isActive');
  const fromPrice = searchParams.get('fromPrice');
  const toPrice = searchParams.get('toPrice');
  const searchText = searchParams.get('searchText');

  const from = (page - 1) * pageSize;

  try {
    // Build where conditions
    const conditions: any[] = [];
    // Ownership filter
    if (mode === 'store' && storeId) {
      conditions.push(eq(cards.storeId, parseInt(storeId)));
    } else {
      conditions.push(eq(cards.accountId, accountId));
    }

    // Card ID filter
    if (cardId && cardId.trim() !== '') {
      conditions.push(eq(cards.id, parseInt(cardId)));
    }

    // Title search
    const searchTerm = title || searchText;
    if (searchTerm && searchTerm.trim() !== '') {
      conditions.push(ilike(cards.title, `%${searchTerm}%`));
    }

    // Approval filter
    if (isApproved && isApproved.trim() !== '') {
      conditions.push(eq(cards.isApproved, isApproved === 'true'));
    }

    // Active filter (note: cards table doesn't have is_active, only cards_published does)
    // Skipping isActive filter for cards table

    // Price range filters
    if (fromPrice && fromPrice.trim() !== '') {
      conditions.push(gte(cards.price, parseFloat(fromPrice)));
    }

    if (toPrice && toPrice.trim() !== '') {
      conditions.push(lte(cards.price, parseFloat(toPrice)));
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Get cards first
    let cardsResult = await db
      .select()
      .from(cards)
      .where(whereCondition)
      .orderBy(desc(cards.createdAt));

    // Category filter (filter in application since categories is JSONB array)
    const parsedCategoryId = categoryId && categoryId.trim() !== '' && categoryId !== 'NaN'
      ? parseInt(categoryId)
      : null;

    if (parsedCategoryId !== null) {
      cardsResult = cardsResult.filter((card: CardRow) => {
        if (!card.categories) return false;
        const categories = Array.isArray(card.categories)
          ? card.categories
          : Object.values(card.categories as object);
        return categories.includes(parsedCategoryId);
      });
    }

    // Apply pagination to filtered results
    const total = cardsResult.length;
    const paginatedCards = cardsResult.slice(from, from + pageSize);

    const result = {
      operation: 'success',
      cards: paginatedCards,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page < Math.ceil(total / pageSize),
      hasPrevPage: page > 1
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching cards' }, { status: 500 });
  }
});
