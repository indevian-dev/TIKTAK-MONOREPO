import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import {
  db,
  eq,
  and,
  or,
  isNull
} from '@/db';
import {
  cardsPublished,
  accounts,
  stores,
  conversations,
  actionLogs
} from '@/db/schema';
import { ablyRest } from '@/lib/clients/ablyChatClient';

export const POST = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
    try {
      if (!authData || !authData.account) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const accountId = authData.account.id;

      const body = await req.json();
      const { cardId, message } = body;

      if (!cardId || !message) {
        return NextResponse.json({
          error: 'Card ID and message are required'
        }, { status: 400 });
      }

      // Get card information and determine the other participant
      const cardResult = await db
        .select({
          id: cardsPublished.id,
          title: cardsPublished.title,
          accountId: cardsPublished.accountId,
          storeId: cardsPublished.storeId,
          isActive: cardsPublished.isActive,
          price: cardsPublished.price,
          body: cardsPublished.body,
          images: cardsPublished.images,
          storagePrefix: cardsPublished.storagePrefix
        })
        .from(cardsPublished)
        .where(
          and(
            eq(cardsPublished.id, cardId),
            eq(cardsPublished.isActive, true)
          )
        )
        .limit(1);

      if (!cardResult || cardResult.length === 0) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
      }

      const card = cardResult[0];

      // Determine the other participant (card owner or store owner)
      const otherParticipantId = card.accountId;

      if (!otherParticipantId) {
        return NextResponse.json({
          error: 'Card does not have an associated account'
        }, { status: 400 });
      }

      if (otherParticipantId === accountId) {
        return NextResponse.json({
          error: 'Cannot start conversation with yourself'
        }, { status: 400 });
      }

      // Check if conversation already exists
      const existingConversation = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.accountId, accountId),
            eq(conversations.cardAccountId, otherParticipantId),
            eq(conversations.cardId, cardId),
            or(
              isNull(conversations.isActive),
              eq(conversations.isActive, true)
            )
          )
        )
        .limit(1);

      if (existingConversation && existingConversation.length > 0) {
        return NextResponse.json({
          error: 'Conversation already exists',
          conversationId: existingConversation[0].id
        }, { status: 409 });
      }

      // Create new conversation, room, and send first message
      const result = await db.transaction(async (tx: DbTransaction) => {
        // Create conversation in database
        const conversationResult = await tx
          .insert(conversations)
          .values({
            cardId: cardId,
            cardStoreId: card.storeId,
            cardAccountId: card.accountId,
            accountId: accountId,
            updatedAt: new Date(),
            hasNew: true
          })
          .returning();

        const conversation = conversationResult[0];

        // Send first message via Ably channel (if available)
        if (ablyRest) {
          const channel = ablyRest.channels.get(`conversation-${conversation.id}`);
          await channel.publish('new-message', {
            message: {
              id: `msg-${Date.now()}`,
              content: message,
              createdAt: new Date().toISOString(),
              senderId: accountId,
              messageType: 'text'
            },
            conversationId: conversation.id,
            senderId: accountId
          });
        }

        // Log the action
        await tx
          .insert(actionLogs)
          .values({
            action: 'start_conversation',
            createdBy: accountId,
            resourceType: 'conversations',
            resourceId: conversation.id
          });

        return {
          conversation,
          message: {
            id: `msg-${Date.now()}`,
            content: message,
            createdAt: new Date().toISOString(),
            senderId: accountId,
            messageType: 'text'
          }
        };
      });

      return NextResponse.json({
        success: true,
        data: result
      }, { status: 201 });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({
        error: errorMessage || 'Failed to create conversation'
      }, { status: 500 });
    }
  })
