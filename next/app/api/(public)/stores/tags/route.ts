import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextResponse } from 'next/server';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const tags = await module.stores.getStoreTags(true);
    return NextResponse.json({ tags });
  } catch (error) {
    log?.error('Error fetching store tags', error as Error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store tags';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
});

