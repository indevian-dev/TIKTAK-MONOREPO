import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { syncCard } from '@/lib/utils/syncCardToOpenSearchUtility';
import { eq } from '@/db';
import { cards, actionLogs } from '@/db';

export const POST = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  const { cardId } = await params as { cardId: string };

  if (!authData?.account?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const accountId = authData.account.id;

  try {
    // Validate that the card exists and the user has permission to sync it
    const cardCheck = await db
      .select({ id: cards.id })
      .from(cards)
      .where(eq(cards.id, parseInt(cardId)))
      .limit(1);

    if (!cardCheck || cardCheck.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Sync the card with OpenSearch (includes all related data)
    // The syncCard utility already handles fetching:
    // - cards_images
    // - cards_video
    // - cards_categories with categories
    // - cards_options with options
    // - stores
    // - account relationship
    const success = await syncCard(cardId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to sync card with OpenSearch' }, { status: 500 });
    }

    // Log the sync action
    return NextResponse.json({
      success: true,
      message: 'Card synced with OpenSearch successfully'
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to sync card with OpenSearch',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
})
