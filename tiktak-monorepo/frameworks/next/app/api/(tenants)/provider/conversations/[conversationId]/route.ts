import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  and,
  or,
  isNull,
  aliasedTable
} from '@/db';
import {
  conversations,
  cards,
  stores,
  accounts,
  users
} from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const GET = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    if (!resolvedParams?.conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }
    const conversationId = requireIntParam(resolvedParams.conversationId, 'Conversation ID');
    const accountId = authData.account.id;

    // Create aliases for multiple joins
    const initiatorAccount = aliasedTable(accounts, 'initiator_account');
    const cardOwnerAccount = aliasedTable(accounts, 'card_owner_account');
    const initiatorUser = aliasedTable(users, 'initiator_user');
    const cardOwnerUser = aliasedTable(users, 'card_owner_user');

    // Get conversation details with complex joins
    const conversationResults = await db
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
        // Card details
        cardTitle: cards.title,
        cardImages: cards.images,
        // Store details
        storeTitle: stores.title,
        storeLogo: stores.logo,
        // Initiator user details
        initiatorUserId: initiatorUser.id,
        initiatorName: initiatorUser.name,
        initiatorLastName: initiatorUser.lastName,
        initiatorAvatar: initiatorUser.avatarUrl,
        // Card owner user details
        cardOwnerUserId: cardOwnerUser.id,
        cardOwnerName: cardOwnerUser.name,
        cardOwnerLastName: cardOwnerUser.lastName,
        cardOwnerAvatar: cardOwnerUser.avatarUrl,
      })
      .from(conversations)
      .leftJoin(cards, eq(conversations.cardId, cards.id))
      .leftJoin(stores, eq(conversations.cardStoreId, stores.id))
      .leftJoin(initiatorAccount, eq(conversations.accountId, initiatorAccount.id))
      .leftJoin(cardOwnerAccount, eq(conversations.cardAccountId, cardOwnerAccount.id))
      .leftJoin(initiatorUser, eq(initiatorAccount.userId, initiatorUser.id))
      .leftJoin(cardOwnerUser, eq(cardOwnerAccount.userId, cardOwnerUser.id))
      .where(
        and(
          eq(conversations.id, conversationId),
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
      .limit(1);

    if (!conversationResults || conversationResults.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conversation = conversationResults[0];

    // Determine other participant details based on current user's role
    const isInitiator = conversation.accountId === accountId;
    const otherParticipantUserId = isInitiator ? conversation.cardOwnerUserId : conversation.initiatorUserId;
    const otherParticipantName = isInitiator ? conversation.cardOwnerName : conversation.initiatorName;
    const otherParticipantLastName = isInitiator ? conversation.cardOwnerLastName : conversation.initiatorLastName;
    const otherParticipantAvatar = isInitiator ? conversation.cardOwnerAvatar : conversation.initiatorAvatar;
    const otherParticipantRole = isInitiator ? 'Card Owner' : 'Conversation Initiator';

    return NextResponse.json({
      success: true,
      data: {
        ...conversation,
        otherParticipantUserId,
        otherParticipantName,
        otherParticipantLastName,
        otherParticipantAvatar,
        otherParticipantRole
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: errorMessage || 'Failed to fetch conversation'
    }, { status: 500 });
  }
})
