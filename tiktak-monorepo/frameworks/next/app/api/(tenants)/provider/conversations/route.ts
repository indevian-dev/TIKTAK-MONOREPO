import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  or,
  and,
  isNull,
  desc,
  aliasedTable
} from '@/db';
import {
  conversations,
  cards,
  stores,
  accounts
} from '@/db/schema';

export const GET = withApiHandler(async (req: NextRequest, { authData, params }: ApiHandlerContext) => {
  try {
    // Get authenticated account ID from cookie
    // 1. Validate API Request (Auth, Permissions, 2FA, Suspension)
    // Auth handled by withApiHandler - authData available in context
    const accountId = authData?.account?.id;
    if (!accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Create aliases for accounts table (initiator and card owner)
    const initiatorAccount = aliasedTable(accounts, 'initiator_account');
    const cardOwnerAccount = aliasedTable(accounts, 'card_owner_account');

    // Get conversations for the authenticated user using Drizzle ORM
    const conversationsData = await db
      .select({
        // Conversation fields
        id: conversations.id,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        isActive: conversations.isActive,
        hasNew: conversations.hasNew,
        cardId: conversations.cardId,
        cardStoreId: conversations.cardStoreId,
        cardAccountId: conversations.cardAccountId,
        accountId: conversations.accountId,
        // Card fields
        cardTitle: cards.title,
        cardImages: cards.images,
        // Store fields
        storeTitle: stores.title,
        storeLogo: stores.logo,
        // Initiator account fields
        initiatorAccountId: initiatorAccount.id,
        initiatorUserId: initiatorAccount.userId,
        // Card owner account fields
        cardOwnerAccountId: cardOwnerAccount.id,
        cardOwnerUserId: cardOwnerAccount.userId,
      })
      .from(conversations)
      .leftJoin(cards, eq(conversations.cardId, cards.id))
      .leftJoin(stores, eq(conversations.cardStoreId, stores.id))
      .leftJoin(initiatorAccount, eq(conversations.accountId, initiatorAccount.id))
      .leftJoin(cardOwnerAccount, eq(conversations.cardAccountId, cardOwnerAccount.id))
      .where(
        and(
          or(
            eq(conversations.accountId, accountId),
            eq(conversations.cardAccountId, accountId)
          ),
          or(
            isNull(conversations.isActive),
            eq(conversations.isActive, true)
          )
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset);

    // Compute derived fields in JavaScript instead of SQL
    const conversationsWithRoomInfo = conversationsData.map(conversation => ({
      ...conversation,
      // Compute other participant details based on who the current user is
      otherParticipantUserId: conversation.accountId === accountId
        ? conversation.cardOwnerUserId
        : conversation.initiatorUserId,
      otherParticipantRole: conversation.accountId === accountId
        ? 'Card Owner'
        : 'You',
      // Client-side @ably/chat will handle room management
      unreadMessagesCount: 0
    }));

    return NextResponse.json({
      success: true,
      data: conversationsWithRoomInfo,
      pagination: {
        limit,
        offset,
        hasMore: conversationsWithRoomInfo.length === limit
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message || 'Failed to fetch conversations'
    }, { status: 500 });
  }
})
