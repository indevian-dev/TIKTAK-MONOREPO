import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextResponse } from 'next/server';
import { ValidationService } from '@/lib/domain/services/ValidationService';

export const GET = unifiedApiHandler(async (_request, { params, module, log }) => {
  const resolvedParams = await params;

  if (!resolvedParams?.id) {
    return NextResponse.json({
      error: 'Store ID is required'
    }, { status: 400 });
  }

  const { id } = resolvedParams;

  // Validate ID parameter
  const idValidation = ValidationService.validateId(id);
  if (!idValidation.isValid) {
    return NextResponse.json({
      error: 'Valid ID is required'
    }, { status: 400 });
  }

  try {
    const storeId = Number(idValidation.sanitized);
    const store = await module.stores.getPublicStore(storeId);

    if (!store) {
      return NextResponse.json({
        error: 'Store not found'
      }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    log?.error('Error fetching store', error as Error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, { status: 500 });
  }
});