import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { stores } from '@/db/schema';
import { ValidationService } from '@/lib/services/ValidationService';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (_request: NextRequest, { params, db, log }: ApiHandlerContext) => {
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
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    if (!store) {
      return NextResponse.json({
        error: 'Store not found'
      }, { status: 404 });
    }

    // Note: categories_stores_cards_stats is a view/function
    // If needed, query it separately or create a proper schema
    return NextResponse.json({ store });
  } catch (error) {
    log?.error('Error fetching store', error as Error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, { status: 500 });
  }
})