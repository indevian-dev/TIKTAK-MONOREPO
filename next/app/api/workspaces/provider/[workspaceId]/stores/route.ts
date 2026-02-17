import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { ModuleFactory } from '@/lib/domain/factory';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';

export const GET = withApiHandler(async (request: NextRequest, ctx: ApiHandlerContext) => {
  const { authData } = ctx;
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const modules = new ModuleFactory(authData as any);

  try {
    const stores = await modules.stores.listMyStores();
    return NextResponse.json({
      operation: 'success',
      stores
    });
  } catch (error) {
    console.error('[Stores API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
});
