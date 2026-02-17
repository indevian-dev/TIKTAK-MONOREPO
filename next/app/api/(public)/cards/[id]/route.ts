import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextResponse } from 'next/server';
import { ValidationService } from '@/lib/domain/services/ValidationService';

export const GET = unifiedApiHandler(async (_req, { params, module, log }) => {
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
    const card = await module.cards.getPublicCard(cardId);

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
});
