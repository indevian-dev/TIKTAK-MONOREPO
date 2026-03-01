import { NextRequest } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { okResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { db } from '@/lib/database';
import { CardsRepository } from '@/lib/domain/cards/Cards.repository';
import { CardsService } from '@/lib/domain/cards/Cards.service';
import type { Card } from '@/lib/domain/cards/Cards.types';

/**
 * GET /api/cards/search
 *
 * Searches cards via neon_search_cards (Neon PG) and returns
 * mapped Card.PublicAccess objects (camelCase).
 *
 * Query params:
 *   categoryIds  - comma-separated category IDs
 *   searchText   - text to search in title
 *   priceMin     - minimum price
 *   priceMax     - maximum price
 *   workspaceId  - filter by workspace
 *   pagination   - max results (default 12)
 */
export const GET = unifiedApiHandler(async (request: NextRequest, { log }) => {
  const params = request.nextUrl.searchParams;

  const query: Card.SearchQuery = {
    categoryIds: params.get('categoryIds') ?? undefined,
    searchText: params.get('searchText') ?? undefined,
    priceMin: params.get('priceMin') ? parseFloat(params.get('priceMin')!) : undefined,
    priceMax: params.get('priceMax') ? parseFloat(params.get('priceMax')!) : undefined,
    workspaceId: params.get('workspaceId') ?? undefined,
    pagination: parseInt(params.get('pagination') || '12', 10),
  };

  try {
    const repo = new CardsRepository(db);
    const service = new CardsService(repo, {} as any, db);
    const result = await service.searchCards(query);

    return okResponse({
      operation: 'success',
      mode: 'simple',
      cards: result.cards,
      total: result.total,
    });
  } catch (error) {
    log?.error('Search failed', error as Error);
    return serverErrorResponse('Search failed');
  }
});
