import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { stores, actionLogs, eq } from '@/db';
import { NextResponse } from 'next/server';
import { requireIntParam } from '@/lib/utils/paramsHelper';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    // Extract the id from the URL parameters
    const storeId = requireIntParam(resolvedParams.id, 'Store ID');
    const authAccId = authData?.account?.id;

    // Execute query in a transaction
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Fetch the specific store by ID
      const [store] = await tx
        .select()
        .from(stores)
        .where(eq(stores.id, storeId));

      // Check if store exists
      if (!store) {
        throw new Error('Store not found');
      }

      // Log the action
      return store;
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Store not found') {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({
      error: errorMessage || 'Failed to fetch store'
    }, { status: 500 });
  }
})