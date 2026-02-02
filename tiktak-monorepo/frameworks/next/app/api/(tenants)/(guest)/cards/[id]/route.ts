import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { cardsPublished, stores } from '@/db/schema';
import { ValidationService } from '@/lib/services/ValidationService';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (_req: NextRequest, { authData: _authData, params, db, log }: ApiHandlerContext) => {
  const resolvedParams = await params;
  const { id } = resolvedParams || { id: '' };

  // Validate ID parameter
  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return NextResponse.json({
      error: 'Valid ID is required'
    }, { status: 400 });
  }

  try {
    const cardId = Number(idValidation.sanitized);
    const [card] = await db
      .select()
      .from(cardsPublished)
      .leftJoin(stores, eq(cardsPublished.storeId, stores.id))
      .where(eq(cardsPublished.id, cardId));

    if (!card) {
      return NextResponse.json({
        error: 'Card not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      card: {
        ...card.cards_published,
        stores: card.tenants_providers_type_store
      }
    }, { status: 200 });
  } catch (error) {
    log?.error('Error fetching card', error as Error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, { status: 500 });
  }
})
