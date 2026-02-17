import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextResponse } from 'next/server';

export const GET = unifiedApiHandler(async (_req, { module, log }) => {
  try {
    const cards = await module.cards.getFeaturedCards();
    return NextResponse.json({ cards });
  } catch (error) {
    log?.error('Error fetching homepage cards', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch homepage cards'
    }, { status: 500 });
  }
});
